package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.employee.dto.EmployeeResponse;
import com.naren.erpbackend.employee.dto.EmployeeResponseMapper;
import com.naren.erpbackend.employee.dto.OrgChartNode;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.employee.repository.EmployeeSpecifications;
import com.naren.erpbackend.user.entity.UserStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeQServiceImpl implements EmployeeQService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeResponseMapper employeeResponseMapper;

    @Override
    public EmployeeResponse findEmployeeById(Long id) {
        log.info("Fetch employee: id={}", id);
        Employee employee = employeeRepository.findById(id)
                .filter(e -> !e.isDeleted())
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Employee not found with id: " + id)
                );
        return employeeResponseMapper.apply(employee);
    }

    @Override
    public EmployeeResponse findEmployeeByEmail(String email) {
        log.info("Fetch employee: email={}", email);
        Employee employee = employeeRepository
                .findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with email: " + email)
                );
        return employeeResponseMapper.apply(employee);
    }

    @Override
    public Page<EmployeeResponse> findAllEmployees(Pageable pageable) {
        log.info("Fetch all employees: page={}, size={}", pageable.getPageNumber(),
                pageable.getPageSize());
        return employeeRepository
                .findAllNonDeleted(pageable)
                .map(employeeResponseMapper);
    }

    @Override
    public Page<EmployeeResponse> searchEmployees(String keyword, Pageable pageable) {
        log.info("Search employees: keyword={}", keyword);
        return employeeRepository
                .searchEmployees(keyword, pageable)
                .map(employeeResponseMapper);
    }

    @Override
    public Page<EmployeeResponse> filterEmployees(String keyword, UserStatus status,
                                                  Long departmentId, Pageable pageable) {
        log.info("Filter employees: keyword={}, status={}, departmentId={}, page={}, size={}",
                keyword, status, departmentId, pageable.getPageNumber(), pageable.getPageSize());

        Specification<Employee> spec = Specification.where(EmployeeSpecifications.notDeleted());
        if (StringUtils.hasText(keyword)) {
            spec = spec.and(EmployeeSpecifications.departmentNameLike(keyword.trim()));
        }
        if (status != null) {
            spec = spec.and(EmployeeSpecifications.hasStatus(status));
        }
        if (departmentId != null) {
            spec = spec.and(EmployeeSpecifications.inDepartment(departmentId));
        }

        return employeeRepository.findAll(spec, pageable).map(employeeResponseMapper);
    }

    @Override
    public Page<EmployeeResponse> findEmployeesByDepartment(Long departmentId, Pageable pageable) {
        log.info("Fetch employees by department: departmentId={}", departmentId);
        return employeeRepository
                .findByDepartmentId(departmentId, pageable).
                map(employeeResponseMapper);
    }

    @Override
    public Page<EmployeeResponse> findEmployeesByManager(Long managerId, Pageable pageable) {
        log.info("Fetch employees by manager: managerId={}", managerId);
        return employeeRepository
                .findByManagerId(managerId, pageable)
                .map(employeeResponseMapper);
    }

    @Override
    public java.util.List<EmployeeResponse> findDirectReports(Long managerId) {
        log.info("Fetch direct reports: managerId={}", managerId);
        return employeeRepository.findDirectReports(managerId).stream()
                .map(employeeResponseMapper)
                .toList();
    }

    @Override
    public List<OrgChartNode> findOrgChart() {
        log.info("Fetch org chart");
        List<Employee> employees = employeeRepository.findAll().stream()
                .filter(employee -> !employee.isDeleted())
                .toList();

        Comparator<OrgChartNode> byName = Comparator
                .comparing(OrgChartNode::firstName, Comparator.nullsFirst(Comparator.naturalOrder()))
                .thenComparing(OrgChartNode::lastName, Comparator.nullsFirst(Comparator.naturalOrder()));

        Map<Long, OrgChartNode> nodeMap = new LinkedHashMap<>();
        Map<Long, Long> managerIdByEmployeeId = new HashMap<>();
        Map<Long, Employee> employeeMap = new HashMap<>();

        for (Employee employee : employees) {
            employeeMap.put(employee.getId(), employee);
            Long managerId = employee.getManager() != null ? employee.getManager().getId() : null;
            managerIdByEmployeeId.put(employee.getId(), managerId);
            String departmentName = employee.getDepartment() != null
                    ? employee.getDepartment().getName()
                    : null;
            nodeMap.put(employee.getId(), new OrgChartNode(
                    employee.getId(),
                    employee.getFirstName(),
                    employee.getLastName(),
                    employee.getJobTitle(),
                    departmentName,
                    managerId,
                    null,
                    new ArrayList<>()
            ));
        }

        for (Employee employee : employees) {
            OrgChartNode node = nodeMap.get(employee.getId());
            Long managerId = managerIdByEmployeeId.get(employee.getId());
            if (managerId == null) {
                continue;
            }
            String managerName;
            if (employee.getManager() != null) {
                managerName = employee.getManager().getFirstName() + " "
                        + employee.getManager().getLastName();
            } else {
                Employee manager = employeeMap.get(managerId);
                managerName = manager != null
                        ? manager.getFirstName() + " " + manager.getLastName()
                        : null;
            }
            OrgChartNode nodeWithManager = new OrgChartNode(
                    node.id(),
                    node.firstName(),
                    node.lastName(),
                    node.jobTitle(),
                    node.departmentName(),
                    node.managerId(),
                    managerName,
                    node.children()
            );
            nodeMap.put(employee.getId(), nodeWithManager);
            OrgChartNode parentNode = nodeMap.get(managerId);
            if (parentNode != null) {
                parentNode.children().add(nodeWithManager);
            }
        }

        List<OrgChartNode> roots = nodeMap.values().stream()
                .filter(n -> n.managerId() == null)
                .sorted(byName)
                .toList();
        roots.forEach(root -> root.children().sort(byName));
        nodeMap.values().forEach(n -> n.children().sort(byName));
        return roots;
    }
}
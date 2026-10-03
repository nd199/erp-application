package com.naren.erpbackend.employee.dto;

import java.util.List;

public record OrgChartNode(
        Long id,
        String firstName,
        String lastName,
        String jobTitle,
        String departmentName,
        Long managerId,
        String managerName,
        List<OrgChartNode> children
) {
}

package com.naren.erpbackend.hcm.dto;

import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.hcm.entity.PayrollItem;
import com.naren.erpbackend.hcm.entity.PayrollRun;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.function.Function;

@Component
public class PayslipResponseMapper implements Function<PayrollItem, PayslipResponse> {

    private static final DateTimeFormatter MONTH_FORMAT = DateTimeFormatter.ofPattern("MMMM yyyy");

    @Override
    public PayslipResponse apply(PayrollItem entity) {
        PayrollRun run = entity.getPayrollRun();
        Employee employee = entity.getEmployee();
        BigDecimal basicSalary = entity.getBasicSalary();
        BigDecimal allowances = entity.getAllowances();
        BigDecimal deductions = entity.getDeductions();
        BigDecimal tax = entity.getTax();
        return new PayslipResponse(
                run.getId(),
                run.getPeriodMonth(),
                run.getPeriodYear(),
                java.time.YearMonth.of(run.getPeriodYear(), run.getPeriodMonth())
                        .atDay(1).format(MONTH_FORMAT),
                run.getStatus().name(),
                employee.getId(),
                employee.getFirstName() + " " + employee.getLastName(),
                employee.getEmail(),
                employee.getJobTitle(),
                employee.getDepartment() != null ? employee.getDepartment().getName() : null,
                basicSalary,
                allowances,
                deductions,
                tax,
                entity.getNetPay(),
                basicSalary.add(allowances),
                deductions.add(tax),
                entity.getNotes(),
                run.getProcessedBy() != null
                        ? run.getProcessedBy().getFirstName() + " " + run.getProcessedBy().getLastName()
                        : null,
                Instant.now()
        );
    }
}

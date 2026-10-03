package com.naren.erpbackend.hcm.dto;

import com.naren.erpbackend.hcm.entity.PayrollItem;
import com.naren.erpbackend.hcm.entity.PayrollRun;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.function.Function;

@Component
public class PayrollRunResponseMapper implements Function<PayrollRun, PayrollRunResponse> {

    private static final DateTimeFormatter MONTH_FORMAT = DateTimeFormatter.ofPattern("MMMM yyyy");

    @Override
    public PayrollRunResponse apply(PayrollRun entity) {
        return new PayrollRunResponse(
                entity.getId(),
                entity.getPeriodMonth(),
                entity.getPeriodYear(),
                java.time.YearMonth.of(entity.getPeriodYear(), entity.getPeriodMonth())
                        .atDay(1).format(MONTH_FORMAT),
                entity.getStatus(),
                entity.getTotalGross(),
                entity.getTotalDeductions(),
                entity.getTotalNet(),
                entity.getProcessedBy() != null ? entity.getProcessedBy().getId() : null,
                entity.getProcessedBy() != null
                        ? entity.getProcessedBy().getFirstName() + " " + entity.getProcessedBy().getLastName()
                        : null,
                entity.getNotes(),
                entity.getItems().stream().filter(i -> !i.isDeleted()).map(itemMapper()).toList(),
                entity.getCreatedAt(),
                entity.getLastUpdated()
        );
    }

    private Function<PayrollItem, PayrollItemResponse> itemMapper() {
        return item -> new PayrollItemResponse(
                item.getId(),
                item.getEmployee().getId(),
                item.getEmployee().getFirstName() + " " + item.getEmployee().getLastName(),
                item.getEmployee().getEmail(),
                item.getBasicSalary(),
                item.getAllowances(),
                item.getDeductions(),
                item.getTax(),
                item.getNetPay(),
                item.getNotes()
        );
    }
}

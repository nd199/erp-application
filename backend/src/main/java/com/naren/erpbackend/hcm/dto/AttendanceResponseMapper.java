package com.naren.erpbackend.hcm.dto;

import com.naren.erpbackend.hcm.entity.AttendanceRecord;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class AttendanceResponseMapper implements Function<AttendanceRecord, AttendanceResponse> {

    @Override
    public AttendanceResponse apply(AttendanceRecord entity) {
        return new AttendanceResponse(
                entity.getId(),
                entity.getEmployee().getId(),
                entity.getEmployee().getFirstName() + " " + entity.getEmployee().getLastName(),
                entity.getEmployee().getEmail(),
                entity.getWorkDate(),
                entity.getCheckIn(),
                entity.getCheckOut(),
                entity.getStatus(),
                entity.getNotes(),
                entity.getCreatedAt(),
                entity.getLastUpdated()
        );
    }
}

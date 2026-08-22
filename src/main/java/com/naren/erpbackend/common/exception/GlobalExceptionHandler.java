package com.naren.erpbackend.common.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.net.URI;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class GlobalExceptionHandler {

    private static final String TYPE_BASE = "urn:erp-backend:problem:";

    @ExceptionHandler(UserExistsException.class)
    public ProblemDetail handleUserExists(UserExistsException ex) {
        log.info("Registration rejected: {}", ex.getMessage());
        return problem(HttpStatus.CONFLICT, ex.getMessage(), "user_exists");
    }

    @ExceptionHandler(InvalidUserStateException.class)
    public ProblemDetail handleInvalidUserState(InvalidUserStateException ex) {
        log.warn("Invalid user state transition: {}", ex.getMessage());
        return problem(HttpStatus.CONFLICT, ex.getMessage(), "invalid_user_state");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        log.error("Data integrity violation", ex);
        return problem(HttpStatus.CONFLICT, "Operation conflicts with existing data", "data_integrity_violation");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fieldError -> fieldError.getDefaultMessage() == null
                                ? "Invalid value"
                                : fieldError.getDefaultMessage(),
                        (left, right) -> left
                ));
        ProblemDetail problemDetail = problem(HttpStatus.BAD_REQUEST, "Validation failed", "validation_failed");
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return problemDetail;
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ProblemDetail handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> violations = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        violation -> violation.getPropertyPath().toString(),
                        ConstraintViolation::getMessage,
                        (left, right) -> left
                ));
        ProblemDetail problemDetail = problem(HttpStatus.BAD_REQUEST, "Validation failed", "validation_failed");
        problemDetail.setProperty("fieldErrors", violations);
        return problemDetail;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail handleUnreadable(HttpMessageNotReadableException ex) {
        log.warn("Malformed request body", ex);
        return problem(HttpStatus.BAD_REQUEST, "Malformed request body", "malformed_request");
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnexpected(Exception ex) {
        log.error("Unhandled exception", ex);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", "internal_error");
    }

    private ProblemDetail problem(HttpStatus status, String detail, String type) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(status, detail);
        problemDetail.setTitle(status.getReasonPhrase());
        problemDetail.setType(URI.create(TYPE_BASE + type));
        return problemDetail;
    }
}

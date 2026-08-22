package com.naren.erpbackend.common.exception;

public class InvalidUserStateException extends RuntimeException {

    public InvalidUserStateException(String message) {
        super(message);
    }

    public InvalidUserStateException(String message, Throwable cause) {
        super(message, cause);
    }
}
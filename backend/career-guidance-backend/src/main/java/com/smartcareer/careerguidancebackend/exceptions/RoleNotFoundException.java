package com.smartcareer.careerguidancebackend.exceptions;

// Thrown when a required role cannot be found in the database.
public class RoleNotFoundException extends RuntimeException {

    public RoleNotFoundException(String message) {
        super(message);
    }
}
package com.smartcareer.careerguidancebackend.exceptions;

// Thrown when a resource already exists, such as a username or email.
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
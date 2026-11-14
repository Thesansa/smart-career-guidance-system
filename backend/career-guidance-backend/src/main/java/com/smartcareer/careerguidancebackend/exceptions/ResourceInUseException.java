package com.smartcareer.careerguidancebackend.exceptions;

public class ResourceInUseException extends RuntimeException {

    public ResourceInUseException(String message) {
        super(message);
    }
}
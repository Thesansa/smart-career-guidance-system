package com.smartcareer.careerguidancebackend.dto.response;

// Defines the response returned after successful authentication.
public class JwtResponse {

    private String token;

    public JwtResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
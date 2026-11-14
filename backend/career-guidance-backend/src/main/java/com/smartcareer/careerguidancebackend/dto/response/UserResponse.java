package com.smartcareer.careerguidancebackend.dto.response;

// Defines the user information exposed through the API.
public class UserResponse {

    private Integer id;
    private String username;
    private String email;
    private String role;


    public UserResponse(Integer id, String username,
                        String email, String role) {

        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }


    // Getters

    public Integer getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
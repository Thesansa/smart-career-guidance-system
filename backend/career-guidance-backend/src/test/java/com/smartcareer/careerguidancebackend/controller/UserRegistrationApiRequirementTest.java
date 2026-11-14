package com.smartcareer.careerguidancebackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.smartcareer.careerguidancebackend.config.JwtService;
import com.smartcareer.careerguidancebackend.exceptions.DuplicateResourceException;
import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.service.CustomUserDetailsService;
import com.smartcareer.careerguidancebackend.service.UserService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import org.mockito.ArgumentCaptor;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserRegistrationApiRequirementTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;


    // TEST 1: Valid registration should return user details

    @Test
    void addUser_withValidRequest_shouldReturnSuccess() throws Exception {

        // Arrange
        User savedUser = new User(
                "api_student",
                "api.student@test.com",
                "encoded-password",
                new Role("STUDENT")
        );

        savedUser.setId(101);

        when(userService.saveUser(any(User.class)))
                .thenReturn(savedUser);

        Map<String, Object> request = Map.of(
                "username", "api_student",
                "email", "api.student@test.com",
                "password", "Password123!"
        );


        // Act & Assert
        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))

                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(101))
                .andExpect(jsonPath("$.username").value("api_student"))
                .andExpect(jsonPath("$.email").value("api.student@test.com"))
                .andExpect(jsonPath("$.role").value("STUDENT"))
                .andExpect(jsonPath("$.password").doesNotExist());

        verify(userService).saveUser(any(User.class));
    }


    // TEST 2: Client must not control the assigned role

    @Test
    void addUser_withAdminRoleSubmitted_shouldNotAssignAdminRole() throws Exception {

        // Arrange
        User savedUser = new User(
                "api_student",
                "api.student@test.com",
                "encoded-password",
                new Role("STUDENT")
        );

        savedUser.setId(102);

        when(userService.saveUser(any(User.class)))
                .thenReturn(savedUser);

        // Malicious client attempts to register as ADMIN.
        Map<String, Object> request = Map.of(
                "username", "api_student",
                "email", "api.student@test.com",
                "password", "Password123!",
                "roleId", 1,
                "roleName", "ADMIN"
        );


        // Act
        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))

                // Assert
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("STUDENT"));

        // Verify what the controller actually passed to the service.
        ArgumentCaptor<User> userCaptor =
                ArgumentCaptor.forClass(User.class);

        verify(userService).saveUser(userCaptor.capture());

        User submittedUser = userCaptor.getValue();

        // Controller must not assign a role from client input.
        assertNull(submittedUser.getRole());
    }


    // TEST 3: Invalid registration data should return HTTP 400

    @Test
    void addUser_withInvalidRequest_shouldReturnBadRequest() throws Exception {

        // Arrange
        Map<String, Object> request = Map.of(
                "username", "",
                "email", "invalid-email",
                "password", ""
        );


        // Act & Assert
        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))

                .andExpect(status().isBadRequest());

        // Invalid requests must not reach the service.
        verify(userService, never()).saveUser(any(User.class));
    }


    // TEST 4: Duplicate registration should return HTTP 409

    @Test
    void addUser_withDuplicateAccount_shouldReturnConflict() throws Exception {

        // Arrange
        when(userService.saveUser(any(User.class)))
                .thenThrow(new DuplicateResourceException(
                        "Email already exists."
                ));

        Map<String, Object> request = Map.of(
                "username", "existing_student",
                "email", "existing@test.com",
                "password", "Password123!"
        );


        // Act & Assert
        mockMvc.perform(post("/api/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))

                .andExpect(status().isConflict());

        verify(userService).saveUser(any(User.class));
    }
}
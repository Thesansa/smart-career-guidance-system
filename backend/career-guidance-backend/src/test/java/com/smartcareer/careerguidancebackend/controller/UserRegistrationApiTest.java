package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import com.smartcareer.careerguidancebackend.config.JwtAuthenticationFilter;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserRegistrationApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void registerStudent_withValidDetails_returns200AndUserDetails() throws Exception {

        User savedUser = new User(
                "test_student",
                "student@test.com",
                "encoded-password",
                new Role("STUDENT")
        );

        savedUser.setId(10);

        when(userService.saveUser(any(User.class)))
                .thenReturn(savedUser);

        String requestBody = """
                {
                    "username": "test_student",
                    "email": "student@test.com",
                    "password": "Password123!",
                    "roleId": 2,
                    "roleName": "STUDENT"
                }
                """;

        mockMvc.perform(
                        post("/api/users/add")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.username").value("test_student"))
                .andExpect(jsonPath("$.email").value("student@test.com"))
                .andExpect(jsonPath("$.password").doesNotExist());

        verify(userService).saveUser(any(User.class));
    }

    @Test
    void registerStudent_whenServiceThrowsException_returns500() throws Exception {

        when(userService.saveUser(any(User.class)))
                .thenThrow(new RuntimeException("Username already exists"));

        String requestBody = """
                {
                    "username": "existing_student",
                    "email": "student@test.com",
                    "password": "Password123!",
                    "roleId": 2,
                    "roleName": "STUDENT"
                }
                """;

        mockMvc.perform(
                        post("/api/users/add")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody)
                )
                .andExpect(status().isInternalServerError());
    }
}

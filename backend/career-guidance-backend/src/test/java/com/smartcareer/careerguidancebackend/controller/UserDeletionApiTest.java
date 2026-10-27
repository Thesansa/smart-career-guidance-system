package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import com.smartcareer.careerguidancebackend.config.JwtAuthenticationFilter;
@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserDeletionApiTest {

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Test
    void deleteUser_withValidId_returns200AndEmptyBody() throws Exception {
        // Arrange
        Integer userId = 10;

        // Act & Assert
        mockMvc.perform(
                        delete("/api/users/{id}", userId)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(content().string(""));

        verify(userService).deleteUser(userId);
        verifyNoMoreInteractions(userService);
    }

    @Test
    void deleteUser_whenServiceThrowsException_returns500() throws Exception {
        // Arrange
        Integer userId = 999;

        doThrow(new RuntimeException("User not found"))
                .when(userService).deleteUser(userId);

        // Act & Assert
        mockMvc.perform(
                        delete("/api/users/{id}", userId)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isInternalServerError());

        verify(userService).deleteUser(userId);
    }
}

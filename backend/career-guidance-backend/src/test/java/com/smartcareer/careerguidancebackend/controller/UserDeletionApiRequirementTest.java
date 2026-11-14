package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.config.JwtAuthenticationEntryPoint;
import com.smartcareer.careerguidancebackend.config.JwtAuthenticationFilter;
import com.smartcareer.careerguidancebackend.config.JwtService;
import com.smartcareer.careerguidancebackend.config.SecurityConfig;
import com.smartcareer.careerguidancebackend.exceptions.ForbiddenOperationException;
import com.smartcareer.careerguidancebackend.service.CustomUserDetailsService;
import com.smartcareer.careerguidancebackend.service.UserService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        JwtAuthenticationEntryPoint.class
})
class UserDeletionApiRequirementTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;


    // TEST 1: Unauthenticated user cannot delete an account

    @Test
    void deleteUser_withoutAuthentication_shouldReturnUnauthorized() throws Exception {

        mockMvc.perform(delete("/api/users/10"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(userService);
    }


    // TEST 2: STUDENT can delete their own account

    @Test
    void deleteUser_asStudent_shouldAllowSelfDeletion() throws Exception {

        mockMvc.perform(delete("/api/users/10")
                        .with(user("student").roles("STUDENT")))
                .andExpect(status().isNoContent());

        verify(userService).deleteUser(10, "student");
    }


    // TEST 3: COUNSELOR cannot delete accounts

    @Test
    void deleteUser_asCounselor_shouldReturnForbidden() throws Exception {

        doThrow(new ForbiddenOperationException(
                "You are not authorized to delete this user."
        )).when(userService).deleteUser(10, "counselor");

        mockMvc.perform(delete("/api/users/10")
                        .with(user("counselor").roles("COUNSELOR")))
                .andExpect(status().isForbidden());

        verify(userService).deleteUser(10, "counselor");
    }


    // TEST 4: ADMIN can delete a STUDENT account

    @Test
    void deleteUser_asAdmin_shouldAllowDeletion() throws Exception {

        mockMvc.perform(delete("/api/users/10")
                        .with(user("admin").roles("ADMIN")))
                .andExpect(status().isNoContent());

        verify(userService).deleteUser(10, "admin");
    }


    // TEST 5: ADMIN can delete another ADMIN account

    @Test
    void deleteUser_asAdmin_shouldAllowDeletingAnotherAdmin() throws Exception {

        mockMvc.perform(delete("/api/users/20")
                        .with(user("admin").roles("ADMIN")))
                .andExpect(status().isNoContent());

        verify(userService).deleteUser(20, "admin");
    }
}

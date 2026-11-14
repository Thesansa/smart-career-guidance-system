package com.smartcareer.careerguidancebackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcareer.careerguidancebackend.config.JwtAuthenticationEntryPoint;
import com.smartcareer.careerguidancebackend.config.JwtAuthenticationFilter;
import com.smartcareer.careerguidancebackend.config.JwtService;
import com.smartcareer.careerguidancebackend.config.SecurityConfig;
import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.service.CustomUserDetailsService;
import com.smartcareer.careerguidancebackend.service.RoleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RoleController.class)
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        JwtAuthenticationEntryPoint.class
})
class RoleCreationApiRequirementTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private RoleService roleService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void addRole_withoutAuthentication_shouldReturnUnauthorized() throws Exception {

        mockMvc.perform(post("/api/roles/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new Role("CAREER_ADVISOR")
                        )))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(roleService);
    }

    @Test
    void addRole_asStudent_shouldReturnForbidden() throws Exception {

        mockMvc.perform(post("/api/roles/add")
                        .with(user("student").roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new Role("CAREER_ADVISOR")
                        )))
                .andExpect(status().isForbidden());

        verifyNoInteractions(roleService);
    }

    @Test
    void addRole_asAdmin_shouldCreateRole() throws Exception {

        Role role = new Role("CAREER_ADVISOR");

        when(roleService.saveRole(any(Role.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/api/roles/add")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(role)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("CAREER_ADVISOR"));

        verify(roleService).saveRole(any(Role.class));
    }
}
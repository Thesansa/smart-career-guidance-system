package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.config.JwtAuthenticationEntryPoint;
import com.smartcareer.careerguidancebackend.config.JwtAuthenticationFilter;
import com.smartcareer.careerguidancebackend.config.JwtService;
import com.smartcareer.careerguidancebackend.config.SecurityConfig;
import com.smartcareer.careerguidancebackend.service.CustomUserDetailsService;
import com.smartcareer.careerguidancebackend.service.RoleService;
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

@WebMvcTest(RoleController.class)
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        JwtAuthenticationEntryPoint.class
})
class RoleDeletionApiRequirementTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RoleService roleService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void deleteRole_withoutAuthentication_shouldReturnUnauthorized() throws Exception {

        mockMvc.perform(delete("/api/roles/10"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(roleService);
    }

    @Test
    void deleteRole_asStudent_shouldReturnForbidden() throws Exception {

        mockMvc.perform(delete("/api/roles/10")
                        .with(user("student").roles("STUDENT")))
                .andExpect(status().isForbidden());

        verifyNoInteractions(roleService);
    }

    @Test
    void deleteRole_asAdmin_shouldDeleteRole() throws Exception {

        mockMvc.perform(delete("/api/roles/10")
                        .with(user("admin").roles("ADMIN")))
                .andExpect(status().isNoContent());

        verify(roleService).deleteRole(10);
    }
}
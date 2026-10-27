package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.service.RoleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import com.smartcareer.careerguidancebackend.config.JwtAuthenticationFilter;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RoleController.class)
@AutoConfigureMockMvc(addFilters = false)


class RoleCreationApiTest {

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RoleService roleService;

    @Test
    void addRole_withValidRole_returns200AndSavedRole() throws Exception {
        Role savedRole = new Role("STUDENT");
        savedRole.setId(2);

        when(roleService.saveRole(any(Role.class))).thenReturn(savedRole);

        String requestBody = """
                {
                    "name": "STUDENT"
                }
                """;

        mockMvc.perform(post("/api/roles/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("STUDENT"));

        verify(roleService).saveRole(any(Role.class));
    }

    @Test
    void addRole_whenServiceThrowsException_returns500() throws Exception {
        when(roleService.saveRole(any(Role.class)))
                .thenThrow(new RuntimeException("Role could not be saved"));

        String requestBody = """
                {
                    "name": "STUDENT"
                }
                """;

        mockMvc.perform(post("/api/roles/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isInternalServerError());

        verify(roleService).saveRole(any(Role.class));
    }
}
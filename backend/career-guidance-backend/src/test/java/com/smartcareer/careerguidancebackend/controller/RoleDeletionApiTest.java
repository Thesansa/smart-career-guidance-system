package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.service.RoleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import com.smartcareer.careerguidancebackend.config.JwtAuthenticationFilter;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RoleController.class)
@AutoConfigureMockMvc(addFilters = false)
class RoleDeletionApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RoleService roleService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void deleteRole_withValidId_returns200AndEmptyBody() throws Exception {
        Integer roleId = 2;

        mockMvc.perform(delete("/api/roles/{id}", roleId))
                .andExpect(status().isOk())
                .andExpect(content().string(""));

        verify(roleService).deleteRole(roleId);
    }

    @Test
    void deleteRole_whenServiceThrowsException_returns500() throws Exception {
        Integer roleId = 999;

        doThrow(new RuntimeException("Role not found"))
                .when(roleService).deleteRole(roleId);

        mockMvc.perform(delete("/api/roles/{id}", roleId))
                .andExpect(status().isInternalServerError());

        verify(roleService).deleteRole(roleId);
    }
}

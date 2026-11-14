package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.repository.RoleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoleCreationRequirementTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleService roleService;

    @Test
    void saveRole_withValidName_shouldSaveRole() {

        Role role = new Role("CAREER_ADVISOR");

        when(roleRepository.save(role)).thenReturn(role);

        Role savedRole = roleService.saveRole(role);

        assertNotNull(savedRole);
        assertEquals("CAREER_ADVISOR", savedRole.getName());

        verify(roleRepository).save(role);
    }

    @Test
    void saveRole_withBlankName_shouldRejectRole() {

        Role role = new Role("   ");

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> roleService.saveRole(role)
        );

        assertTrue(exception.getMessage().contains("Role name"));

        verify(roleRepository, never()).save(any(Role.class));
    }

    @Test
    void saveRole_withNullName_shouldRejectRole() {

        Role role = new Role(null);

        assertThrows(
                IllegalArgumentException.class,
                () -> roleService.saveRole(role)
        );

        verify(roleRepository, never()).save(any(Role.class));
    }
}
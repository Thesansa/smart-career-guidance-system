package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.exceptions.ResourceInUseException;
import com.smartcareer.careerguidancebackend.exceptions.ResourceNotFoundException;
import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.repository.RoleRepository;
import com.smartcareer.careerguidancebackend.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoleDeletionRequirementTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RoleService roleService;


    // --------------------------------------------------
    // SUCCESSFUL DELETION
    // --------------------------------------------------

    @Test
    void deleteRole_whenRoleExistsAndIsUnused_shouldDeleteRole() {

        Role existingRole = new Role("TEMPORARY_ROLE");
        existingRole.setId(10);

        when(roleRepository.findById(10))
                .thenReturn(Optional.of(existingRole));

        when(userRepository.countByRoleName("TEMPORARY_ROLE"))
                .thenReturn(0L);

        assertDoesNotThrow(() -> roleService.deleteRole(10));

        verify(roleRepository).findById(10);
        verify(userRepository).countByRoleName("TEMPORARY_ROLE");
        verify(roleRepository).delete(existingRole);
    }


    // --------------------------------------------------
    // ROLE IN USE
    // --------------------------------------------------

    @Test
    void deleteRole_whenUsersAreAssigned_shouldRejectDeletion() {

        Role existingRole = new Role("STUDENT");
        existingRole.setId(10);

        when(roleRepository.findById(10))
                .thenReturn(Optional.of(existingRole));

        when(userRepository.countByRoleName("STUDENT"))
                .thenReturn(5L);

        assertThrows(
                ResourceInUseException.class,
                () -> roleService.deleteRole(10)
        );

        verify(roleRepository).findById(10);
        verify(userRepository).countByRoleName("STUDENT");

        verify(roleRepository, never()).delete(any(Role.class));
    }


    // --------------------------------------------------
    // NONEXISTENT ROLE
    // --------------------------------------------------

    @Test
    void deleteRole_whenRoleDoesNotExist_shouldThrowNotFound() {

        when(roleRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> roleService.deleteRole(99)
        );

        verify(roleRepository).findById(99);

        verifyNoInteractions(userRepository);

        verify(roleRepository, never()).delete(any(Role.class));
    }
}
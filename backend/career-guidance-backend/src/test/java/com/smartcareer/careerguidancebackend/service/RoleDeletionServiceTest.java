package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.repository.RoleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class RoleDeletionServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleService roleService;

    @Test
    void deleteRole_withValidId_delegatesDeletionToRepository() {
        Integer roleId = 2;

        roleService.deleteRole(roleId);

        verify(roleRepository).deleteById(roleId);
        verifyNoMoreInteractions(roleRepository);
    }

    @Test
    void deleteRole_whenRepositoryThrowsException_propagatesException() {
        Integer roleId = 999;

        doThrow(new RuntimeException("Role not found"))
                .when(roleRepository).deleteById(roleId);

        assertThrows(
                RuntimeException.class,
                () -> roleService.deleteRole(roleId)
        );

        verify(roleRepository).deleteById(roleId);
        verifyNoMoreInteractions(roleRepository);
    }
}

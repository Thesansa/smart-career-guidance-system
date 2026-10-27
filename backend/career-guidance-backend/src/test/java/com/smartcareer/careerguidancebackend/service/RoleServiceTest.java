package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.repository.RoleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleService roleService;

    @Test
    void saveRole_withValidRole_delegatesToRepositoryAndReturnsSavedRole() {
        Role role = new Role("STUDENT");
        Role savedRole = new Role("STUDENT");
        when(roleRepository.save(role)).thenReturn(savedRole);

        Role result = roleService.saveRole(role);

        assertSame(savedRole, result);
        verify(roleRepository).save(role);
    }
}
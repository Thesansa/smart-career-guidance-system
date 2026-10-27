package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.config.JwtService;
import com.smartcareer.careerguidancebackend.repository.RoleRepository;
import com.smartcareer.careerguidancebackend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserDeletionServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void deleteUser_withExistingId_delegatesDeletionToRepository() {
        // Arrange
        Integer userId = 10;

        // Act
        userService.deleteUser(userId);

        // Assert
        verify(userRepository).deleteById(userId);
    }

    @Test
    void deleteUser_whenRepositoryThrowsException_propagatesException() {
        // Arrange
        Integer userId = 999;

        doThrow(new RuntimeException("User not found"))
                .when(userRepository).deleteById(userId);

        // Act & Assert
        assertThrows(
                RuntimeException.class,
                () -> userService.deleteUser(userId)
        );

        verify(userRepository).deleteById(userId);
    }
}


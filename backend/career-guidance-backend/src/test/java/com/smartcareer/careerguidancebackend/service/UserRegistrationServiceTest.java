package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.config.JwtService;
import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.repository.RoleRepository;
import com.smartcareer.careerguidancebackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserRegistrationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private Role studentRole;

    @BeforeEach
    void setUp() {
        studentRole = new Role("STUDENT");
        studentRole.setId(2);
    }

    @Test
    void saveUser_withValidDetails_savesUserWithEncodedPassword() {
        User user = new User(
                "test_student",
                "student@test.com",
                "PlainPassword123!",
                studentRole
        );

        when(userRepository.findByUsername("test_student"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("student@test.com"))
                .thenReturn(Optional.empty());
        when(roleRepository.findById(2))
                .thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode("PlainPassword123!"))
                .thenReturn("encoded-password");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User savedUser = userService.saveUser(user);

        assertEquals("test_student", savedUser.getUsername());
        assertEquals("student@test.com", savedUser.getEmail());
        assertEquals("encoded-password", savedUser.getPassword());
        assertEquals("STUDENT", savedUser.getRole().getName());

        verify(passwordEncoder).encode("PlainPassword123!");
        verify(userRepository).save(user);
    }

    @Test
    void saveUser_withExistingUsername_rejectsRegistration() {
        User user = new User(
                "existing_student",
                "new@test.com",
                "Password123!",
                studentRole
        );

        when(userRepository.findByUsername("existing_student"))
                .thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.saveUser(user)
        );

        assertTrue(exception.getMessage().contains("already exists"));

        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void saveUser_withExistingEmail_rejectsRegistration() {
        User user = new User(
                "new_student",
                "existing@test.com",
                "Password123!",
                studentRole
        );

        when(userRepository.findByUsername("new_student"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("existing@test.com"))
                .thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.saveUser(user)
        );

        assertTrue(exception.getMessage().contains("already exists"));

        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void saveUser_withNonexistentRole_rejectsRegistration() {
        User user = new User(
                "test_student",
                "student@test.com",
                "Password123!",
                studentRole
        );

        when(userRepository.findByUsername("test_student"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("student@test.com"))
                .thenReturn(Optional.empty());
        when(roleRepository.findById(2))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.saveUser(user)
        );

        assertTrue(exception.getMessage().contains("Role not found"));

        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }
}


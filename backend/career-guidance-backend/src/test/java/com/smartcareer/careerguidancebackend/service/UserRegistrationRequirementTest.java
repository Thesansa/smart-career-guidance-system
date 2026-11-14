package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.config.JwtService;
import com.smartcareer.careerguidancebackend.exceptions.DuplicateResourceException;
import com.smartcareer.careerguidancebackend.exceptions.RoleNotFoundException;
import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.repository.RoleRepository;
import com.smartcareer.careerguidancebackend.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserRegistrationRequirementTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;


    // TEST 1: Allow valid STUDENT registration

    @Test
    void saveUser_withValidRegistration_shouldSaveStudentSuccessfully() {

        // Arrange
        Role studentRole = new Role("STUDENT");
        studentRole.setId(2);

        User user = new User(
                "test_student",
                "student@test.com",
                "Password123!",
                null
        );

        when(userRepository.findByUsername("test_student"))
                .thenReturn(Optional.empty());

        when(userRepository.findByEmail("student@test.com"))
                .thenReturn(Optional.empty());

        when(roleRepository.findByName("STUDENT"))
                .thenReturn(Optional.of(studentRole));

        when(passwordEncoder.encode("Password123!"))
                .thenReturn("encoded-password");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));


        // Act
        User savedUser = userService.saveUser(user);


        // Assert
        assertNotNull(savedUser);
        assertEquals("test_student", savedUser.getUsername());
        assertEquals("student@test.com", savedUser.getEmail());
        assertEquals("encoded-password", savedUser.getPassword());
        assertNotNull(savedUser.getRole());
        assertEquals("STUDENT", savedUser.getRole().getName());

        verify(roleRepository).findByName("STUDENT");
        verify(passwordEncoder).encode("Password123!");
        verify(userRepository).save(user);
    }


    // TEST 2: ADMIN role submitted by client must be ignored

    @Test
    void saveUser_withAdminRole_shouldAssignStudentRoleInstead() {

        // Arrange
        Role adminRole = new Role("ADMIN");
        adminRole.setId(1);

        Role studentRole = new Role("STUDENT");
        studentRole.setId(2);

        User user = new User(
                "test_admin",
                "admin@test.com",
                "Password123!",
                adminRole
        );

        when(userRepository.findByUsername("test_admin"))
                .thenReturn(Optional.empty());

        when(userRepository.findByEmail("admin@test.com"))
                .thenReturn(Optional.empty());

        when(roleRepository.findByName("STUDENT"))
                .thenReturn(Optional.of(studentRole));

        when(passwordEncoder.encode("Password123!"))
                .thenReturn("encoded-password");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));


        // Act
        User savedUser = userService.saveUser(user);


        // Assert
        assertNotNull(savedUser);
        assertEquals("STUDENT", savedUser.getRole().getName());
        assertNotEquals("ADMIN", savedUser.getRole().getName());

        verify(roleRepository).findByName("STUDENT");
        verify(roleRepository, never()).findById(anyInt());
        verify(userRepository).save(user);
    }


    // TEST 3: COUNSELLOR role submitted by client must be ignored

    @Test
    void saveUser_withCounsellorRole_shouldAssignStudentRoleInstead() {

        // Arrange
        Role counsellorRole = new Role("COUNSELLOR");
        counsellorRole.setId(3);

        Role studentRole = new Role("STUDENT");
        studentRole.setId(2);

        User user = new User(
                "test_counsellor",
                "counsellor@test.com",
                "Password123!",
                counsellorRole
        );

        when(userRepository.findByUsername("test_counsellor"))
                .thenReturn(Optional.empty());

        when(userRepository.findByEmail("counsellor@test.com"))
                .thenReturn(Optional.empty());

        when(roleRepository.findByName("STUDENT"))
                .thenReturn(Optional.of(studentRole));

        when(passwordEncoder.encode("Password123!"))
                .thenReturn("encoded-password");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));


        // Act
        User savedUser = userService.saveUser(user);


        // Assert
        assertNotNull(savedUser);
        assertEquals("STUDENT", savedUser.getRole().getName());
        assertNotEquals("COUNSELLOR", savedUser.getRole().getName());

        verify(roleRepository).findByName("STUDENT");
        verify(roleRepository, never()).findById(anyInt());
        verify(userRepository).save(user);
    }


    // TEST 4: Reject registration when username already exists

    @Test
    void saveUser_withExistingUsername_shouldThrowException() {

        // Arrange
        User existingUser = new User(
                "existing_user",
                "existing@test.com",
                "encoded-password",
                null
        );

        User newUser = new User(
                "existing_user",
                "new@test.com",
                "Password123!",
                null
        );

        when(userRepository.findByUsername("existing_user"))
                .thenReturn(Optional.of(existingUser));


        // Act & Assert
        DuplicateResourceException exception = assertThrows(
                DuplicateResourceException.class,
                () -> userService.saveUser(newUser)
        );

        assertTrue(exception.getMessage().contains("already exists"));

        verify(userRepository, never()).findByEmail(anyString());
        verify(roleRepository, never()).findByName(anyString());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }


    // TEST 5: Reject registration when email already exists

    @Test
    void saveUser_withExistingEmail_shouldThrowException() {

        // Arrange
        User existingUser = new User(
                "existing_user",
                "existing@test.com",
                "encoded-password",
                null
        );

        User newUser = new User(
                "new_user",
                "existing@test.com",
                "Password123!",
                null
        );

        when(userRepository.findByUsername("new_user"))
                .thenReturn(Optional.empty());

        when(userRepository.findByEmail("existing@test.com"))
                .thenReturn(Optional.of(existingUser));


        // Act & Assert
        DuplicateResourceException exception = assertThrows(
                DuplicateResourceException.class,
                () -> userService.saveUser(newUser)
        );

        assertTrue(exception.getMessage().contains("already exists"));

        verify(roleRepository, never()).findByName(anyString());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }


    // TEST 6: Reject registration if canonical STUDENT role is missing

    @Test
    void saveUser_whenStudentRoleDoesNotExist_shouldThrowException() {

        // Arrange
        User user = new User(
                "test_user",
                "test@test.com",
                "Password123!",
                null
        );

        when(userRepository.findByUsername("test_user"))
                .thenReturn(Optional.empty());

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.empty());

        when(roleRepository.findByName("STUDENT"))
                .thenReturn(Optional.empty());


        // Act & Assert
        RoleNotFoundException exception = assertThrows(
                RoleNotFoundException.class,
                () -> userService.saveUser(user)
        );

        assertTrue(exception.getMessage().contains("STUDENT"));

        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }


    // TEST 7: Client cannot manipulate role using a submitted role ID

    @Test
    void saveUser_withStudentNameButAdminId_shouldStillAssignStudentRole() {

        // Arrange
        // Simulate a client submitting STUDENT as the role name
        // but using an ID that belongs to ADMIN.
        Role submittedRole = new Role("STUDENT");
        submittedRole.setId(1);

        // The actual canonical STUDENT role has ID 2.
        Role studentRole = new Role("STUDENT");
        studentRole.setId(2);

        User user = new User(
                "spoofed_user",
                "spoofed@test.com",
                "Password123!",
                submittedRole
        );

        when(userRepository.findByUsername("spoofed_user"))
                .thenReturn(Optional.empty());

        when(userRepository.findByEmail("spoofed@test.com"))
                .thenReturn(Optional.empty());

        when(roleRepository.findByName("STUDENT"))
                .thenReturn(Optional.of(studentRole));

        when(passwordEncoder.encode("Password123!"))
                .thenReturn("encoded-password");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));


        // Act
        User savedUser = userService.saveUser(user);


        // Assert
        assertNotNull(savedUser);
        assertEquals("STUDENT", savedUser.getRole().getName());
        assertEquals(2, savedUser.getRole().getId());

        verify(roleRepository).findByName("STUDENT");
        verify(roleRepository, never()).findById(anyInt());
        verify(userRepository).save(user);
    }
}
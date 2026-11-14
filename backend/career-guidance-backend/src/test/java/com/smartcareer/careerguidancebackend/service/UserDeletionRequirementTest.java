package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.exceptions.ForbiddenOperationException;
import com.smartcareer.careerguidancebackend.exceptions.ResourceNotFoundException;
import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.model.User;
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
class UserDeletionRequirementTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;


    // --------------------------------------------------
    // ADMIN DELETION TESTS
    // --------------------------------------------------

    @Test
    void deleteUser_asAdmin_shouldAllowDeletingStudent() {

        User admin = createUser(1, "admin", "ADMIN");
        User student = createUser(10, "student", "STUDENT");

        when(userRepository.findByUsername("admin"))
                .thenReturn(Optional.of(admin));

        when(userRepository.findById(10))
                .thenReturn(Optional.of(student));

        assertDoesNotThrow(() ->
                userService.deleteUser(10, "admin"));

        verify(userRepository).delete(student);
    }


    @Test
    void deleteUser_asAdmin_shouldAllowDeletingCounselor() {

        User admin = createUser(1, "admin", "ADMIN");
        User counselor = createUser(20, "counselor", "COUNSELOR");

        when(userRepository.findByUsername("admin"))
                .thenReturn(Optional.of(admin));

        when(userRepository.findById(20))
                .thenReturn(Optional.of(counselor));

        assertDoesNotThrow(() ->
                userService.deleteUser(20, "admin"));

        verify(userRepository).delete(counselor);
    }


    @Test
    void deleteUser_asAdmin_shouldAllowDeletingAnotherAdmin() {

        User admin = createUser(1, "admin", "ADMIN");
        User anotherAdmin = createUser(2, "anotherAdmin", "ADMIN");

        when(userRepository.findByUsername("admin"))
                .thenReturn(Optional.of(admin));

        when(userRepository.findById(2))
                .thenReturn(Optional.of(anotherAdmin));

        assertDoesNotThrow(() ->
                userService.deleteUser(2, "admin"));

        verify(userRepository).delete(anotherAdmin);
    }


    // --------------------------------------------------
    // STUDENT DELETION TESTS
    // --------------------------------------------------

    @Test
    void deleteUser_asStudent_shouldAllowDeletingOwnAccount() {

        User student = createUser(10, "student", "STUDENT");

        when(userRepository.findByUsername("student"))
                .thenReturn(Optional.of(student));

        when(userRepository.findById(10))
                .thenReturn(Optional.of(student));

        assertDoesNotThrow(() ->
                userService.deleteUser(10, "student"));

        verify(userRepository).delete(student);
    }


    @Test
    void deleteUser_asStudent_shouldRejectDeletingAnotherStudent() {

        User student = createUser(10, "student", "STUDENT");
        User anotherStudent = createUser(11, "anotherStudent", "STUDENT");

        when(userRepository.findByUsername("student"))
                .thenReturn(Optional.of(student));

        when(userRepository.findById(11))
                .thenReturn(Optional.of(anotherStudent));

        assertThrows(
                ForbiddenOperationException.class,
                () -> userService.deleteUser(11, "student")
        );

        verify(userRepository, never()).delete(any(User.class));
    }


    @Test
    void deleteUser_asStudent_shouldRejectDeletingCounselor() {

        User student = createUser(10, "student", "STUDENT");
        User counselor = createUser(20, "counselor", "COUNSELOR");

        when(userRepository.findByUsername("student"))
                .thenReturn(Optional.of(student));

        when(userRepository.findById(20))
                .thenReturn(Optional.of(counselor));

        assertThrows(
                ForbiddenOperationException.class,
                () -> userService.deleteUser(20, "student")
        );

        verify(userRepository, never()).delete(any(User.class));
    }


    // --------------------------------------------------
    // COUNSELOR DELETION TESTS
    // --------------------------------------------------

    @Test
    void deleteUser_asCounselor_shouldRejectDeletingUser() {

        User counselor = createUser(20, "counselor", "COUNSELOR");
        User student = createUser(10, "student", "STUDENT");

        when(userRepository.findByUsername("counselor"))
                .thenReturn(Optional.of(counselor));

        when(userRepository.findById(10))
                .thenReturn(Optional.of(student));

        assertThrows(
                ForbiddenOperationException.class,
                () -> userService.deleteUser(10, "counselor")
        );

        verify(userRepository, never()).delete(any(User.class));
    }


    // --------------------------------------------------
    // NOT FOUND TESTS
    // --------------------------------------------------

    @Test
    void deleteUser_whenRequesterDoesNotExist_shouldThrowNotFound() {

        when(userRepository.findByUsername("unknown"))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> userService.deleteUser(10, "unknown")
        );

        verify(userRepository, never()).delete(any(User.class));
    }


    @Test
    void deleteUser_whenTargetDoesNotExist_shouldThrowNotFound() {

        User admin = createUser(1, "admin", "ADMIN");

        when(userRepository.findByUsername("admin"))
                .thenReturn(Optional.of(admin));

        when(userRepository.findById(99))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> userService.deleteUser(99, "admin")
        );

        verify(userRepository, never()).delete(any(User.class));
    }


    // --------------------------------------------------
    // TEST DATA HELPER
    // --------------------------------------------------

    private User createUser(Integer id, String username, String roleName) {

        Role role = new Role(roleName);

        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setRole(role);

        return user;
    }
}
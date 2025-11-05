package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.SystemLog;
import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.repository.UserRepository;
import com.smartcareer.careerguidancebackend.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class SystemLogController {

    @Autowired
    private SystemLogRepository systemLogRepository;

    @Autowired
    private UserRepository userRepository;

    // 🔑 Utility: Get current logged-in user from JWT
    private User getCurrentUser() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            return userRepository.findByUsername(username).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    private boolean isAdmin(User user) {
        return user != null && "ADMIN".equalsIgnoreCase(user.getRole().getName());
    }

    // 🟢 Get all logs (Admin only)
    @GetMapping("/all")
    public ResponseEntity<?> getAllLogs() {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only admins can view logs.");
        }

        List<SystemLog> logs = systemLogRepository.findAll();
        return ResponseEntity.ok(logs);
    }

    // 🟢 Get logs filtered by actor (Admin only)
    @GetMapping("/actor/{username}")
    public ResponseEntity<?> getLogsByActor(@PathVariable String username) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only admins can filter logs.");
        }

        List<SystemLog> logs = systemLogRepository.findByActor(username);
        return ResponseEntity.ok(logs);
    }

    // 🟢 Clear all logs (Admin only)
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearAllLogs() {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only admins can clear logs.");
        }

        systemLogRepository.deleteAll();
        return ResponseEntity.ok("All system logs cleared successfully.");
    }

    // 🟢 Delete a specific log by ID (Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLogById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        if (!isAdmin(currentUser)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only admins can delete logs.");
        }

        if (!systemLogRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Log not found with ID: " + id);
        }

        systemLogRepository.deleteById(id);
        return ResponseEntity.ok("Log deleted successfully.");
    }
}

package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.StudentProfile;
import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.repository.StudentProfileRepository;
import com.smartcareer.careerguidancebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentProfileService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Save or update a student profile.
     * Ensures the full User entity is attached (not just the ID).
     */
    public StudentProfile saveProfile(StudentProfile profile) {
        if (profile.getUser() != null && profile.getUser().getId() != null) {
            // Fetch full user object from DB
            Optional<User> userOpt = userRepository.findById(profile.getUser().getId());
            if (userOpt.isPresent()) {
                profile.setUser(userOpt.get());
            } else {
                throw new RuntimeException("User not found with ID: " + profile.getUser().getId());
            }
        } else {
            throw new RuntimeException("User ID must be provided when saving a profile.");
        }

        // Save or update profile
        return studentProfileRepository.save(profile);
    }

    /**
     * Get all student profiles (Admin-only endpoint).
     */
    public List<StudentProfile> getAllProfiles() {
        return studentProfileRepository.findAll();
    }

    /**
     * Get profile by ID.
     */
    public Optional<StudentProfile> getProfileById(Long id) {
        return studentProfileRepository.findById(id);
    }

    /**
     * Get profile by associated User ID.
     */
    public Optional<StudentProfile> getProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId);
    }

    /**
     * Delete profile by ID.
     */
    public void deleteProfile(Long id) {
        studentProfileRepository.deleteById(id);
    }
}

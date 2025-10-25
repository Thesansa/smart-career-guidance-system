package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.StudentProfile;
import com.smartcareer.careerguidancebackend.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentProfileService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    // Save or update student profile
    public StudentProfile saveProfile(StudentProfile profile) {
        return studentProfileRepository.save(profile);
    }

    // Get all profiles
    public List<StudentProfile> getAllProfiles() {
        return studentProfileRepository.findAll();
    }

    // Get profile by ID
    public Optional<StudentProfile> getProfileById(Long id) {
        return studentProfileRepository.findById(id);
    }

    // Get profile by User ID (foreign key)
    public Optional<StudentProfile> getProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId);
    }

    // Delete profile
    public void deleteProfile(Long id) {
        studentProfileRepository.deleteById(id);
    }
}

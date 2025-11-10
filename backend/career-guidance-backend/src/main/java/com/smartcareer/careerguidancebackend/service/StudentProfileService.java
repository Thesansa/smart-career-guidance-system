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

    public StudentProfile saveProfile(StudentProfile profile) {
        if (profile.getUser() != null && profile.getUser().getId() != null) {
            User user = userRepository.findById(profile.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + profile.getUser().getId()));
            profile.setUser(user);
        } else {
            throw new RuntimeException("User ID must be provided when saving a profile.");
        }
        return studentProfileRepository.save(profile);
    }

    public List<StudentProfile> getAllProfiles() {
        return studentProfileRepository.findAll();
    }

    public Optional<StudentProfile> getProfileById(Long id) {
        return studentProfileRepository.findById(id);
    }

    public Optional<StudentProfile> getProfileByUserId(Integer userId) {
        return studentProfileRepository.findByUserId(userId);
    }

    public void deleteProfile(Long id) {
        studentProfileRepository.deleteById(id);
    }
}

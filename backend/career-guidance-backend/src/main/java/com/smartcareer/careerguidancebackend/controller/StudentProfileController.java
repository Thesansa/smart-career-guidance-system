package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.StudentProfile;
import com.smartcareer.careerguidancebackend.service.StudentProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student-profiles")
public class StudentProfileController {

    @Autowired
    private StudentProfileService studentProfileService;

    // Create or update a profile
    @PostMapping("/add")
    public StudentProfile addProfile(@RequestBody StudentProfile profile) {
        return studentProfileService.saveProfile(profile);
    }

    // Get all profiles
    @GetMapping("/all")
    public List<StudentProfile> getAllProfiles() {
        return studentProfileService.getAllProfiles();
    }

    // Get profile by ID
    @GetMapping("/{id}")
    public Optional<StudentProfile> getProfileById(@PathVariable Long id) {
        return studentProfileService.getProfileById(id);
    }

    // Get profile by User ID
    @GetMapping("/user/{userId}")
    public Optional<StudentProfile> getProfileByUserId(@PathVariable Long userId) {
        return studentProfileService.getProfileByUserId(userId);
    }

    // Delete profile
    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable Long id) {
        studentProfileService.deleteProfile(id);
    }
}

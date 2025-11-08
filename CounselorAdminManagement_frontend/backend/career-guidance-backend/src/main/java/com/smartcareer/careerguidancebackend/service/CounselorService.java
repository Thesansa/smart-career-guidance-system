package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.CounselorProfile;
import com.smartcareer.careerguidancebackend.model.User;
import com.smartcareer.careerguidancebackend.repository.CounselorProfileRepository;
import com.smartcareer.careerguidancebackend.repository.UserRepository;
import com.smartcareer.careerguidancebackend.repository.SystemLogRepository;
import com.smartcareer.careerguidancebackend.model.SystemLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CounselorService {

    @Autowired
    private CounselorProfileRepository counselorProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SystemLogRepository systemLogRepository;

    /**
     * Create counselor profile (Admin action)
     */
    public CounselorProfile createCounselorProfile(CounselorProfile profile, String actorUsername) {
        if (profile.getUser() == null || profile.getUser().getId() == null) {
            throw new RuntimeException("Counselor must be linked to an existing user (userId required).");
        }

        User user = userRepository.findById(profile.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + profile.getUser().getId()));

        profile.setUser(user);
        CounselorProfile saved = counselorProfileRepository.save(profile);

        String action = String.format("Admin '%s' created counselor profile for user '%s'", actorUsername, user.getUsername());
        systemLogRepository.save(new SystemLog(action, actorUsername, null));

        return saved;
    }

    /**
     * Update existing counselor profile
     */
    public CounselorProfile updateCounselorProfile(Long id, CounselorProfile updatedProfile, String actorUsername) {
        CounselorProfile existing = counselorProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Counselor not found with ID: " + id));

        existing.setFullName(updatedProfile.getFullName());
        existing.setDepartment(updatedProfile.getDepartment());
        existing.setContactNumber(updatedProfile.getContactNumber());
        existing.setExperienceYears(updatedProfile.getExperienceYears());

        CounselorProfile saved = counselorProfileRepository.save(existing);

        String action = String.format("Admin '%s' updated counselor profile (id=%d)", actorUsername, id);
        systemLogRepository.save(new SystemLog(action, actorUsername, null));

        return saved;
    }

    /**
     * Get all counselor profiles
     */
    public List<CounselorProfile> getAllCounselorProfiles() {
        return counselorProfileRepository.findAll();
    }

    /**
     * Get counselor profile by ID
     */
    public Optional<CounselorProfile> getCounselorProfileById(Long id) {
        return counselorProfileRepository.findById(id);
    }

    /**
     * Delete counselor profile
     */
    public void deleteCounselorProfile(Long id, String actorUsername) {
        if (!counselorProfileRepository.existsById(id)) {
            throw new RuntimeException("Counselor not found with ID: " + id);
        }

        counselorProfileRepository.deleteById(id);
        String action = String.format("Admin '%s' deleted counselor profile (id=%d)", actorUsername, id);
        systemLogRepository.save(new SystemLog(action, actorUsername, null));
    }
}

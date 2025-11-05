package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.CounselorProfile;
import com.smartcareer.careerguidancebackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CounselorProfileRepository extends JpaRepository<CounselorProfile, Long> {

    // Find counselor profile by linked user
    Optional<CounselorProfile> findByUser(User user);

    // Optional: find by full name
    Optional<CounselorProfile> findByFullName(String fullName);
}

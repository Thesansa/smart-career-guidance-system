package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    // Optional helper method: find profile by user
    Optional<StudentProfile> findByUserId(Long userId);

}

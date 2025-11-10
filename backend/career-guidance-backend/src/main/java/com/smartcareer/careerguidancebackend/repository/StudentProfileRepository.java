package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    // Correct type: userId is Integer (because User.id is Integer)
    Optional<StudentProfile> findByUserId(Integer userId);
}

package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.PerformanceSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import com.smartcareer.careerguidancebackend.model.StudentProfile;

public interface PerformanceSummaryRepository extends JpaRepository<PerformanceSummary, Integer> {
    PerformanceSummary findByStudent(StudentProfile student);
}


package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.PerformanceSummary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PerformanceSummaryRepository extends JpaRepository<PerformanceSummary, Integer> {
    PerformanceSummary findByStudentId(Integer studentId);
}


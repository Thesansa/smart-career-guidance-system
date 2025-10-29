package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.AcademicPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AcademicPerformanceRepository extends JpaRepository<AcademicPerformance, Integer> {
    List<AcademicPerformance> findByStudentId(Integer studentId);
}


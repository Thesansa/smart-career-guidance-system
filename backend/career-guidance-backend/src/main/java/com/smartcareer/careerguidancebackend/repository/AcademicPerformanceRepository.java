package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.AcademicPerformance;
import com.smartcareer.careerguidancebackend.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AcademicPerformanceRepository extends JpaRepository<AcademicPerformance, Integer> {
    List<AcademicPerformance> findByStudent(StudentProfile student);
}


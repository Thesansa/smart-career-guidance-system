package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.PerformanceSummary;
import com.smartcareer.careerguidancebackend.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PerformanceSummaryRepository extends JpaRepository<PerformanceSummary, Integer> {

    //  Get a student's performance summary
    PerformanceSummary findByStudent(StudentProfile student);
}

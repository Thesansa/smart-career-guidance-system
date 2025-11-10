package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.SkillAssessment;
import com.smartcareer.careerguidancebackend.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface SkillAssessmentRepository extends JpaRepository<SkillAssessment, Long> { // Change Integer to Long
    @Query("SELECT s.skillName FROM SkillAssessment s WHERE s.student = :student")
    List<String> findSkillsByStudent(StudentProfile student);

    List<SkillAssessment> findByStudentOrderByAssessmentDateAsc(StudentProfile student);
}

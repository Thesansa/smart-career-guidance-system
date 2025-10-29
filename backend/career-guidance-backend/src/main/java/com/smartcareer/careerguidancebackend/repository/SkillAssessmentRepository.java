package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.SkillAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillAssessmentRepository extends JpaRepository<SkillAssessment, Integer> {
    List<SkillAssessment> findByStudentId(Integer studentId);
}


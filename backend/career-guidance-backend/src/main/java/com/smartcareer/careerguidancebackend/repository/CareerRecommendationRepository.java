package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.CareerRecommendation;
import com.smartcareer.careerguidancebackend.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerRecommendationRepository extends JpaRepository<CareerRecommendation, Long> {

    // find all recommendations for a student
    List<CareerRecommendation> findByStudent(StudentProfile student);
}

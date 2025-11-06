package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.StudentCounselorMapping;
import com.smartcareer.careerguidancebackend.model.CounselorProfile;
import com.smartcareer.careerguidancebackend.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentCounselorMappingRepository extends JpaRepository<StudentCounselorMapping, Long> {

    // Find all students assigned to a counselor
    List<StudentCounselorMapping> findByCounselor(CounselorProfile counselor);

    // Find mapping for a specific student
    Optional<StudentCounselorMapping> findByStudent(StudentProfile student);

    // Optional: find mapping by both student & counselor
    Optional<StudentCounselorMapping> findByStudentAndCounselor(StudentProfile student, CounselorProfile counselor);

    // Find all mappings by counselor ID (used for counselor dashboard reports)
    List<StudentCounselorMapping> findByCounselorId(Integer counselorId);

    // Count how many students a counselor has (used for admin system overview)
    long countByCounselorId(Integer counselorId);

}

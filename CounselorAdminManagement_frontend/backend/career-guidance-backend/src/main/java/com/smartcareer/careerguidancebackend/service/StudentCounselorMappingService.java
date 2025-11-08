package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.*;
import com.smartcareer.careerguidancebackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentCounselorMappingService {

    @Autowired
    private StudentCounselorMappingRepository mappingRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private CounselorProfileRepository counselorProfileRepository;

    @Autowired
    private SystemLogRepository systemLogRepository;

    // ✅ Assign student
    public StudentCounselorMapping assignStudentToCounselor(Long studentId, Long counselorProfileId, String actorUsername) {

        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        CounselorProfile counselor = counselorProfileRepository.findById(counselorProfileId)
                .orElseThrow(() -> new RuntimeException("Counselor not found with id: " + counselorProfileId));

        if (mappingRepository.findByStudent(student).isPresent()) {
            throw new RuntimeException("Student is already assigned.");
        }

        StudentCounselorMapping mapping = new StudentCounselorMapping();
        mapping.setStudent(student);
        mapping.setCounselor(counselor);

        StudentCounselorMapping saved = mappingRepository.save(mapping);

        systemLogRepository.save(new SystemLog("Assigned student", actorUsername, null));
        return saved;
    }

    // ✅ Add or update feedback
    public StudentCounselorMapping addOrUpdateFeedback(Long studentId, Long counselorProfileId, String feedback, String actorUsername) {

        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        CounselorProfile counselor = counselorProfileRepository.findById(counselorProfileId)
                .orElseThrow(() -> new RuntimeException("Counselor not found."));

        StudentCounselorMapping mapping = mappingRepository
                .findByStudentAndCounselor(student, counselor)
                .orElseThrow(() -> new RuntimeException("This student is not assigned to this counselor."));

        mapping.setFeedback(feedback);
        StudentCounselorMapping updated = mappingRepository.save(mapping);

        systemLogRepository.save(new SystemLog("Feedback Updated", actorUsername, feedback));
        return updated;
    }

    // ✅ Get students assigned to counselor
    public List<StudentCounselorMapping> getStudentsByCounselor(Long counselorProfileId) {

        CounselorProfile counselor = counselorProfileRepository.findById(counselorProfileId)
                .orElseThrow(() -> new RuntimeException("Counselor not found."));

        return mappingRepository.findByCounselor(counselor);
    }

    public List<StudentCounselorMapping> getAllMappings() {
        return mappingRepository.findAll();
    }

    public void removeMapping(Long mappingId, String actorUsername) {
        mappingRepository.deleteById(mappingId);
        systemLogRepository.save(new SystemLog("Mapping Removed", actorUsername, null));
    }
}

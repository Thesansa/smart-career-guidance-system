package com.smartcareer.careerguidancebackend.service;

import com.smartcareer.careerguidancebackend.model.CounselorProfile;
import com.smartcareer.careerguidancebackend.model.StudentCounselorMapping;
import com.smartcareer.careerguidancebackend.model.StudentProfile;
import com.smartcareer.careerguidancebackend.model.SystemLog;
import com.smartcareer.careerguidancebackend.repository.CounselorProfileRepository;
import com.smartcareer.careerguidancebackend.repository.StudentCounselorMappingRepository;
import com.smartcareer.careerguidancebackend.repository.StudentProfileRepository;
import com.smartcareer.careerguidancebackend.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;

import com.lowagie.text.Document;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Chunk;
import com.lowagie.text.FontFactory;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

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

        systemLogRepository.save(new SystemLog("Feedback Added", actorUsername,
                "Student: " + student.getFullName() + " Counselor: " + counselor.getFullName()));

        return updated;
    }

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

    public Optional<StudentCounselorMapping> getMappingByStudentUserId(Integer userId) {
        return mappingRepository.findByStudentUserId(userId);
    }

    // ✅ NEW: Generate PDF
    public byte[] generateMappingPDF() {
        List<StudentCounselorMapping> mappings = mappingRepository.findAll();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);

        document.open();
        document.add(new Paragraph("Student - Counselor Mappings Report", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
        document.add(new Paragraph("Generated on: " + new java.util.Date()));
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        table.addCell("Student Name");
        table.addCell("University");
        table.addCell("Counselor Name");
        table.addCell("Department");

        for (StudentCounselorMapping m : mappings) {
            table.addCell(m.getStudent().getFullName());
            table.addCell(m.getStudent().getUniversityName());
            table.addCell(m.getCounselor().getFullName());
            table.addCell(m.getCounselor().getDepartment());
        }

        document.add(table);
        document.close();

        return baos.toByteArray();
    }
}

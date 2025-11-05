package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.model.CareerPath;
import com.smartcareer.careerguidancebackend.repository.CareerPathRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/career-paths")
@CrossOrigin(origins = "*")
public class CareerPathController {

    @Autowired
    private CareerPathRepository careerPathRepository;

    // Create new career path
    @PostMapping("/add")
    public CareerPath addCareerPath(@RequestBody CareerPath careerPath) {
        return careerPathRepository.save(careerPath);
    }

    // Get all career paths
    @GetMapping("/all")
    public List<CareerPath> getAllCareerPaths() {
        return careerPathRepository.findAll();
    }

    // Get career path by ID
    @GetMapping("/{id}")
    public ResponseEntity<CareerPath> getCareerPathById(@PathVariable Long id) {
        Optional<CareerPath> careerPath = careerPathRepository.findById(id);
        return careerPath.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update career path
    @PutMapping("/update/{id}")
    public ResponseEntity<CareerPath> updateCareerPath(@PathVariable Long id, @RequestBody CareerPath careerPathDetails) {
        Optional<CareerPath> careerPathOpt = careerPathRepository.findById(id);
        if (careerPathOpt.isPresent()) {
            CareerPath careerPath = careerPathOpt.get();
            careerPath.setCareerName(careerPathDetails.getCareerName());
            careerPath.setDescription(careerPathDetails.getDescription());
            careerPath.setRequiredSkills(careerPathDetails.getRequiredSkills());
            return ResponseEntity.ok(careerPathRepository.save(careerPath));
        }
        return ResponseEntity.notFound().build();
    }

    // Delete career path
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCareerPath(@PathVariable Long id) {
        if (careerPathRepository.existsById(id)) {
            careerPathRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
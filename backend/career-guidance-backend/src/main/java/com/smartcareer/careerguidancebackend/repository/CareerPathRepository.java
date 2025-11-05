package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.CareerPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerPathRepository extends JpaRepository<CareerPath, Long> {
}

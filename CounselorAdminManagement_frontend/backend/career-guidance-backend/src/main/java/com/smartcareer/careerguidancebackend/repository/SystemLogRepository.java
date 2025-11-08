package com.smartcareer.careerguidancebackend.repository;

import com.smartcareer.careerguidancebackend.model.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {

    // Find all logs by actor (e.g., admin username)
    List<SystemLog> findByActor(String actor);

    // Optional: sort by time (Spring Data can auto sort by timestamp desc in queries)
}

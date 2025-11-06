package com.smartcareer.careerguidancebackend.repository;


import com.smartcareer.careerguidancebackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    //  Used in reports to count users by role (e.g., STUDENT, COUNSELOR, ADMIN)
    @Query("SELECT COUNT(u) FROM User u WHERE u.role.name = :roleName")
    long countByRoleName(String roleName);

}


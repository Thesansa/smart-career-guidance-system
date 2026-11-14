package com.smartcareer.careerguidancebackend.controller;

import com.smartcareer.careerguidancebackend.dto.request.RoleRequest;
import com.smartcareer.careerguidancebackend.dto.response.RoleResponse;
import com.smartcareer.careerguidancebackend.model.Role;
import com.smartcareer.careerguidancebackend.service.RoleService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;


    // CREATE ROLE
    @PostMapping("/add")
    public ResponseEntity<RoleResponse> addRole(
            @Valid @RequestBody RoleRequest request) {

        Role role = new Role(request.getName());

        Role savedRole = roleService.saveRole(role);

        RoleResponse response = new RoleResponse(
                savedRole.getId(),
                savedRole.getName()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }


    // GET ALL ROLES
    @GetMapping("/all")
    public ResponseEntity<List<RoleResponse>> getAllRoles() {

        List<RoleResponse> roles = roleService.getAllRoles()
                .stream()
                .map(role -> new RoleResponse(
                        role.getId(),
                        role.getName()
                ))
                .toList();

        return ResponseEntity.ok(roles);
    }


    // GET ROLE BY ID
    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getRoleById(
            @PathVariable Integer id) {

        Role role = roleService.getRoleById(id)
                .orElseThrow(() ->
                        new com.smartcareer.careerguidancebackend.exceptions.ResourceNotFoundException(
                                "Role not found."
                        )
                );

        RoleResponse response = new RoleResponse(
                role.getId(),
                role.getName()
        );

        return ResponseEntity.ok(response);
    }


    // DELETE ROLE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(
            @PathVariable Integer id) {

        roleService.deleteRole(id);

        return ResponseEntity.noContent().build();
    }
}
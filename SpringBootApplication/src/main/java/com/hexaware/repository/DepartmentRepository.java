package com.hexaware.repository;

import com.hexaware.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department ,Integer> {
}

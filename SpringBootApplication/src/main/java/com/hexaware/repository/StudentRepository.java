package com.hexaware.repository;

import com.hexaware.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;


public interface StudentRepository  extends JpaRepository<Student, Integer> {


}

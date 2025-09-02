package com.hexaware.service;

import com.hexaware.entity.Student;

import java.util.List;

public interface StudentService {

    Student createUser(Student stud);

    List<Student>getAllStudents();

    Student  getStudentById(int studId);

    void deleteStudentById(int studId);

    void updateStudentById(int studId,Student studentDetails);



}

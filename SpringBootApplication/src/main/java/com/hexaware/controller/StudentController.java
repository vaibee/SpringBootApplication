package com.hexaware.controller;

import com.hexaware.entity.Student;
import com.hexaware.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/student")

public class StudentController {

    private StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

// this is for the porpose of - communication between HTTP request and the response.(here the client is POSTMAN APP)
    @PostMapping
    public ResponseEntity<Student> CreateUser(@RequestBody Student stud)
    {
        Student savedStudent=studentService.createUser(stud);
        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity <List<Student>> getStudents(){
       List<Student> getStudents = studentService.getAllStudents();
        return new ResponseEntity<>(getStudents, HttpStatus.OK);
    }

    // get by Id(we mention id at the url in post man(get)
    @GetMapping("{id}")
    public ResponseEntity <Student> getStudentById(@PathVariable("id") int studId){
        Student getStudentById = studentService.getStudentById(studId);
        return new ResponseEntity<>(getStudentById, HttpStatus.OK);
    }

//    now controller for delete by id

    @PutMapping("{id}")
    public ResponseEntity<String> updateStudentById(@PathVariable("id") int studId,
                                                    @RequestBody Student studentDetails) {
        studentService.updateStudentById(studId, studentDetails);
        return new ResponseEntity<>("record updated successfully", HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteStudentById(@PathVariable("id") int studId) {
        studentService.deleteStudentById(studId);
        return new ResponseEntity<>("Student deleted successfully", HttpStatus.OK);
    }

}
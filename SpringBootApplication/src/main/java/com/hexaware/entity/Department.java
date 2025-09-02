package com.hexaware.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "dept")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private  String deptName;

    @Column(nullable = false)
    private String location;

    @OneToMany(mappedBy = "dept", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Student> students;


    public Department() {
    }

    public Department(String deptName, int id, String location, List<Student> students) {
        this.deptName = deptName;
        this.id = id;
        this.location = location;
        this.students = students;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }

    @Override
    public String toString() {
        return "Department{" +
                "deptName='" + deptName + '\'' +
                ", id=" + id +
                ", location='" + location + '\'' +
                ", students=" + students +
                '}';
    }
}

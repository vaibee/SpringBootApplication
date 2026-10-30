# Spring Boot Student & Department API

A beginner-friendly Spring Boot project for managing students and departments. It includes a small web page for using the API in a browser, so you do not need a separate API client to try the main features.

## What is in this project?

- **Spring Boot REST API** built with Java 17.
- **MySQL database** accessed through Spring Data JPA.
- **Browser interface** for viewing, searching, adding, editing, and deleting students and departments.

The Maven project is in the `SpringBootApplication` folder. The browser page is served by Spring Boot from `src/main/resources/static`.

## What you need first

Install or have access to:

1. **Java 17** or newer.
2. **MySQL Server** running on your computer.
3. A terminal, or IntelliJ IDEA.

You do not need to install Maven separately; the project includes the Maven Wrapper.

## Set up the database

Create a MySQL database named `springbootdatabase`. To create the tables and load sample records in one step, open `DB_SETUP.sql` in MySQL Workbench and run the script. You can also create the database manually:

```sql
CREATE DATABASE springbootdatabase;
```

Open `SpringBootApplication/src/main/resources/application.properties` and set the MySQL username and password for your local database. The connection is configured for `localhost:3306` and the database name `springbootdatabase`.

Do not commit or share your real database password. Keep credentials local to your machine.

## Run the application on Windows

Open PowerShell in the repository folder and run:

```powershell
cd .\SpringBootApplication
.\mvnw.cmd spring-boot:run
```

When Spring Boot has started, open **http://localhost:8080/** in your browser. Keep the terminal open while using the app. Stop the application with **Ctrl+C**.

The page calls the API on the same server, so you do not need to configure a separate API address.

## Use the web page

- Choose **Students** or **Departments** to switch between lists.
- Use the search box to filter the current list.
- Choose **Add student** or **Add department** to create a record.
- Use **View**, **Edit**, and **Delete** beside a record to manage it.
- Create a department before adding a student, since every student must belong to a department.

## API reference

All routes are relative to `http://localhost:8080`.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/student` | List students |
| `GET` | `/api/student/{id}` | Get one student |
| `POST` | `/api/student` | Create a student |
| `PUT` | `/api/student/{id}` | Update a student |
| `DELETE` | `/api/student/{id}` | Delete a student |
| `GET` | `/api/dept` | List departments |
| `GET` | `/api/dept/{id}` | Get one department |
| `POST` | `/api/dept` | Create a department |
| `PUT` | `/api/dept/{id}` | Update a department |
| `DELETE` | `/api/dept/{id}` | Delete a department |

Requests that create or update records use JSON. For example, create a department:

```json
{
  "deptName": "Computer Science",
  "location": "Building A"
}
```

Create a student by referring to an existing department's ID:

```json
{
  "studentName": "Alex Morgan",
  "studentAge": 20,
  "dept": {
    "id": 1
  }
}
```

For an update, send the same JSON shape to the matching route with the record ID, such as `PUT /api/student/1`.

## Run the tests

From the `SpringBootApplication` folder, run:

```powershell
.\mvnw.cmd test
```

## Troubleshooting

- **The app does not start:** Confirm that Java 17 or newer is installed. Check the terminal output for the specific startup error.
- **Database connection error:** Confirm MySQL is running, the `springbootdatabase` database exists, and the username/password in `application.properties` are correct.
- **The page cannot load records:** Make sure Spring Boot started successfully and visit the page at `http://localhost:8080/`.
- **A student cannot be created:** Create a department first and select its ID.

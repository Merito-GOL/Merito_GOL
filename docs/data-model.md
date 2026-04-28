# MeritoGOL Data Model

`db.json` is designed for `json-server`. It stores demo data for authentication, student grade views, and teacher grade CRUD.

## Entity comments

- `departments`: Departments represent university faculties and define the main access boundary for teachers, students, courses, and grades.
- `fieldsOfStudy`: Fields of study represent degree programs that belong to a department, such as Computer Science or Management.
- `groups`: Groups represent student class groups used for display and filtering, but they do not restrict teacher grading permissions.
- `semesters`: Semesters describe academic periods used to group courses, grades, and student progress summaries.
- `users`: Users store login accounts for students and teachers, including role-specific profile data.
- `courses`: Courses represent subjects that can receive grades and are assigned to a department, field of study, and semester.
- `grades`: Grades store the final grade assigned to a student for a course by a teacher from the same department.
- `studentSemesterSummaries`: Student semester summaries store calculated averages and semester status for each student and semester.

## Relations

```txt
departments 1 -- n fieldsOfStudy
departments 1 -- n groups
departments 1 -- n users
departments 1 -- n courses

fieldsOfStudy 1 -- n groups
fieldsOfStudy 1 -- n students
fieldsOfStudy 1 -- n courses

groups 1 -- n students
semesters 1 -- n courses
semesters 1 -- n studentSemesterSummaries

users(student) 1 -- n grades via grades.studentId
users(teacher) 1 -- n grades via grades.createdBy
courses 1 -- n grades
```

Teacher permissions are department based:

```txt
teacher.departmentId === student.departmentId
teacher.departmentId === course.departmentId
```

Groups are filters and display metadata. They are not the main grading permission boundary.

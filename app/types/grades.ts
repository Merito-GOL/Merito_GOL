export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface StudentProfile {
  id: string
  firstName: string
  lastName: string
  albumNumber: string
  program: string
  faculty: string
  startYear: number
  currentSemester: Semester
}

export interface BaseSubject {
  id: string
  name: string
  hours: number
  ects: number
  finalGrade: string | null
  date: string
  teacher: string
  group: string
  semester: Semester
}

export interface StudentSubject extends BaseSubject {
  view: 'student'
}

export interface TeacherSubject extends BaseSubject {
  view: 'teacher'
  studentName: string
  studentAlbum: string
}

export type AnySubject = StudentSubject | TeacherSubject

export interface GradeFilterState {
  search: string
}

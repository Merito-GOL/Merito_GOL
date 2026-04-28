export type UserRole = 'student' | 'teacher'

export interface Department {
  id: number
  name: string
}

export interface FieldOfStudy {
  id: number
  name: string
  departmentId: number
}

export interface Group {
  id: number
  code: string
  departmentId: number
  fieldOfStudyId: number
}

export interface Semester {
  id: number
  label: string
  number: number
  term: string
  academicYear: string
}

export interface BaseUser {
  id: number
  role: UserRole
  email: string
  password: string
  firstName: string
  lastName: string
  departmentId: number
}

export interface StudentUser extends BaseUser {
  role: 'student'
  albumNumber: string
  fieldOfStudyId: number
  groupId: number
}

export interface TeacherUser extends BaseUser {
  role: 'teacher'
  title: string
}

export type User = StudentUser | TeacherUser

export interface Course {
  id: number
  name: string
  hours: number
  ects: number
  departmentId: number
  fieldOfStudyId: number
  semesterId: number
  defaultTeacherId: number | null
}

export interface Grade {
  id: number
  studentId: number
  courseId: number
  value: number
  type: string
  date: string
  createdBy: number
  updatedAt: string
}

export interface StudentSemesterSummary {
  id: number
  studentId: number
  semesterId: number
  avgSem: number
  avgYear: number
  avgAll: number
  status: string
}

export interface GradePayload {
  studentId: number
  courseId: number
  value: number
  type: string
  date: string
  createdBy: number
  updatedAt: string
}

export type GradeValue = 2 | 3 | 3.5 | 4 | 4.5 | 5

export type GradeType = 'exam' | 'test' | 'project' | 'activity' | 'final'

export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface Grade {
  id: string
  subjectId: string
  value: GradeValue
  type: GradeType
  date: string
  description: string
  teacherName: string
}

export interface Subject {
  id: string
  name: string
  code: string
  ects: number
  semester: Semester
  teacherName: string
  grades: Grade[]
  finalGrade: GradeValue | null
}

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

export interface GradeFilterState {
  search: string
  semester: Semester | null
  type: GradeType | null
  minGrade: GradeValue | null
}

export interface SubjectAverage {
  subjectId: string
  average: number
}

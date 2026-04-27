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

export interface GradeFilterState {
  search: string
}

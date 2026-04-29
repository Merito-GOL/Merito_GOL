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

// ─── Student view ──────────────────────────────────────────────────

export interface StudentSubject {
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

// ─── Teacher view ──────────────────────────────────────────────────

export const GRADE_OPTIONS = ['5,0', '4,5', '4,0', '3,5', '3,0', '2,0', '—'] as const
export type GradeOption = typeof GRADE_OPTIONS[number]

export interface RosterStudent {
  id: string
  name: string
}

export interface TeachingAssignment {
  id: string
  name: string
  hours: number
  ects: number
  group: string
  semester: Semester
  studentCount: number
}

// ─── Shared ────────────────────────────────────────────────────────

export interface GradeFilterState {
  search: string
  semester: Semester | null
  gradeStatus: 'all' | 'graded' | 'missing'
}

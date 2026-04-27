import type { Subject, StudentProfile, GradeValue } from '~/types/grades'

export const mockStudent: StudentProfile = {
  id: 'student-001',
  firstName: 'Anna',
  lastName: 'Kowalska',
  albumNumber: '12345',
  program: 'Informatyka',
  faculty: 'Wydział Informatyki i Zarządzania',
  startYear: 2022,
  currentSemester: 4,
}

export const mockSubjects: Subject[] = [
  {
    id: 'sub-01',
    name: 'Algorytmy i Struktury Danych',
    code: 'ASD',
    ects: 6,
    semester: 3,
    teacherName: 'dr Jan Nowak',
    finalGrade: 4.5,
    grades: [
      { id: 'g-001', subjectId: 'sub-01', value: 4,   type: 'test',     date: '2024-10-15', description: 'Kolokwium 1', teacherName: 'dr Jan Nowak' },
      { id: 'g-002', subjectId: 'sub-01', value: 5,   type: 'test',     date: '2024-11-20', description: 'Kolokwium 2', teacherName: 'dr Jan Nowak' },
      { id: 'g-003', subjectId: 'sub-01', value: 4.5, type: 'exam',     date: '2025-01-15', description: 'Egzamin końcowy', teacherName: 'dr Jan Nowak' },
    ],
  },
  {
    id: 'sub-02',
    name: 'Bazy Danych',
    code: 'BD',
    ects: 5,
    semester: 3,
    teacherName: 'dr Anna Wiśniewska',
    finalGrade: 4,
    grades: [
      { id: 'g-004', subjectId: 'sub-02', value: 3.5, type: 'project',  date: '2024-10-28', description: 'Projekt SQL',    teacherName: 'dr Anna Wiśniewska' },
      { id: 'g-005', subjectId: 'sub-02', value: 4,   type: 'test',     date: '2024-11-25', description: 'Kolokwium',      teacherName: 'dr Anna Wiśniewska' },
      { id: 'g-006', subjectId: 'sub-02', value: 4,   type: 'exam',     date: '2025-01-20', description: 'Egzamin',        teacherName: 'dr Anna Wiśniewska' },
    ],
  },
  {
    id: 'sub-03',
    name: 'Programowanie Obiektowe',
    code: 'PO',
    ects: 6,
    semester: 4,
    teacherName: 'mgr Piotr Zając',
    finalGrade: 5,
    grades: [
      { id: 'g-007', subjectId: 'sub-03', value: 5,   type: 'project',  date: '2025-03-10', description: 'Projekt zaliczeniowy', teacherName: 'mgr Piotr Zając' },
      { id: 'g-008', subjectId: 'sub-03', value: 5,   type: 'activity', date: '2025-04-01', description: 'Aktywność',            teacherName: 'mgr Piotr Zając' },
    ],
  },
  {
    id: 'sub-04',
    name: 'Sieci Komputerowe',
    code: 'SK',
    ects: 4,
    semester: 4,
    teacherName: 'dr hab. Marek Lewandowski',
    finalGrade: 3,
    grades: [
      { id: 'g-009', subjectId: 'sub-04', value: 3,   type: 'test',     date: '2025-03-20', description: 'Kolokwium 1',  teacherName: 'dr hab. Marek Lewandowski' },
      { id: 'g-010', subjectId: 'sub-04', value: 3,   type: 'exam',     date: '2025-04-25', description: 'Egzamin',      teacherName: 'dr hab. Marek Lewandowski' },
    ],
  },
  {
    id: 'sub-05',
    name: 'Matematyka Dyskretna',
    code: 'MD',
    ects: 5,
    semester: 2,
    teacherName: 'prof. Zofia Kamińska',
    finalGrade: 3.5,
    grades: [
      { id: 'g-011', subjectId: 'sub-05', value: 3,   type: 'test',     date: '2023-10-12', description: 'Kolokwium 1',  teacherName: 'prof. Zofia Kamińska' },
      { id: 'g-012', subjectId: 'sub-05', value: 4,   type: 'test',     date: '2023-11-18', description: 'Kolokwium 2',  teacherName: 'prof. Zofia Kamińska' },
      { id: 'g-013', subjectId: 'sub-05', value: 3.5, type: 'exam',     date: '2024-01-22', description: 'Egzamin',      teacherName: 'prof. Zofia Kamińska' },
    ],
  },
  {
    id: 'sub-06',
    name: 'Inżynieria Oprogramowania',
    code: 'IO',
    ects: 6,
    semester: 4,
    teacherName: 'dr Tomasz Kowalczyk',
    finalGrade: null,
    grades: [
      { id: 'g-014', subjectId: 'sub-06', value: 4,   type: 'project',  date: '2025-04-10', description: 'Sprint review 1', teacherName: 'dr Tomasz Kowalczyk' },
    ],
  },
]

export const GRADE_TYPE_LABELS: Record<string, string> = {
  exam:     'Egzamin',
  test:     'Kolokwium',
  project:  'Projekt',
  activity: 'Aktywność',
  final:    'Ocena końcowa',
}

export const SEMESTER_OPTIONS = Array.from({ length: 8 }, (_, i) => i + 1) as (1|2|3|4|5|6|7|8)[]

export function gradeColor(value: GradeValue): string {
  if (value >= 4.5) return 'excellent'
  if (value >= 4)   return 'good'
  if (value >= 3.5) return 'average'
  if (value >= 3)   return 'poor'
  return 'fail'
}

export function computeAverage(grades: { value: number }[]): number {
  if (!grades.length) return 0
  return grades.reduce((sum, g) => sum + g.value, 0) / grades.length
}

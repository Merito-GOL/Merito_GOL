import type { StudentProfile, StudentSubject, TeachingAssignment, RosterStudent } from '~/types/grades'

export const mockStudent: StudentProfile = {
  id: 'student-001',
  firstName: 'Jan',
  lastName: 'Kowalski',
  albumNumber: 'S-21219',
  program: 'Informatyka',
  faculty: 'Wydział Informatyki i Nowych Technologii',
  startYear: 2024,
  currentSemester: 4,
}

export interface MockSemester {
  id: number
  label: string
  avgSem: number
  avgYear: number
  avgAll: number
  status: string
}

export const mockSemesters: MockSemester[] = [
  { id: 0, label: 'Semestr 4 (letni) 2025/26',   avgSem: 5.0, avgYear: 4.54, avgAll: 4.82, status: 'wpis na semestr — warunkowy' },
  { id: 1, label: 'Semestr 3 (zimowy) 2025/26',  avgSem: 4.7, avgYear: 4.54, avgAll: 4.78, status: 'zaliczony' },
  { id: 2, label: 'Semestr 2 (letni) 2024/25',   avgSem: 4.5, avgYear: 4.5,  avgAll: 4.65, status: 'zaliczony' },
  { id: 3, label: 'Semestr 1 (zimowy) 2024/25',  avgSem: 4.3, avgYear: 4.3,  avgAll: 4.3,  status: 'zaliczony' },
]

// ─── Student mock data ─────────────────────────────────────────────

export const mockSubjects: StudentSubject[] = [
  { id: 'sub-01', name: 'RIA, Case study: Angular',                              hours: 16, ects: 3, finalGrade: '5,0', date: '2026-03-12', teacher: 'dr Anna Wiśniewska',     group: 'INF-3A', semester: 4 },
  { id: 'sub-02', name: 'Seminarium dyplomowe',                                  hours: 20, ects: 8, finalGrade: '4,5', date: '2026-03-08', teacher: 'dr hab. Piotr Lis',      group: 'INF-3A', semester: 4 },
  { id: 'sub-03', name: 'Technologie tworzenia stron WWW',                       hours: 16, ects: 3, finalGrade: '5,0', date: '2026-02-28', teacher: 'mgr Karol Mazur',        group: 'INF-2B', semester: 4 },
  { id: 'sub-04', name: 'Tworzenie aplikacji PWA',                               hours: 16, ects: 3, finalGrade: '5,0', date: '2026-03-15', teacher: 'dr Tomasz Bąk',          group: 'INF-3A', semester: 4 },
  { id: 'sub-05', name: 'Zarządzanie bezpieczeństwem informacji – warsztaty',    hours: 16, ects: 2, finalGrade: '4,0', date: '2026-02-21', teacher: 'dr Marta Nowak',         group: 'INF-3B', semester: 4 },
  { id: 'sub-06', name: 'Zarządzanie projektami – gra biznesowa',                hours: 16, ects: 2, finalGrade: '4,5', date: '2026-03-02', teacher: 'mgr Jakub Sienkiewicz',  group: 'INF-2A', semester: 4 },
  { id: 'sub-07', name: 'Zespołowy projekt bezpieczeństwa',                      hours: 16, ects: 3, finalGrade: '5,0', date: '2026-03-19', teacher: 'dr Marta Nowak',         group: 'INF-3B', semester: 4 },
  { id: 'sub-08', name: 'Zintegrowane systemy zarządzania bezpieczeństwem',      hours: 16, ects: 3, finalGrade: '4,0', date: '2026-02-14', teacher: 'dr Tomasz Bąk',          group: 'INF-3B', semester: 4 },
  { id: 'sub-09', name: 'Algorytmy i Struktury Danych',                          hours: 30, ects: 6, finalGrade: '4,5', date: '2025-01-15', teacher: 'dr Jan Nowak',            group: 'INF-2A', semester: 3 },
  { id: 'sub-10', name: 'Bazy Danych',                                           hours: 30, ects: 5, finalGrade: '4,0', date: '2025-01-20', teacher: 'dr Anna Wiśniewska',      group: 'INF-2A', semester: 3 },
  { id: 'sub-11', name: 'Matematyka Dyskretna',                                  hours: 30, ects: 5, finalGrade: '3,5', date: '2024-01-22', teacher: 'prof. Zofia Kamińska',    group: 'INF-1A', semester: 2 },
  { id: 'sub-12', name: 'Inżynieria Oprogramowania',                             hours: 16, ects: 6, finalGrade: null,  date: '',           teacher: 'dr Tomasz Kowalczyk',    group: 'INF-3A', semester: 4 },
]

// ─── Teacher mock data ─────────────────────────────────────────────

export const mockTeachingAssignments: TeachingAssignment[] = [
  { id: 'ta-01', name: 'RIA, Case study: Angular',                           hours: 16, ects: 3, group: 'INF-3A', semester: 4, studentCount: 28 },
  { id: 'ta-02', name: 'Seminarium dyplomowe',                               hours: 20, ects: 8, group: 'INF-3A', semester: 4, studentCount: 12 },
  { id: 'ta-03', name: 'Technologie tworzenia stron WWW',                    hours: 16, ects: 3, group: 'INF-2B', semester: 4, studentCount: 31 },
  { id: 'ta-04', name: 'Tworzenie aplikacji PWA',                            hours: 16, ects: 3, group: 'INF-3A', semester: 4, studentCount: 26 },
  { id: 'ta-05', name: 'Zarządzanie bezpieczeństwem informacji – warsztaty', hours: 16, ects: 2, group: 'INF-3B', semester: 4, studentCount: 24 },
  { id: 'ta-06', name: 'Zarządzanie projektami – gra biznesowa',             hours: 16, ects: 2, group: 'INF-2A', semester: 4, studentCount: 29 },
  { id: 'ta-07', name: 'Zespołowy projekt bezpieczeństwa',                   hours: 16, ects: 3, group: 'INF-3B', semester: 4, studentCount: 22 },
  { id: 'ta-08', name: 'Zintegrowane systemy zarządzania bezpieczeństwem',   hours: 16, ects: 3, group: 'INF-3B', semester: 4, studentCount: 24 },
]

export const mockRoster: RosterStudent[] = [
  { id: 'S-21219', name: 'Jan Kowalski' },
  { id: 'S-21220', name: 'Maria Nowak' },
  { id: 'S-21221', name: 'Piotr Wiśniewski' },
  { id: 'S-21222', name: 'Anna Zielińska' },
  { id: 'S-21223', name: 'Krzysztof Dąbrowski' },
  { id: 'S-21224', name: 'Karolina Wójcik' },
  { id: 'S-21225', name: 'Tomasz Lewandowski' },
  { id: 'S-21226', name: 'Magdalena Kamińska' },
]

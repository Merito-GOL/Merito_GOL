import type {
  Course,
  Department,
  FieldOfStudy,
  Grade,
  GradePayload,
  Group,
  Semester,
  StudentSemesterSummary,
  TeacherUser,
  User,
} from '~/types/entities'

const VALID_GRADES = [2, 3, 3.5, 4, 4.5, 5]

export const useGradeStore = () => {
  const api = useMeritoApi()
  const departments = useState<Department[]>('grades.departments', () => [])
  const fieldsOfStudy = useState<FieldOfStudy[]>('grades.fieldsOfStudy', () => [])
  const groups = useState<Group[]>('grades.groups', () => [])
  const semesters = useState<Semester[]>('grades.semesters', () => [])
  const users = useState<User[]>('grades.users', () => [])
  const courses = useState<Course[]>('grades.courses', () => [])
  const grades = useState<Grade[]>('grades.grades', () => [])
  const summaries = useState<StudentSemesterSummary[]>('grades.summaries', () => [])
  const loading = useState('grades.loading', () => false)
  const error = useState<string | null>('grades.error', () => null)

  const loadAll = async () => {
    loading.value = true
    error.value = null

    try {
      const [
        departmentRows,
        fieldRows,
        groupRows,
        semesterRows,
        userRows,
        courseRows,
        gradeRows,
        summaryRows,
      ] = await Promise.all([
        api.getDepartments(),
        api.getFieldsOfStudy(),
        api.getGroups(),
        api.getSemesters(),
        api.getUsers(),
        api.getCourses(),
        api.getGrades(),
        api.getStudentSemesterSummaries(),
      ])

      departments.value = departmentRows
      fieldsOfStudy.value = fieldRows
      groups.value = groupRows
      semesters.value = semesterRows
      users.value = userRows
      courses.value = courseRows
      grades.value = gradeRows
      summaries.value = summaryRows
    } catch {
      error.value = 'Nie udalo sie pobrac danych. Sprawdz, czy dziala npm run mock-api.'
    } finally {
      loading.value = false
    }
  }

  const getDepartment = (id: number) => departments.value.find((department) => department.id === id)
  const getFieldOfStudy = (id: number) => fieldsOfStudy.value.find((field) => field.id === id)
  const getGroup = (id: number) => groups.value.find((group) => group.id === id)
  const getSemester = (id: number) => semesters.value.find((semester) => semester.id === id)
  const getUser = (id: number) => users.value.find((user) => user.id === id)
  const getCourse = (id: number) => courses.value.find((course) => course.id === id)

  const getDepartmentStudents = (departmentId: number) => {
    return users.value.filter((user) => user.role === 'student' && user.departmentId === departmentId)
  }

  const getDepartmentCourses = (departmentId: number) => {
    return courses.value.filter((course) => course.departmentId === departmentId)
  }

  const getStudentGrades = (studentId: number) => {
    return grades.value.filter((grade) => grade.studentId === studentId)
  }

  const assertTeacherCanGrade = (teacher: TeacherUser, studentId: number, courseId: number, value: number) => {
    const student = getUser(studentId)
    const course = getCourse(courseId)

    if (!VALID_GRADES.includes(value)) {
      throw new Error('Nieprawidlowa wartosc oceny.')
    }

    if (!student || student.role !== 'student') {
      throw new Error('Wybrany student nie istnieje.')
    }

    if (!course) {
      throw new Error('Wybrany przedmiot nie istnieje.')
    }

    if (student.departmentId !== teacher.departmentId || course.departmentId !== teacher.departmentId) {
      throw new Error('Wykladowca moze wystawiac oceny tylko w swoim wydziale.')
    }
  }

  const saveGrade = async (teacher: TeacherUser, payload: Omit<GradePayload, 'createdBy' | 'updatedAt'>, gradeId?: number) => {
    assertTeacherCanGrade(teacher, payload.studentId, payload.courseId, payload.value)

    const body: GradePayload = {
      ...payload,
      createdBy: teacher.id,
      updatedAt: new Date().toISOString(),
    }

    if (gradeId) {
      const updated = await api.updateGrade(gradeId, body)
      grades.value = grades.value.map((grade) => grade.id === updated.id ? updated : grade)
      return updated
    }

    const created = await api.createGrade(body)
    grades.value = [...grades.value, created]
    return created
  }

  const removeGrade = async (id: number) => {
    await api.deleteGrade(id)
    grades.value = grades.value.filter((grade) => grade.id !== id)
  }

  return {
    departments,
    fieldsOfStudy,
    groups,
    semesters,
    users,
    courses,
    grades,
    summaries,
    loading,
    error,
    loadAll,
    getDepartment,
    getFieldOfStudy,
    getGroup,
    getSemester,
    getUser,
    getCourse,
    getDepartmentStudents,
    getDepartmentCourses,
    getStudentGrades,
    saveGrade,
    removeGrade,
  }
}

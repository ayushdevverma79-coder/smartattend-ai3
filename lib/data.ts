export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export const REQUIRED_ATTENDANCE = 75

/* ───────────────────────── Student ───────────────────────── */

export const student = {
  name: 'Aarav Mehta',
  firstName: 'Aarav',
  email: 'aarav.mehta@nitk.edu.in',
  roll: 'CS21B047',
  program: 'B.Tech Computer Science',
  semester: 'Semester 5',
  institution: 'National Institute of Technology',
}

export type Subject = {
  id: string
  code: string
  name: string
  faculty: string
  attended: number
  total: number
  color: string
  schedule: string
}

export const studentSubjects: Subject[] = [
  { id: 'dsa', code: 'CS301', name: 'Data Structures & Algorithms', faculty: 'Dr. Priya Raman', attended: 38, total: 42, color: 'var(--chart-1)', schedule: 'Mon, Wed · 09:00' },
  { id: 'dbms', code: 'CS303', name: 'Database Management Systems', faculty: 'Prof. Karthik Iyer', attended: 33, total: 40, color: 'var(--chart-2)', schedule: 'Tue, Thu · 11:00' },
  { id: 'os', code: 'CS305', name: 'Operating Systems', faculty: 'Dr. Neha Kulkarni', attended: 27, total: 38, color: 'var(--chart-3)', schedule: 'Mon, Fri · 14:00' },
  { id: 'cn', code: 'CS307', name: 'Computer Networks', faculty: 'Prof. Rahul Desai', attended: 31, total: 36, color: 'var(--chart-4)', schedule: 'Wed, Fri · 10:00' },
  { id: 'ml', code: 'CS309', name: 'Machine Learning', faculty: 'Dr. Ananya Sen', attended: 25, total: 34, color: 'var(--chart-5)', schedule: 'Tue, Thu · 15:00' },
  { id: 'dm', code: 'MA301', name: 'Discrete Mathematics', faculty: 'Dr. Vikram Shah', attended: 35, total: 39, color: 'oklch(0.62 0.16 210)', schedule: 'Mon, Thu · 12:00' },
]

export const pct = (a: number, t: number) => (t === 0 ? 0 : (a / t) * 100)

export const studentTotals = studentSubjects.reduce(
  (acc, s) => ({ attended: acc.attended + s.attended, total: acc.total + s.total }),
  { attended: 0, total: 0 },
)

export const weeklyTrend = [
  { week: 'W1', you: 92, cohort: 86 },
  { week: 'W2', you: 88, cohort: 85 },
  { week: 'W3', you: 90, cohort: 84 },
  { week: 'W4', you: 78, cohort: 83 },
  { week: 'W5', you: 74, cohort: 82 },
  { week: 'W6', you: 81, cohort: 82 },
  { week: 'W7', you: 86, cohort: 81 },
  { week: 'W8', you: 84, cohort: 82 },
  { week: 'W9', you: 89, cohort: 83 },
  { week: 'W10', you: 85, cohort: 82 },
]

export const thisWeek = [
  { day: 'Mon', present: 4, absent: 0 },
  { day: 'Tue', present: 3, absent: 1 },
  { day: 'Wed', present: 4, absent: 0 },
  { day: 'Thu', present: 2, absent: 2 },
  { day: 'Fri', present: 3, absent: 0 },
  { day: 'Sat', present: 1, absent: 0 },
]

export type ActivityItem = { id: string; subject: string; code: string; status: AttendanceStatus; date: string; time: string; room: string }

export const recentActivity: ActivityItem[] = [
  { id: 'a1', subject: 'Data Structures & Algorithms', code: 'CS301', status: 'present', date: 'Today', time: '09:02', room: 'LH-204' },
  { id: 'a2', subject: 'Discrete Mathematics', code: 'MA301', status: 'present', date: 'Today', time: '12:05', room: 'LH-108' },
  { id: 'a3', subject: 'Operating Systems', code: 'CS305', status: 'absent', date: 'Yesterday', time: '14:00', room: 'LH-301' },
  { id: 'a4', subject: 'Machine Learning', code: 'CS309', status: 'late', date: 'Yesterday', time: '15:11', room: 'Lab-2' },
  { id: 'a5', subject: 'Database Management Systems', code: 'CS303', status: 'present', date: 'Nov 21', time: '11:01', room: 'LH-210' },
  { id: 'a6', subject: 'Computer Networks', code: 'CS307', status: 'excused', date: 'Nov 20', time: '10:00', room: 'LH-115' },
]

export type Classroom = { id: string; name: string; code: string; faculty: string; students: number; subject: string }

export const joinedClassrooms: Classroom[] = [
  { id: 'c1', name: 'CSE 5A · DSA', code: 'DSA-7KQ2', faculty: 'Dr. Priya Raman', students: 62, subject: 'CS301' },
  { id: 'c2', name: 'CSE 5A · DBMS', code: 'DBM-X91P', faculty: 'Prof. Karthik Iyer', students: 60, subject: 'CS303' },
  { id: 'c3', name: 'CSE 5A · Operating Systems', code: 'OSY-44HD', faculty: 'Dr. Neha Kulkarni', students: 61, subject: 'CS305' },
  { id: 'c4', name: 'ML Elective · Section B', code: 'MLE-2B8T', faculty: 'Dr. Ananya Sen', students: 48, subject: 'CS309' },
]

export const discoverableClassrooms: Record<string, Classroom> = {
  'CNW-5A21': { id: 'c5', name: 'CSE 5A · Computer Networks', code: 'CNW-5A21', faculty: 'Prof. Rahul Desai', students: 59, subject: 'CS307' },
  'DMT-9Z3L': { id: 'c6', name: 'CSE 5A · Discrete Mathematics', code: 'DMT-9Z3L', faculty: 'Dr. Vikram Shah', students: 64, subject: 'MA301' },
}

export type LeaveApplication = {
  id: string
  type: string
  from: string
  to: string
  days: number
  reason: string
  status: LeaveStatus
  submitted: string
  reviewer?: string
  student?: string
  roll?: string
  className?: string
}

export const studentLeaves: LeaveApplication[] = [
  { id: 'l1', type: 'Medical', from: 'Nov 18', to: 'Nov 19', days: 2, reason: 'Viral fever — medical certificate attached.', status: 'approved', submitted: 'Nov 17', reviewer: 'Dr. Priya Raman' },
  { id: 'l2', type: 'Event / Competition', from: 'Nov 28', to: 'Nov 29', days: 2, reason: 'Representing the institute at Smart India Hackathon regionals.', status: 'pending', submitted: 'Nov 23' },
  { id: 'l3', type: 'Personal', from: 'Oct 30', to: 'Oct 30', days: 1, reason: 'Family function out of station.', status: 'rejected', submitted: 'Oct 28', reviewer: 'Dr. Neha Kulkarni' },
]

export type Material = { id: string; title: string; subject: string; kind: 'PDF' | 'Slides' | 'Video' | 'Link'; size: string; added: string }

export const materials: Material[] = [
  { id: 'm1', title: 'Graph Algorithms — BFS, DFS & Topological Sort', subject: 'CS301', kind: 'Slides', size: '4.2 MB', added: '2d ago' },
  { id: 'm2', title: 'Normalization: 1NF to BCNF worked examples', subject: 'CS303', kind: 'PDF', size: '1.8 MB', added: '3d ago' },
  { id: 'm3', title: 'Process Scheduling — Lecture recording', subject: 'CS305', kind: 'Video', size: '52 min', added: '4d ago' },
  { id: 'm4', title: 'Gradient Descent intuition (3Blue1Brown)', subject: 'CS309', kind: 'Link', size: 'External', added: '1w ago' },
  { id: 'm5', title: 'TCP Congestion Control notes', subject: 'CS307', kind: 'PDF', size: '980 KB', added: '1w ago' },
]

export type Assignment = { id: string; title: string; subject: string; due: string; dueIn: string; status: 'todo' | 'submitted' | 'graded'; grade?: string }

export const assignments: Assignment[] = [
  { id: 'as1', title: 'Implement Dijkstra with a binary heap', subject: 'CS301', due: 'Nov 26', dueIn: 'in 2 days', status: 'todo' },
  { id: 'as2', title: 'ER diagram for a hospital management system', subject: 'CS303', due: 'Nov 28', dueIn: 'in 4 days', status: 'todo' },
  { id: 'as3', title: 'Linear regression from scratch (NumPy)', subject: 'CS309', due: 'Nov 22', dueIn: 'Submitted', status: 'submitted' },
  { id: 'as4', title: 'Deadlock detection simulation', subject: 'CS305', due: 'Nov 15', dueIn: 'Graded', status: 'graded', grade: '18/20' },
]

export type Announcement = { id: string; title: string; body: string; author: string; time: string; tag: 'Exam' | 'Event' | 'Notice' | 'Holiday'; pinned?: boolean }

export const announcements: Announcement[] = [
  { id: 'n1', title: 'Mid-semester examinations from Dec 9', body: 'Timetable is now available on the academic portal. Hall tickets will be issued from Dec 2.', author: 'Academic Office', time: '2h ago', tag: 'Exam', pinned: true },
  { id: 'n2', title: 'DSA lab moved to Lab-3 this Friday', body: 'Due to maintenance, the Friday lab session will be held in Lab-3, Block C.', author: 'Dr. Priya Raman', time: '5h ago', tag: 'Notice' },
  { id: 'n3', title: 'Techfest 2026 registrations open', body: 'Register your team for the 36-hour hackathon before Nov 30.', author: 'Student Council', time: '1d ago', tag: 'Event' },
  { id: 'n4', title: 'Campus closed on Nov 27', body: 'The institute will remain closed on account of Guru Nanak Jayanti.', author: 'Registrar', time: '2d ago', tag: 'Holiday' },
]

/* ───────────────────────── Teacher ───────────────────────── */

export const teacher = {
  name: 'Dr. Priya Raman',
  firstName: 'Priya',
  email: 'priya.raman@nitk.edu.in',
  designation: 'Associate Professor',
  department: 'Computer Science & Engineering',
}

export type TeacherClass = { id: string; name: string; section: string; subject: string; code: string; students: number; avg: number; schedule: string; room: string }

export const teacherClasses: TeacherClass[] = [
  { id: 't1', name: 'Data Structures & Algorithms', section: 'CSE 5A', subject: 'CS301', code: 'DSA-7KQ2', students: 62, avg: 87.4, schedule: 'Mon, Wed · 09:00', room: 'LH-204' },
  { id: 't2', name: 'Data Structures & Algorithms', section: 'CSE 5B', subject: 'CS301', code: 'DSA-3MW8', students: 58, avg: 81.2, schedule: 'Tue, Thu · 09:00', room: 'LH-205' },
  { id: 't3', name: 'Advanced Algorithms', section: 'M.Tech 1', subject: 'CS601', code: 'ADA-P0V5', students: 24, avg: 92.1, schedule: 'Fri · 11:00', room: 'Seminar-1' },
  { id: 't4', name: 'Programming in C', section: 'CSE 1C', subject: 'CS101', code: 'PIC-1CZ4', students: 68, avg: 76.8, schedule: 'Mon, Thu · 14:00', room: 'Lab-1' },
]

export type TeacherSubject = { id: string; code: string; name: string; credits: number; type: 'Core' | 'Elective' | 'Lab'; sections: string[]; hours: number }

export const teacherSubjects: TeacherSubject[] = [
  { id: 's1', code: 'CS301', name: 'Data Structures & Algorithms', credits: 4, type: 'Core', sections: ['CSE 5A', 'CSE 5B'], hours: 84 },
  { id: 's2', code: 'CS601', name: 'Advanced Algorithms', credits: 3, type: 'Elective', sections: ['M.Tech 1'], hours: 36 },
  { id: 's3', code: 'CS101', name: 'Programming in C', credits: 4, type: 'Core', sections: ['CSE 1C'], hours: 44 },
  { id: 's4', code: 'CS301L', name: 'DSA Laboratory', credits: 2, type: 'Lab', sections: ['CSE 5A', 'CSE 5B'], hours: 28 },
]

export type StudentRow = { id: string; name: string; roll: string; section: string; attended: number; total: number; trend: number; lastSeen: string; email: string }

const rows: [string, string, string, number, number, number, string][] = [
  ['Aarav Mehta', 'CS21B047', 'CSE 5A', 38, 42, 2.1, 'Today'],
  ['Ishita Sharma', 'CS21B012', 'CSE 5A', 41, 42, 0.4, 'Today'],
  ['Rohan Gupta', 'CS21B033', 'CSE 5A', 28, 42, -6.2, '3 days ago'],
  ['Sneha Reddy', 'CS21B058', 'CSE 5A', 39, 42, 1.0, 'Today'],
  ['Kabir Singh', 'CS21B021', 'CSE 5A', 30, 42, -3.8, 'Yesterday'],
  ['Meera Nair', 'CS21B064', 'CSE 5B', 36, 40, 0.0, 'Today'],
  ['Arjun Patel', 'CS21B071', 'CSE 5B', 26, 40, -8.4, '5 days ago'],
  ['Diya Kapoor', 'CS21B079', 'CSE 5B', 38, 40, 1.6, 'Today'],
  ['Vihaan Joshi', 'CS21B083', 'CSE 5B', 33, 40, -1.2, 'Yesterday'],
  ['Ananya Iyer', 'CS21B090', 'CSE 5B', 29, 40, -4.5, '2 days ago'],
  ['Aditya Rao', 'CS21B095', 'CSE 5A', 40, 42, 0.8, 'Today'],
  ['Saanvi Verma', 'CS21B102', 'CSE 5A', 35, 42, -0.6, 'Today'],
  ['Reyansh Bose', 'MT24C004', 'M.Tech 1', 22, 24, 1.2, 'Today'],
  ['Tara Menon', 'MT24C011', 'M.Tech 1', 23, 24, 0.0, 'Today'],
  ['Kunal Mishra', 'CS24C019', 'CSE 1C', 24, 36, -5.0, '4 days ago'],
  ['Pooja Thakur', 'CS24C027', 'CSE 1C', 31, 36, 2.4, 'Today'],
]

export const teacherStudents: StudentRow[] = rows.map(([name, roll, section, attended, total, trend, lastSeen], i) => ({
  id: `st${i}`,
  name,
  roll,
  section,
  attended,
  total,
  trend,
  lastSeen,
  email: `${name.split(' ')[0].toLowerCase()}.${name.split(' ')[1].toLowerCase()}@nitk.edu.in`,
}))

export const monthlyAttendance = [
  { month: 'Jul', 'CSE 5A': 91, 'CSE 5B': 88, 'M.Tech 1': 95, 'CSE 1C': 86 },
  { month: 'Aug', 'CSE 5A': 89, 'CSE 5B': 85, 'M.Tech 1': 94, 'CSE 1C': 82 },
  { month: 'Sep', 'CSE 5A': 86, 'CSE 5B': 81, 'M.Tech 1': 92, 'CSE 1C': 78 },
  { month: 'Oct', 'CSE 5A': 84, 'CSE 5B': 78, 'M.Tech 1': 91, 'CSE 1C': 73 },
  { month: 'Nov', 'CSE 5A': 87, 'CSE 5B': 81, 'M.Tech 1': 92, 'CSE 1C': 77 },
]

export const dailySessions = [
  { day: 'Mon', present: 118, absent: 12 },
  { day: 'Tue', present: 106, absent: 20 },
  { day: 'Wed', present: 112, absent: 10 },
  { day: 'Thu', present: 109, absent: 17 },
  { day: 'Fri', present: 21, absent: 3 },
]

export const distribution = [
  { band: '≥ 90%', students: 74, fill: 'var(--chart-4)' },
  { band: '75–89%', students: 96, fill: 'var(--chart-1)' },
  { band: '60–74%', students: 31, fill: 'var(--chart-5)' },
  { band: '< 60%', students: 11, fill: 'var(--danger)' },
]

export const teacherLeaves: LeaveApplication[] = [
  { id: 'tl1', student: 'Aarav Mehta', roll: 'CS21B047', className: 'CSE 5A', type: 'Event / Competition', from: 'Nov 28', to: 'Nov 29', days: 2, reason: 'Representing the institute at Smart India Hackathon regionals.', status: 'pending', submitted: '1d ago' },
  { id: 'tl2', student: 'Ananya Iyer', roll: 'CS21B090', className: 'CSE 5B', type: 'Medical', from: 'Nov 25', to: 'Nov 27', days: 3, reason: 'Dental surgery scheduled. Doctor’s note attached.', status: 'pending', submitted: '2d ago' },
  { id: 'tl3', student: 'Kunal Mishra', roll: 'CS24C019', className: 'CSE 1C', type: 'Personal', from: 'Nov 26', to: 'Nov 26', days: 1, reason: 'Passport appointment at regional office.', status: 'pending', submitted: '3d ago' },
  { id: 'tl4', student: 'Meera Nair', roll: 'CS21B064', className: 'CSE 5B', type: 'Medical', from: 'Nov 18', to: 'Nov 19', days: 2, reason: 'Viral fever.', status: 'approved', submitted: '1w ago' },
  { id: 'tl5', student: 'Arjun Patel', roll: 'CS21B071', className: 'CSE 5B', type: 'Personal', from: 'Nov 12', to: 'Nov 15', days: 4, reason: 'Family trip.', status: 'rejected', submitted: '2w ago' },
]

export type Post = { id: string; kind: 'Notice' | 'Notes' | 'Homework' | 'Assignment'; title: string; target: string; posted: string; due?: string; engagement: string }

export const teacherPosts: Post[] = [
  { id: 'p1', kind: 'Notice', title: 'DSA lab moved to Lab-3 this Friday', target: 'CSE 5A, CSE 5B', posted: '5h ago', engagement: '96 seen' },
  { id: 'p2', kind: 'Assignment', title: 'Implement Dijkstra with a binary heap', target: 'CSE 5A', posted: '3d ago', due: 'Nov 26', engagement: '41 / 62 submitted' },
  { id: 'p3', kind: 'Notes', title: 'Graph Algorithms — BFS, DFS & Topological Sort', target: 'CSE 5A, CSE 5B', posted: '2d ago', engagement: '108 downloads' },
  { id: 'p4', kind: 'Homework', title: 'Practice set: Recursion & backtracking (12 problems)', target: 'CSE 1C', posted: '4d ago', due: 'Nov 25', engagement: '52 / 68 done' },
  { id: 'p5', kind: 'Assignment', title: 'Amortized analysis of splay trees', target: 'M.Tech 1', posted: '1w ago', due: 'Nov 30', engagement: '9 / 24 submitted' },
]

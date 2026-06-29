export const mockUsers = {
  admin: {
    id: 1,
    email: 'yoga@studio.com',
    firstName: 'Admin',
    lastName: 'Yoga',
    password: 'test!1234',
    admin: true,
  },
  regular: {
    id: 2,
    email: 'user@test.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'test!1234',
    admin: false,
  },
};

export const mockTeachers = [
  { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
  { id: 2, firstName: 'Hélène', lastName: 'Thiercelin' },
  { id: 3, firstName: 'David', lastName: 'Martin' },
];

export const mockSessions = [
  {
    id: 1,
    name: 'Yoga Vinyasa',
    date: '2026-02-15',
    description:
      'Un cours dynamique qui synchronise le mouvement et la respiration. Idéal pour renforcer le corps et améliorer la flexibilité.',
    teacherId: 1,
    teacher: mockTeachers[0],
    users: [1, 3],
  },
  {
    id: 2,
    name: 'Yoga Hatha',
    date: '2026-02-20',
    description:
      'Une pratique douce et accessible à tous, axée sur les postures et la respiration consciente.',
    teacherId: 2,
    teacher: mockTeachers[1],
    users: [2],
  },
  {
    id: 3,
    name: 'Yoga Ashtanga',
    date: '2026-02-25',
    description:
      'Un style de yoga traditionnel et structuré, avec une série de postures enchaînées de manière fluide.',
    teacherId: 1,
    teacher: mockTeachers[0],
    users: [],
  },
  {
    id: 4,
    name: 'Yin Yoga',
    date: '2026-03-01',
    description:
      'Une pratique relaxante et méditative où les postures sont tenues longtemps pour étirer les tissus profonds.',
    teacherId: 3,
    teacher: mockTeachers[2],
    users: [],
  },
];

export const errorSession = {
  id: 8,
  name: '',
  date: '',
  description: '',
  teacherId: 1,
  teacher: mockTeachers[0],
  users: [0],
};

export default {
  up: queryInterface => queryInterface.bulkInsert('Roles', [
    {
      id: 1,
      role: 'Regular User',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: 2,
      role: 'Admin',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
    {
      id: 3,
      role: 'Super Admin',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    },
  ]),
  down: queryInterface => queryInterface.bulkDelete('Roles', null, {
    returning: true
  })
};

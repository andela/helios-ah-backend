export default {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    id: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    firstName: 'John',
    lastName: 'Doe',
    email: 'yomizy@wizzy.com',
    roleId: 1,
    password: 'myPassword',
    username: 'icecream',
    isVerified: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '315cdb56-fad1-4712-81c8-d82ccdbc8b5a',
    firstName: 'Jide',
    lastName: 'Ajayi',
    email: 'jide@ajayi.com',
    roleId: 2,
    password: 'myPassword',
    username: 'jideajayi',
    isVerified: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }]),
  down: queryInterface => queryInterface.bulkDelete('Users', null)
};

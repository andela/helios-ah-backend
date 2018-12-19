
module.exports = {
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
  },
  {
    id: 'dccd8ee7-bc98-4a8e-a832-ca116d5fff0a',
    username: 'JaneDoeReporter',
    password: 'password',
    email: 'janedoereporter@wemail.com',
    firstName: 'JaneReporter',
    lastName: 'DoeReporter',
    bio: 'Finds and report articles',
    roleId: 1,
    isVerified: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};

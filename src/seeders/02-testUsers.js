
module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    id: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    firstName: 'John',
    lastName: 'Doe',
    email: 'yomizy@wizzy.com',
    roleId: 1,
    password: 'myPassword',
    username: 'icecream',
    emailNotification: true,
    inAppNotification: true,
    isVerified: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'c667aa9b-e5a1-4552-960b-8cc2a9c09ccb',
    firstName: 'Tony',
    lastName: 'Nwosu',
    email: 'tonyboy@andela.com',
    roleId: 1,
    password: 'password',
    username: 'Tonyboy',
    isVerified: true,
    emailNotification: false,
    inAppNotification: false,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: 'e7eaef9b-c3d9-40fa-89e1-26eae190f1aa',
    firstName: 'Mike',
    lastName: 'Nugget',
    email: 'mike@myzone.com',
    roleId: 1,
    password: '12345',
    username: 'shangai',
    emailNotification: false,
    inAppNotification: false,
    isVerified: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'cccd8ee7-bc98-4a8e-a832-ca116d6fff0b',
    username: 'JaneDoeReporter',
    password: 'password',
    email: 'janedoereporter@wemail.com',
    firstName: 'JaneReporter',
    lastName: 'DoeReporter',
    bio: 'Finds and report articles',
    roleId: 1,
    isVerified: true,
    emailNotification: true,
    inAppNotification: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};

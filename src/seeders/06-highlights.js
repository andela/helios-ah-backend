export default {
  up: queryInterface => queryInterface.bulkInsert('Highlights', [{
    id: '1d558292-a1ce-42dc-a76b-c19cd4c734cf',
    text: 'the first highlighted',
    userId: '315cdb56-fad1-4712-81c8-d82ccdbc8b5a',
    articleId: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    isActive: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  }, {
    id: 'bdae38e6-1e73-4b5e-b98c-c02b74336974',
    text: 'the second highlighted',
    userId: '315cdb56-fad1-4712-81c8-d82ccdbc8b5a',
    articleId: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    isActive: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  }]),
  down: queryInterface => queryInterface.bulkDelete('Highlights', null)
};

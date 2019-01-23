export default {
  up: queryInterface => queryInterface.bulkInsert('Highlights', [{
    id: '1d558292-a1ce-42dc-a76b-c19cd4c734cf',
    text: 'but despite the hours of webinar',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    articleId: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    isActive: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  }, {
    id: 'bdae38e6-1e73-4b5e-b98c-c02b74336974',
    text: `Women are sensitive creatures. Most of them possess some measure of 
    empathy`,
    userId: 'c667aa9b-e5a1-4552-960b-8cc2a9c09ccb',
    articleId: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    isActive: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  }]),
  down: queryInterface => queryInterface.bulkDelete('Highlights', null)
};

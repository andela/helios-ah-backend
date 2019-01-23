export default {
  up: queryInterface => queryInterface.bulkInsert('Ratings', [{
    id: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    articleId: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    rating: '3',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    userId: 'e7eaef9b-c3d9-40fa-89e1-26eae190f1aa',
    articleId: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    rating: '4',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    userId: 'cccd8ee7-bc98-4a8e-a832-ca116d6fff0b',
    articleId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    rating: '5',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }]),
  down: queryInterface => queryInterface.bulkDelete('Ratings', null)
};
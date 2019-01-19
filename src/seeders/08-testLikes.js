export default {
  up: queryInterface => queryInterface.bulkInsert('Likes', [{
    id: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    userId: '315cdb56-fad1-4712-81c8-d82ccdbc8b5a',
    articleId: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    isLiked: 'true',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    userId: 'e7eaef9b-c3d9-40fa-89e1-26eae190f1aa',
    articleId: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    isLiked: 'true',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    userId: 'e7eaef9b-c3d9-40fa-89e1-26eae190f1aa',
    articleId: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    isLiked: 'true',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }]),
  down: queryInterface => queryInterface.bulkDelete('Likes', null)
};

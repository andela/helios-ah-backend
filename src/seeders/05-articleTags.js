export default {
  up: queryInterface => queryInterface.bulkInsert('ArticleTags', [{
    id: 'ed698eee-1625-45ba-9952-0a5f49da534b',
    tagId: '8d6af24a-2597-467e-a915-3dabc2e4a7c1',
    articleId: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  }]),
  down: queryInterface => queryInterface.bulkDelete('ArticleTags', null)
};

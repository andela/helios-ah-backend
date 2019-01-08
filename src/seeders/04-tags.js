export default {
  up: queryInterface => queryInterface.bulkInsert('Tags', [{
    id: '8d6af24a-2597-467e-a915-3dabc2e4a7c1',
    tagName: 'tag01',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }]),
  down: queryInterface => queryInterface.bulkDelete('Tags', null)
};

export default {
  up: queryInterface => queryInterface.bulkInsert('Articles', [{
    id: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    title: 'The brow fox',
    body: 'so i saw a dog',
    description: 'narrative',
    isDraft: false,
    image: 'https://someimage.uplodersite.com',
    readTime: '1 mins',
    userId: '315cdb56-fad1-4712-81c8-d82ccdbc8b5a',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    title: 'The brow fox',
    body: 'so i saw a dog',
    description: 'narrative',
    isDraft: false,
    image: 'https://someimage.uplodersite.com',
    readTime: '1 mins',
    userId: '315cdb56-fad1-4712-81c8-d82ccdbc8b5a',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }]),
  down: queryInterface => queryInterface.bulkDelete('Articles', null)
};

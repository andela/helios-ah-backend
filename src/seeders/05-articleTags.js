import uuidv4 from 'uuid/v4';

export default {
  up: queryInterface => queryInterface.bulkInsert('ArticleTags', [{
    id: uuidv4(),
    tagId: '0b4b8c06-88b8-423e-b2b3-3166a43831ad',
    articleId: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    tagId: '29692daa-edf9-4434-b731-03fe306bfb2c',
    articleId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    tagId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    articleId: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    tagId: '8472822d-2165-4cc3-a3b9-6142ab1dcee9',
    articleId: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    tagId: 'a52fdf09-85f7-4433-8745-582273f8687c',
    articleId: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    tagId: '98573744-d82a-4440-8c4f-115ba44c2a82',
    articleId: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    tagId: '98573744-d82a-4440-8c4f-115ba44c2a82',
    articleId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    tagId: 'e5600cbd-beb2-4309-b039-fdab81e84ef3',
    articleId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    tagId: '0510ebc1-1be5-4ea0-bb47-4a2cb976ddcd',
    articleId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    tagId: 'ffea128c-a1dc-412e-bc4c-73c9260795df',
    articleId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'ed698eee-1625-45ba-9952-0a5f49da534b',
    tagId: '8d6af24a-2597-467e-a915-3dabc2e4a7c1',
    articleId: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  }]),
  down: queryInterface => queryInterface.bulkDelete('ArticleTags', null)
};

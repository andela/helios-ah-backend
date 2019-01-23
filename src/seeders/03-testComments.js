import uuidv4 from 'uuid/v4';

export default {
  up: queryInterface => queryInterface.bulkInsert('Comments', [{
    id: '09808443-8e79-49e5-acca-5a42ff6b425d',
    commentText: 'I love this article. Very cool stuff',
    userId: 'c08a03ae-e9c4-4ce6-83a3-cfc5756c05d9',
    articleId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    commentText: `This is one of the best articles i have read
     in a while. thumbs up bro`,
    userId: '781063b9-92be-4d9a-8699-fdac9227f32c',
    articleId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    commentText: 'I hate this article. Very bad stuff',
    userId: '9ca2980c-20cf-48c0-9c5d-a2398018524c',
    articleId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: 'bab8afd4-e7a2-4f78-93ee-a940111f27fe',
    commentText: 'I hate this article. Very bad stuff',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    articleId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'c3cad896-ac3f-48d4-b61e-0109a7749960',
    commentText: 'This is awesome. coooooooool',
    userId: '1d558292-a1ce-42dc-a76b-c19cd4c734cf',
    articleId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '0a670b82-9235-43e2-a945-03e0ebff5c2d',
    commentText: 'This is awesome. coooooooool',
    userId: uuidv4(),
    articleId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'b8033171-d50c-45bd-922f-4325bd36d652',
    commentText: 'You handled this with utmost professionalism, i love this',
    userId: uuidv4(),
    articleId: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'bf19584f-c993-4c3e-bdf6-997f4ede861c',
    commentText: `This is impressive, but i would have appreciated
     if you elaborate on the 4th point highlight`,
    userId: uuidv4(),
    articleId: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    commentText: 'I hate this article. Very bad stuff',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    articleId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: '781063b9-92be-4d9a-8699-fdac9227f32c',
    commentText: 'I hate this article. Very bad stuff',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    articleId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }], {}),
  down: queryInterface => queryInterface.bulkDelete('Comments', null, {})
};

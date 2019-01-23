
export default {
  up: queryInterface => queryInterface.bulkInsert('ChildComments', [{
    id: '07a48545-1f79-4de4-9ae1-da54138319dd',
    commentText: 'nice comment bro',
    userId: 'c08a03ae-e9c4-4ce6-83a3-cfc5756c05d9',
    commentId: '09808443-8e79-49e5-acca-5a42ff6b425d',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: '62105c62-8b4c-45db-8a97-4bd484e2f37a',
    commentText: 'i love your comment',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    commentId: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: '77529aa4-3f95-4d76-bea6-98ceebb80fa1',
    commentText: 'i do not share this view',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    commentId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: 'c3cad896-ac3f-48d4-b61e-0109a7749960',
    commentText: 'hmmmn.. you are right',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    commentId: 'bab8afd4-e7a2-4f78-93ee-a940111f27fe',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    commentText: 'lolz.. what a comment',
    userId: 'cccd8ee7-bc98-4a8e-a832-ca116d6fff0b',
    commentId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '72811827-1bf8-48d1-bbbb-cd47bc4145cb',
    commentText: 'wink wink wink',
    userId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    commentId: '0a670b82-9235-43e2-a945-03e0ebff5c2d',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '850a7085-e31a-4cba-8fbe-cceea17772c2',
    commentText: 'nice talk, i love this',
    userId: '781063b9-92be-4d9a-8699-fdac9227f32c',
    commentId: 'b8033171-d50c-45bd-922f-4325bd36d652',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '6f4ea42a-7fdf-4218-9524-a69c43d1e55d',
    commentText: 'whatever',
    userId: '9ca2980c-20cf-48c0-9c5d-a2398018524c',
    commentId: '0a670b82-9235-43e2-a945-03e0ebff5c2d',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '09808443-8e79-49e5-acca-5a42ff6b425d',
    commentText: 'I love this article. Very cool stuff',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    commentId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '781063b9-92be-4d9a-8699-fdac9227f32c',
    commentText: 'I hate this article. Very bad stuff',
    userId: 'c08a03ae-e9c4-4ce6-83a3-cfc5756c05d9',
    commentId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: 'bab8afd4-e7a2-4f78-93ee-a940111f27fe',
    commentText: 'I hate this article. Very bad stuff',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    commentId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('ChildComments', null, {})
};

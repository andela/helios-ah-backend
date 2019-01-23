import uuidv4 from 'uuid/v4';

export default {
  up: queryInterface => queryInterface.bulkInsert('Likes', [{
    id: uuidv4(),
    userId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    commentId: '09808443-8e79-49e5-acca-5a42ff6b425d',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: uuidv4(),
    commentId: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: uuidv4(),
    userId: '9ca2980c-20cf-48c0-9c5d-a2398018524c',
    commentId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: uuidv4(),
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    commentId: 'bab8afd4-e7a2-4f78-93ee-a940111f27fe',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'c3cad896-ac3f-48d4-b61e-0109a7749960',
    userId: '1d558292-a1ce-42dc-a76b-c19cd4c734cf',
    commentId: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    userId: uuidv4(),
    commentId: '0a670b82-9235-43e2-a945-03e0ebff5c2d',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    userId: uuidv4(),
    commentId: 'b8033171-d50c-45bd-922f-4325bd36d652',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    userId: uuidv4(),
    commentId: 'bf19584f-c993-4c3e-bdf6-997f4ede861c',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '9ca2980c-20cf-48c0-9c5d-a2398018524c',
    userId: 'c08a03ae-e9c4-4ce6-83a3-cfc5756c05d9',
    commentId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    isLiked: false,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: 'bc83a89d-e2f1-4ef7-90a7-2b68e19772ea',
    userId: 'ef26dbb0-f403-4346-8606-ffa5e2c14c07',
    commentId: '09808443-8e79-49e5-acca-5a42ff6b425d',
    isLiked: false,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: '01bbe571-628b-4166-92d9-697f9daa5b18',
    userId: 'c08a03ae-e9c4-4ce6-83a3-cfc5756c05d9',
    commentId: '781063b9-92be-4d9a-8699-fdac9227f32c',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: 'bab8afd4-e7a2-4f78-93ee-a940111f27fe',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    commentId: '781063b9-92be-4d9a-8699-fdac9227f32c',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Likes', null, {})
};

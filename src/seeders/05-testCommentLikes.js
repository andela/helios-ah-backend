
export default {
  up: queryInterface => queryInterface.bulkInsert('Likes', [{
    id: '9ca2980c-20cf-48c0-9c5d-a2398018524c',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    commentId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    isLiked: true,
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
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
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

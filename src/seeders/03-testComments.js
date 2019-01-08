
export default {
  up: queryInterface => queryInterface.bulkInsert('Comments', [{
    id: '09808443-8e79-49e5-acca-5a42ff6b425d',
    commentText: 'I love this article. Very cool stuff',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    articleId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
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
  },
  {
    id: 'bab8afd4-e7a2-4f78-93ee-a940111f27fe',
    commentText: 'I hate this article. Very bad stuff',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    articleId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Comments', null, {})
};

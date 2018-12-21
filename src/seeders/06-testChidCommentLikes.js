
module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Likes', [{
    id: 'ddcc3a94-9451-4026-b861-b06d7ee0cbf7',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    childCommentId: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: '32aa4b6a-233b-4b18-8e61-d4a0a10d253f',
    userId: 'ef26dbb0-f403-4346-8606-ffa5e2c14c07',
    childCommentId: '09808443-8e79-49e5-acca-5a42ff6b425d',
    isLiked: false,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: '253b8279-a431-4693-a0ca-2079b90dd56b',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    childCommentId: '781063b9-92be-4d9a-8699-fdac9227f32c',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: '50f37d0e-7a57-4e32-b24f-7614c527b36b',
    userId: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    childCommentId: '781063b9-92be-4d9a-8699-fdac9227f32c',
    isLiked: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};

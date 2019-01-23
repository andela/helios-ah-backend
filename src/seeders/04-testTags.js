export default {
  up: queryInterface => queryInterface.bulkInsert('Tags', [{
    id: '0b4b8c06-88b8-423e-b2b3-3166a43831ad',
    tagName: 'Tech',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '29692daa-edf9-4434-b731-03fe306bfb2c',
    tagName: 'Eduction',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '7d99b14c-628b-41f1-80cd-1f2699a759e8',
    tagName: 'Politics',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '8472822d-2165-4cc3-a3b9-6142ab1dcee9',
    tagName: 'lifestyle',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'a52fdf09-85f7-4433-8745-582273f8687c',
    tagName: 'Science',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    tagName: 'Crypto',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '98573744-d82a-4440-8c4f-115ba44c2a82',
    tagName: 'Sport',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'e5600cbd-beb2-4309-b039-fdab81e84ef3',
    tagName: 'Health',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '0510ebc1-1be5-4ea0-bb47-4a2cb976ddcd',
    tagName: 'Food',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'ffea128c-a1dc-412e-bc4c-73c9260795df',
    tagName: 'Career',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '8d6af24a-2597-467e-a915-3dabc2e4a7c1',
    tagName: 'tag01',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }]),
  down: queryInterface => queryInterface.bulkDelete('Tags', null)
};

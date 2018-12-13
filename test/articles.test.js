import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import { helperMethods } from '../src/utilities';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for the article controller', () => {
  let myToken;
  before('Create users before running tests', async () => {
    const userDetails = {
      username: 'JaneDoe',
      password: 'password',
      email: 'janedoe@wemail.com',
      firstName: 'Jane',
      lastName: 'Doe',
      bio: 'Fun to be with. Cool and calm',
    }
    const response = await chai.request(app).post('/api/v1/auth/signup')
      .send(userDetails);
      myToken = response.body.token;
  });
  describe('Tests for creating an article', () => {
    it('should create an article', async () => {
      const articleDetails = {
        title: 'The brow fox',
        body: 'so i saw a dog',
        description: 'narrative',
        image: 'https://someimage.uplodersite.com',
      };
      const response = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', myToken).send(articleDetails);
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('articleCreated');
        expect(response.body.articleCreated).to.have.property('title');
        expect(response.body.articleCreated.title).to.equal(articleDetails.title);
        expect(response.body.articleCreated).to.have.property('body');
        expect(response.body.articleCreated.body).to.equal(articleDetails.body);
        expect(response.body.articleCreated).to.have.property('description');
        expect(response.body.articleCreated.description).to.equal(articleDetails.description);
        expect(response.body.articleCreated).to.have.property('image');
        expect(response.body.articleCreated.image).to.equal(articleDetails.image);
        expect(response.body.articleCreated.isDraft).to.equal(true);
    });
    it('should send an error message when image field is not a URL', async () => {
      const articleDetails = {
        title: 'The brow fox',
        body: 'so i saw a dog',
        description: 'narrative',
        image: 'someimageuplodersitecom',
      };
      const response = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', myToken).send(articleDetails);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Please use an image URL.');
    });
    it('should send an error message when required field is missing', async () => {
      const articleDetails = {
        title: 'The brow fox',
        description: 'narrative',
        image: 'https://someimage.uplodersite.com',
      };
        const response = await chai.request(app).post('/api/v1/articles')
        .set('x-access-token', myToken).send(articleDetails);
        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.deep.equal('Invalid request. All fields are required');
    });
    it('should send an error message when title field is too long', async() => {
      const articleDetails = {
        title: `Thebrowfoxwertyhgfdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
                asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjh`,
        body: 'so i saw a dog',
        description: 'narrative',
        image: 'https://someimage.uplodersite.com',
      };
      const response = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', myToken).send(articleDetails)
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Title should not exceed 80 characters');
    });
    it('should send an error message when description field is too long', async() => {
      const articleDetails = {
        description: `Thebrowfoxwertyhgfdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
        asdfghjnbvcdfghnbvfghjnbfghjnbghjmnbghjkmnbghjkmnghjkm,nhjm,nhjm,nhjm
        sdfghjkjhgfdfghjkjhgfghjkjhgghjkmnghjmnbfghjnbghjmnghjmnhjmnbghjnhjnj
        ertyujuytfbhnjkjhgbnm,kjhgnmkuhjkuhjkliuhmliuhnmkmnbvdfghjkiuyfrtyukn`,
        body: 'so i saw a dog',
        title: 'narrative',
        image: 'https://someimage.uplodersite.com',
      };
      const response = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', myToken).send(articleDetails)
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Description field should not exceed 200 character');
    });
  });
});

describe('Tests for middleware to verify that an '
  + 'article belongs to a particular user', () => {
  let inputDetails = {};
  before('create users and article', async () => {
    const userDetails = {
      username: 'jideajayi',
      password: 'password',
      email: 'jideajayi@gmail.com',
      firstName: 'Jide',
      lastName: 'Ajayi',
      bio: 'Fun to be with. Cool and calm',
      isVerified: true,
    }
    const response = await chai.request(app).post('/api/v1/auth/signup')
      .send(userDetails);
      console.log(response);
  });
});

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import models from '../src/models'
import { helperMethods } from '../src/utilities';

chai.use(chaiHttp);
const { expect } = chai;
const { Article } = models;
let myToken;

describe('Integration tests for the article controller', () => {
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

    it('should get all articles', async () => {
      const response = await chai.request(app).get('/api/v1/articles')
      .set('x-access-token', myToken);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('articles');
        expect(response.body.articles).to.be.an('array');
        expect(response.body.success).to.equal(true);
    });
  });
  describe('Test update article', () => {
    let id;
    const articleDetails = {
      title: 'The brow fox',
      body: 'so i saw a dog',
      description: 'narrative',
      image: 'https://someimage.uplodersite.com',
    };
    before('create article before updating article', async () => {
      const attributes = [ 'userId', 'id']
      const user = await Article.findAll({ attributes });
      id = user[0].dataValues.id;
    })
    it('should update an article with the articles Id', async () => {
      const response = await chai.request(app).put(`/api/v1/articles/${id}`)
      .set('x-access-token', myToken).send(articleDetails);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('articleUpdated');
        expect(response.body.success).to.equal(true);
    });
    it('should reject update on article with wrong article Id', async () => {
      const response = await chai.request(app).put('/api/v1/articles/773be5c1-1aa5-40d4-bee9-6c47ea903741')
      .set('x-access-token', myToken).send(articleDetails);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Provide a valid article Id');
        expect(response.body.success).to.equal(false);
    });
  })
});
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';
import { Authentication } from '../../src/utilities';
import models from '../../src/models'
import faker from 'faker';

chai.use(chaiHttp);
const { expect } = chai;
const { Article } = models;

describe('Integration tests for the article controller', () => {
  let myToken, userId, articleId;
  before('Create token to validate routes', async () => {
    const userDetails = {
      id: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
      username: 'JaneDoe',
      password: 'password',
      email: 'janedoe@wemail.com',
      firstName: 'Jane',
      lastName: 'Doe',
      bio: 'Fun to be with. Cool and calm',
    }
    myToken = await Authentication.getToken(userDetails);
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
      expect(response.body.articleCreated.description)
        .to.equal(articleDetails.description);
      expect(response.body.articleCreated).to.have.property('image');
      expect(response.body.articleCreated.image).to.equal(articleDetails.image);
      expect(response.body.articleCreated.isDraft).to.equal(true);
      articleId = response.body.articleCreated.id;
      userId = response.body.articleCreated.userId;
    });
    it('should send an error message when image field is not a URL',
      async () => {
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
    it('should send an error message when required field is missing',
      async () => {
        const articleDetails = {
          title: 'The brow fox',
          description: 'narrative',
          image: 'https://someimage.uplodersite.com',
        };
        const response = await chai.request(app).post('/api/v1/articles')
          .set('x-access-token', myToken).send(articleDetails);
        expect(response).to.have.status(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message)
          .to.deep.equal('Invalid request. All fields are required');
      });
    it('should send an error message when title field is too long',
      async () => {
        const articleDetails = {
          title: `Thebrowfoxwertyhgfdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbg
                asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjh`,
          body: 'so i saw a dog',
          description: 'narrative',
          image: 'https://someimage.uplodersite.com',
        };
        const response = await chai.request(app).post('/api/v1/articles')
          .set('x-access-token', myToken).send(articleDetails);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message)
          .to.equal('Title should not exceed 80 characters');
      });
    it('should send an error message when description field is too long',
      async () => {
        const articleDetails = {
          description: `Thebrowfoxwertyhgfdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbg
        asdfghjnbvcdfghnbvfghjnbfghjnbghjmnbghjkmnbghjkmnghjkm,nhjm,nhjm,nhjm
        sdfghjkjhgfdfghjkjhgfghjkjhgghjkmnghjmnbfghjnbghjmnghjmnhjmnbghjnhjnj
        ertyujuytfbhnjkjhgbnm,kjhgnmkuhjkuhjkliuhmliuhnmkmnbvdfghjkiuyfrtyukn`,
          body: 'so i saw a dog',
          title: 'narrative',
          image: 'https://someimage.uplodersite.com',
        };
        const response = await chai.request(app).post('/api/v1/articles')
          .set('x-access-token', myToken).send(articleDetails);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message)
          .to.equal('Description field should not exceed 200 character');
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
    const articleDetails = {
      title: 'The brow fox',
      body: 'so i saw a dog',
      description: 'narrative',
      image: 'https://someimage.uplodersite.com',
    };
    it('should update an article with the articles Id', async () => {
      const response = await chai.request(app).put(`/api/v1/articles/${articleId}`)
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
  describe('Test Pagination', () => {
    let articles = [];
    before(async () => {
      for (let index = 0; index < 20; index++) {
        articles.push({
          title: faker.name.firstName(),
          body: faker.lorem.paragraph(),
          description: faker.lorem.sentence(),
          image: faker.image.imageUrl(),
          isDraft: false,
          userId
        });
      }
      const promises = articles.map((obj) => {
        return Article.create(obj);
      });
      try {
        await Promise.all(promises);
      } catch (error) {
        throw error;
      }
    });
    it('should get page 1 of 5 articles', async () => {
      const response = await chai.request(app).get('/api/v1/articles?page=1&limit=5')
      .set('x-access-token', myToken);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('articles');
        expect(response.body.articles.length).to.equal(5);
        expect(response.body.success).to.equal(true);
    });
    it('should get page 1 of 5 articles', async () => {
      const response = await chai.request(app).get('/api/v1/articles?page=2&limit=10')
      .set('x-access-token', myToken);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('articles');
        expect(response.body.articles.length).to.equal(10);
        expect(response.body.success).to.equal(true);
    });
  })
});

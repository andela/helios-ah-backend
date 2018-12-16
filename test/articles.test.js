import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import models from '../src/models'
import faker from 'faker';
import authentication from '../src/utilities/authentication';
import truncate from '../src/utilities/truncate';
import { helperMethods } from '../src/utilities';
import { decode } from 'punycode';

chai.use(chaiHttp);
const { expect } = chai;
const { Article } = models;
let myToken;
let userId;
let decodedUserToken;
let response;

describe('Integration tests for the article controller', () => {
  before('Create users before running tests', async () => {
    const userDetails = {
      username: 'JaneDoe',
      password: 'password',
      email: 'janedoe@wemail.com',
      firstName: 'Jane',
      lastName: 'Doe',
      bio: 'Fun to be with. Cool and calm',
    };
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
    it('should send an error message when title field is too long', async () => {
      const articleDetails = {
        title: `Thebrowfoxwertyhgfdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
                asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjh`,
        body: 'so i saw a dog',
        description: 'narrative',
        image: 'https://someimage.uplodersite.com',
      };
      const response = await chai.request(app).post('/api/v1/articles')
        .set('x-access-token', myToken).send(articleDetails);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Title should not exceed 80 characters');
    });
    it('should send an error message when description field is too long', async () => {
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
        .set('x-access-token', myToken).send(articleDetails);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Description field should not exceed 200 character');
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
      userId = user[0].dataValues.userId;
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
  describe('Test for deleting article', () => {
    let id;
    const articleDetails = {
      title: 'I will delete this article',
      body: 'This is how I will delete this article',
      description: 'I am describing how I will delete this article',
      image: 'https://Iwilldeletethisarticle.com',
    };
    it('should throw an error if there is no token provided', async () => {
      try {
        const res = await chai.request(app)
            .post('/api/v1/articles')
            .send(articleDetails)

        const articleId = res.body.id;
        const res2 = await chai.request(app)
          .delete(`/api/v1/articles/${articleId}`)
        expect(res2.status).to.deep.equal(401);
        expect(res2.body).to.have.property('message');
        expect(res2.body.message).to.equal('User not authorized')
        expect(res2.body).to.have.property('code');
        expect(res2.body.code).to.equal(401)
      } catch (err) {
        throw err;
      }
    });
    it('should throw an error if there is an invalid token provided', async () => {
      decodedUserToken = await authentication.verifyToken(myToken)
      try {
        const res = await chai.request(app)
            .post('/api/v1/articles')
            .send(articleDetails)

        const articleId = res.body.id;
        const invalidToken = `${myToken}21djxdw`

        const res2 = await chai.request(app)
          .delete(`/api/v1/articles/${articleId}`)
          .set('x-access-token', invalidToken)
        expect(res2.status).to.deep.equal(401);
        expect(res2.body).to.have.property('message');
        expect(res2.body.message).to.equal('Authentication failed')
        expect(res2.body).to.have.property('code');
        expect(res2.body.code).to.equal(401)
      } catch (err) {
        throw err;
      }
    });
    it('should throw an Error if the articleId is not of type UUIDV4',
      async () => {
        decodedUserToken = await authentication.verifyToken(myToken)
        try {
          const res2 = await chai.request(app)
            .delete('/api/v1/articles/abc123-123-405')
            .set('x-access-token', myToken);
          expect(res2.status).to.equal(400);
          expect(res2.body).to.have.property('message');
          expect(res2.body.message).to.equal('Invalid Id');
        } catch (err) {
          throw err;
        }
      });
      it('should throw an Error if the article does not exist',
      async () => {
        try {
          const res = await chai.request(app)
            .post('/api/v1/articles')
            .send(articleDetails)
            .set('x-access-token', myToken)

          const articleId = await res.body.articleCreated.id;

          const res2 = await chai.request(app)
            .delete(`/api/v1/articles/${articleId.slice(0, -12)}${'0'
            .repeat(12)}`)
            .set('x-access-token', myToken);

          expect(res2.status).to.equal(404);
          expect(res2.body).to.have.property('message');
          expect(res2.body.message).to.equal('Article does not exist');
        } catch (err) {
          throw err;
        }
      });
      it('should throw an Error if an unauthorised user tries to delete an article',
      async () => {
        const unauthorisedUserDetails = {
          username: 'JohnDoe',
          password: 'password',
          email: 'johndoe@wemail.com',
          firstName: 'Jane',
          lastName: 'Doe',
          bio: 'Mischevious hacker extraordinaire',
        };
        try {
          const res = await chai.request(app)
            .post('/api/v1/auth/signup')
            .send(unauthorisedUserDetails)

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('User JohnDoe created successfully');

            const unauthorisedUserToken = await res.body.token

          const res2 = await chai.request(app)
            .post('/api/v1/articles')
            .send(articleDetails)
            .set('x-access-token', myToken)

            expect(res2.status).to.equal(201);
            expect(res2.body).to.have.property('message');
            expect(res2.body.message).to.equal('Article created successfully');
            expect(res2.body).to.have.property('success');
            expect(res2.body.success).to.equal(true);

          const res3 = await chai.request(app)
            .delete(`/api/v1/articles/${res2.body.articleCreated.id}`)
            .set('x-access-token', unauthorisedUserToken);

          expect(res3.status).to.equal(403);
          expect(res3.body).to.have.property('message');
          expect(res3.body.message).to.equal('You are not authorised to perform this action');
          expect(res3.body).to.have.property('success');
          expect(res3.body.success).to.equal(false);
        } catch (err) {
          throw err;
        }
      });
      it('should delete an article successfully',
      async () => {
        try {
          const response2 = await chai.request(app)
            .post('/api/v1/articles')
            .send(articleDetails)
            .set('x-access-token', myToken)

            expect(response2.status).to.equal(201);
            expect(response2.body).to.have.property('message');
            expect(response2.body.message).to.equal('Article created successfully');
            expect(response2.body).to.have.property('success');
            expect(response2.body.success).to.equal(true);

          const response3 = await chai.request(app)
            .delete(`/api/v1/articles/${response2.body.articleCreated.id}`)
            .set('x-access-token', myToken);

          expect(response3.status).to.equal(200);
          expect(response3.body).to.have.property('message');
          expect(response3.body.message).to.equal('Article deleted successfully');
          expect(response3.body).to.have.property('success');
          expect(response3.body.success).to.equal(true);
        } catch (err) {
          throw err;
        }
      });
  })
  describe('Test Pagination', () => {
    let articles = [];
    before(async () => {
      for (let index = 0; index < 20; index++) {
        articles.push({
          title: faker.name.firstName(),
          body: faker.lorem.paragraph(),
          description: 'This article is a test for pagination',
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

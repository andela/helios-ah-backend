import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';
import models from '../../src/models'
import faker from 'faker';

chai.use(chaiHttp);
const { expect } = chai;
const { Article } = models;
let userId;

describe('Integration tests for the article controller', () => {
  let myToken, userId, articleId, comment, childComment;
  before('Create token to validate routes', async () => {
    const userDetails = {
      email: 'yomizy@wizzy.com',
      password: 'password',
    }
    const response = await chai.request(app).post('/api/v1/auth/login')
    .send(userDetails);
    myToken = response.body.userDetails.token;
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
      articleId = response.body.articleCreated.id;
      userId = response.body.articleCreated.userId;
    });
    it('should add less than 1 minute read time to the article', async () => {
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
        expect(response.body.articleCreated.body).to.equal(articleDetails.body);
        expect(response.body.articleCreated).to.have.property('readTime');
        expect(response.body.articleCreated.readTime).to.equal('less than 1min');
        expect(response.body.articleCreated).to.have.property('image');
        expect(response.body.articleCreated.image).to.equal(articleDetails.image);
        expect(response.body.articleCreated.isDraft).to.equal(true);
    });
    it('should add calculated read time to the article', async () => {
      const articleDetails = {
        title: 'The brow fox',
        body: 'Knowing that millions of people around the world would be watching in person and on television and expecting great things from him — at least one  that millions of people around the world would be watching in person and on television and expecting great things from him — at least one more gold medal for America, if not another world record — during this, his fourth and surely his last appearance in the World Olympics, and realizing that his legs could no longer carry him down the runway with the same blazing speed and confidence in making a huge, eye-popping leap that they were capable of a few years ago when he set world records in the 100-meter dash and in the 400-meter relay and won a silver medal in the long jump, the renowned sprinter and track-and-field personality Carl Lewis, who had known pressure from fans and media before but never, even as a professional runner, this kind of pressure, made only a few appearances in races during the few months before the Summer Olympics in Atlanta, Georgia, partly because he was afraid of raising expectations even higher and he did not want to be distracted by interviews and adoring fans who would follow him into stores and restaurants demanding autographs and photo-opportunities, but mostly because he wanted to conserve his energies and concentrate, like a martial arts expert, on the job at hand: winning his favorite competition, the long jump, and bringing home another Gold Medal for the United States, the most fitting conclusion to his brilliant career in track and field.',
        description: 'narrative',
        image: 'https://someimage.uplodersite.com',
      };
      const readTime = Math.round(articleDetails.body.split(' ').length / 200);
      const response = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', myToken).send(articleDetails);
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('articleCreated');
        expect(response.body.articleCreated).to.have.property('title');
        expect(response.body.articleCreated.title).to.equal(articleDetails.title);
        expect(response.body.articleCreated).to.have.property('body');
        expect(response.body.articleCreated.body).to.equal(articleDetails.body);
        expect(response.body.articleCreated).to.have.property('description');
        expect(response.body.articleCreated.body).to.equal(articleDetails.body);
        expect(response.body.articleCreated).to.have.property('readTime');
        expect(response.body.articleCreated.readTime).to.equal(`about ${readTime}min`);
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
      expect(response.body.message).to.equal('Title field accepts 2 - 80 characters');
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
        readTime: '2mins',
      };
      const response = await chai.request(app).post('/api/v1/articles')
        .set('x-access-token', myToken).send(articleDetails);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Description field accepts 2 - 200 characters');
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
          .to.equal('Title field accepts 2 - 80 characters');
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
          .to.equal('Description field accepts 2 - 200 characters');
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
    before('create article before updating article', async () => {
      const attributes = [ 'userId', 'id']
      const user = await Article.findAll({ attributes });
      userId = user[0].dataValues.userId;
    });
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
  });
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
          readTime: "7",
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
  describe('Test for specific article', ()=> {
    before('Getting specific article', async () => {
      comment = await chai.request(app).post(`/api/v1/articles/${articleId}/comments`).
                set('x-access-token', myToken).send({ commentText: faker.lorem.sentence(5,7) });
      await chai.request(app).put(`/api/v1/articles/comments/${comment.body.commentCreated.id}`).
                set('x-access-token', myToken).send({ commentText: faker.lorem.sentence(5,7) });
      childComment = await chai.request(app).post(`/api/v1/comments/${comment.body.commentCreated.id}/childcomments`).
                set('x-access-token', myToken).send({ commentText: faker.lorem.sentence(5,7) });
      await chai.request(app).put(`/api/v1/articles/comments/childComments/${childComment.body.childCommentCreated.id}`).
                set('x-access-token', myToken).send({ commentText: faker.lorem.sentence(5,7) });
    });
    it('should get a specific article by Id', async () => {
      const response = await chai.request(app).get(`/api/v1/articles/${articleId}`)
      .set('x-access-token', myToken);
      expect(response.status).to.equal(200);
      expect(response.body.success).to.equal(true);
      expect(response.body.article.Comments).to.be.an('array');
      expect(response.body.article.Comments[0]).to.be.an('object');
      expect(response.body.article.Comments[0]).to.have.property('User');
      expect(response.body.article.Comments[0].User).to.be.an('object');
      expect(response.body.article.Comments[0].User).to.have.property('firstName');
      expect(response.body.article.Comments[0]).to.have.property('CommentHistories');
      expect(response.body.article.Comments[0]).to.have.property('ChildComments');
      expect(response.body.article.Comments[0].CommentHistories).to.be.an('array');
      expect(response.body.article.Comments[0].ChildComments).to.be.an('array');
    });
    it('should reject request with invalid article Id', async () => {
      const response = await chai.request(app).get(`/api/v1/articles/${comment.body.commentCreated.id}`)
      .set('x-access-token', myToken);
      expect(response.status).to.equal(404);
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Invalid article Id');
    });
  });
  describe('Test for searching articles based on authors and tags', () => {
    before('Create tags for article', async () => {
      const articleDetails = {
        title: 'The brow fox',
        body: 'so i saw a dog',
        description: 'narrative',
        image: 'https://someimage.uplodersite.com',
      };
      const loginUser = await chai.request(app).post('/api/v1/auth/login')
        .send({
          email: 'yomizy@wizzy.com',
          password: 'password',
        });
      const token = loginUser.body.userDetails.token;
      const createdArticle = await chai.request(app).post('/api/v1/articles')
        .set('x-access-token', token).send(articleDetails);
      const tagDetails = {
        tagName: ['myTag01', 'myTag02'],
        createdArticle: createdArticle.body.articleCreated.id,
        token
      };
      await chai.request(app)
      .post(`/api/v1/articles/tag/${tagDetails.createdArticle}`)
      .set('x-access-token', tagDetails.token).send({
        tagName: tagDetails.tagName,
      });
    });
    it('should return published articles tagged with the tag query parameter', async () => {
      const response = await chai.request(app)
        .get(`/api/v1/articles?tag=myTag01`);
      expect(response.status).to.equal(200);
      expect(response.body.article.length).to.equal(1);
    })
    it('should return not found message when no article is tagged the tag query parameter ', async () => {
      const response = await chai.request(app)
        .get(`/api/v1/articles?tag=invalidTag`);
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('No article tagged invalidTag found.');
    });
    it('should return published articles tagged with the author query parameter', async () => {
      const response = await chai.request(app)
        .get(`/api/v1/articles?author=Jide`);
      expect(response.body.articles).to.be.an('Array', 'invalid type')
      expect(response.status).to.equal(200);
    })
    it('should return not found message when articles with author that have not published are queried', async () => {
      const response = await chai.request(app)
        .get(`/api/v1/articles?author=John`);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('No article published by John')
      expect(response.status).to.equal(200);
    })
  });
});

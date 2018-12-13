import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
const {
  expect
} = chai;

const article = {
  title: 'title',
  body: 'body',
  description: 'description',
  image: 'someimageuplodersite.com',
  isDraft: 'false'
}
const draftArticle = {
  title: 'title1',
  body: 'body1',
  description: 'description1',
  image: 'someimageuplodersite1.com',
  isDraft: 'true'
}

const user = {
  username: 'hushpuppy1',
  password: 'p@ssword123',
  email: 'userEmail@email.com',
  firstName: 'Koledowo',
  lastName: 'smith',
  bio: 'Get closer and find out yourself'
}
let token;
let newArticle;
describe('Integration tests for the Like controller', () => {
  before('Create users before running tests', async () => {
    const response = await chai.request(app).post('/api/v1/auth/signup')
      .send(user);
    token = response.body.token;
    newArticle = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', token).send(draftArticle);
  });

  describe('test for post route', () => {
    it('it should not like if article is draft', async () => {
      const notLiked = await chai.request(app).post(`/api/v1/articles/${newArticle.body.articleCreated.id}/likes`)
        .set('x-access-token', token);
      expect(notLiked.status).to.equal(401);
      expect(notLiked.body.success).to.equal(false);
      expect(notLiked.body.message).to.equal('Article is Draft and has not been published');
    })
  });
  describe('Test when article is not draft', () => {
    it('it should like if article is not draft', async () => {
      const updateDratftStatus = await chai.request(app).put(`/api/v1/articles/${newArticle.body.articleCreated.id}`)
        .set('x-access-token', token).send(article);
      const isLiked = await chai.request(app).post(`/api/v1/articles/${newArticle.body.articleCreated.id}/likes`)
        .set('x-access-token', token);
      expect(isLiked.status).to.equal(201);
      expect(isLiked.body.success).to.equal(true);
      expect(isLiked.body.message).to.equal('Article liked successfully');
      expect(isLiked.body.articleId).to.equal(newArticle.body.articleCreated.id);
    })
  });
  describe('Test when article has already been liked', () => {
    it('it should promt to re-route to put route for like status update', async () => {
      const isLiked = await chai.request(app).post(`/api/v1/articles/${newArticle.body.articleCreated.id}/likes`)
        .set('x-access-token', token);
      expect(isLiked.status).to.equal(400);
      expect(isLiked.body.success).to.equal(false);
      expect(isLiked.body.message).to.equal('Article already liked. Please consume'
      + ' a Put Route to Update like status');
    })
  });
  describe('Test when article is Unliked', () => {
    it('it should change isLiked value to false', async () => {
      const isLiked = await chai.request(app).put(`/api/v1/articles/${newArticle.body.articleCreated.id}/likes`)
        .set('x-access-token', token);
      expect(isLiked.status).to.equal(201);
      expect(isLiked.body.success).to.equal(true);
      expect(isLiked.body.message).to.equal('Article unliked successfully');
      expect(isLiked.body.isliked).to.equal('false');
    })
  });
});

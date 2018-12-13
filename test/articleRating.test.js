import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
const {
  expect
} = chai;

const article = {
  title: 'tehjhj',
  body: 'bjky',
  description: 'deption',
  image: 'someimageuplosite.com',
  isDraft: 'false'
}
const draftArticle = {
  title: 'tiljje',
  body: 'bkjjkdy',
  description: 'desption',
  image: 'someimagrsite.com',
  isDraft: 'true'
}

const rating = {
  rating: 3
}

const user = {
  username: 'hush',
  password: 'p@ssword13',
  email: 'usel@email.com',
  firstName: 'Kolwo',
  lastName: 'smit',
  bio: 'Get find out yourself man'
}
let token;
let newArticle;
describe('Integration tests for the Rating controller', () => {
  it('Create users before running tests', async () => {
    const response = await chai.request(app).post('/api/v1/auth/signup')
      .send(user);
    token = response.body.token;
    newArticle = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', token).send(draftArticle);
  });

  describe('test for post route', () => {
    it('it should not rate if article is draft', async () => {
      const notRated = await chai.request(app).post(`/api/v1/articles/${newArticle.body.articleCreated.id}/ratings`)
        .set('x-access-token', token).send(rating);
      expect(notRated.status).to.equal(401);
      expect(notRated.body.success).to.equal(false);
      expect(notRated.body.message).to.equal('Article is Draft and has not been published');
    })
  });
  describe('Test when article is not draft', () => {
    it('it should rate article if article is not draft', async () => {
      const updateDratftStatus = await chai.request(app).put(`/api/v1/articles/${newArticle.body.articleCreated.id}`)
        .set('x-access-token', token).send(article);
      const isRated = await chai.request(app).post(`/api/v1/articles/${newArticle.body.articleCreated.id}/ratings`)
        .set('x-access-token', token).send(rating);
      expect(isRated.status).to.equal(201);
      expect(isRated.body.success).to.equal(true);
      expect(isRated.body.message).to.equal('Article Rated successfully');
      expect(isRated.body.rating).to.equal(rating.rating);
    })
  });
  describe('Test when article has already been Rated', () => {
    it('it should promt to re-route to put route for Ratings update', async () => {
      const isRated = await chai.request(app).post(`/api/v1/articles/${newArticle.body.articleCreated.id}/ratings`)
        .set('x-access-token', token).send(rating);
      expect(isRated.status).to.equal(400);
      expect(isRated.body.success).to.equal(false);
      expect(isRated.body.message).to.equal('Rating already Exist. Please consume'
      + ' a Put Route for Rating Update');
    })
  });
  describe('Test when article has been initially rated', () => {
    it('it should modify ratings value', async () => {
      const isRated = await chai.request(app).put(`/api/v1/articles/${newArticle.body.articleCreated.id}/ratings`)
        .set('x-access-token', token).send(rating);
      expect(isRated.status).to.equal(201);
      expect(isRated.body.success).to.equal(true);
      expect(isRated.body.message).to.equal('Article Rated successfully');
      expect(isRated.body.rating).to.equal(rating.rating);
    })
  });
});

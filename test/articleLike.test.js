import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
const { expect } = chai;

const article = {
  title: 'title',
  body: 'body',
  description: 'description',
  image: 'someimageuplodersite.com',
  isDraft: 'false'
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
    .set('x-access-token', token).send(article);
  });

  describe('test for post route', () => {
    it('it should not like if article is draft', async() => {
      const isLiked = await chai.request(app).post(`/api/v1/articles/${newArticle.body.articleCreated.id}/likes`)
      .set('x-access-token', token);
      expect(isLiked.status).to.equal(401);
      expect(isLiked.body.success).to.equal(false);
      expect(isLiked.body.message).to.equal('Article is Draft and has not been published');
    })
  });
  // it('', async(){

  // })
});
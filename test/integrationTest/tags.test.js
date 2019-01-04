import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for the tag controller', () => {
  let tagDetails = {};
  before('Create tags details', async () => {
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
    const firstArticle = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', token).send(articleDetails);
    const secondArticle = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', token).send(articleDetails);
    tagDetails = {
      tagName: ['myTag01', 'myTag02'],
      firstArticle: firstArticle.body.articleCreated.id,
      secondArticle: secondArticle.body.articleCreated.id,
      token
    };
  });

  it('should create a new tag with an articleID', async () => {
    const response = await chai.request(app)
      .post(`/api/v1/articles/tag/${tagDetails.firstArticle}`)
      .set('x-access-token', tagDetails.token).send({
        tagName: tagDetails.tagName,
      });
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Tag was created successfully');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(true);
  });

  it('should not tag an article that does not exist', async () => {
    const response = await chai.request(app)
      .post('/api/v1/articles/tag/88dd5021-4b65-4e39-b133-e22d25ca011b')
      .set('x-access-token', tagDetails.token).send({
        tagName: tagDetails.tagName,
      });
    expect(response.status).to.equal(500);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Internal server error');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(false);
  });
});

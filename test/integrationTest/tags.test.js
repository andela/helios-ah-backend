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
        password: 'myPassword',
      });
    const token = loginUser.body.userDetails.token;
    const firstArticle = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', token).send(articleDetails);
    const secondArticle = await chai.request(app).post('/api/v1/articles')
      .set('x-access-token', token).send(articleDetails);
    tagDetails = {
      tagName: 'myTag',
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

  it('should tag an article to an existing tag name', async () => {
    const response = await chai.request(app)
      .post(`/api/v1/articles/tag/${tagDetails.secondArticle}`)
      .set('x-access-token', tagDetails.token).send({
        tagName: tagDetails.tagName,
      });
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Article was tagged');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(true);
  });

  it('should not tag an article that is already tagged', async () => {
    const response = await chai.request(app)
      .post(`/api/v1/articles/tag/${tagDetails.firstArticle}`)
      .set('x-access-token', tagDetails.token).send({
        tagName: tagDetails.tagName,
      });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Tag already exist for the article');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(true);
  });
});
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../src/app';
import { sendEmail } from '../../src/utilities';

chai.use(chaiHttp);
const { expect } = chai;

describe("Integration test for the Share Article Controller", () => {
  let myToken = '', articleId;
  before('login a user to get a valid token and create an article', async () => {
    const userDetails = {
      email: 'yomizy@wizzy.com',
      password: 'password',
    }
    const articleDetails = {
      title: 'The brow fox',
      body: 'so i saw a dog',
      description: 'narrative',
      image: 'https://someimage.uplodersite.com',
    };
    const response = await chai.request(app).post('/api/v1/auth/login')
    .send(userDetails);
    myToken = response.body.userDetails.token;
    const articleCreated = await chai.request(app).post('/api/v1/articles')
    .set('x-access-token', myToken).send(articleDetails)
    articleId = articleCreated.body.articleCreated.id;
  });
  it('should share an article via email', async () => {
    const stubShareArticle = sinon.stub(sendEmail, 'shareArticle').returns(true);
    const shareDetails = {
      articleId,
      email: 'testemail@we,ail.com',
      title: 'Taking your first step',
      author: 'Chris Olajuwon',
    };
    const response = await chai.request(app).post('/api/v1/articles/share')
    .set('x-access-token', myToken).send(shareDetails);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(true);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal(
      'You have successfully shared the article with the owner of the email address.');
    stubShareArticle.restore();
  });
  it('should send an error message when email could not be sent', async () => {
    const stubShareArticle = sinon.stub(sendEmail, 'shareArticle').returns(false);
    const shareDetails = {
      articleId,
      email: 'testemail@we,ail.com',
      title: 'Taking your first step',
      author: 'Chris Olajuwon',
    };
    const response = await chai.request(app).post('/api/v1/articles/share')
    .set('x-access-token', myToken).send(shareDetails);
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(false);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal(
      'Could not share your article. Please try to share the article again.');
    stubShareArticle.restore();
  });
  it('should send an error message when any required field is empty', async () => {
    const shareDetails = {
      articleId,
      email: 'testemail@we,ail.com',
      author: 'Chris Olajuwon',
    };
    const response = await chai.request(app).post('/api/v1/articles/share')
    .set('x-access-token', myToken).send(shareDetails);
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(false);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Invalid request. All fields are required');   
  });
  it('should send an error message when articleId is invalid', async () => {
    const shareDetails = {
      articleId: "some-b65r-d65tr-e",
      email: 'testemail@we,ail.com',
      title: 'Taking your first step',
      author: 'Chris Olajuwon',
    };
    const response = await chai.request(app).post('/api/v1/articles/share')
    .set('x-access-token', myToken).send(shareDetails);
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(false);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Invalid Id');
  });
});

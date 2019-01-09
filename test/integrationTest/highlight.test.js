import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for the highlight controller', () => {
  let details = {};
  before('Create details', async () => {
    const loginUser = await chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'jide@ajayi.com',
        password: 'password',
      });
    details = {
      articleId: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
      highlightId: '1d558292-a1ce-42dc-a76b-c19cd4c734cf',
      highlight: 'my highlight',
      comment: 'my comment on an highlight',
      token: loginUser.body.userDetails.token,
    };
  });

  it('should create an highlight in an article', async () => {
    const response = await chai.request(app)
      .post(`/api/v1/highlights/${details.articleId}`)
      .set('x-access-token', details.token).send({
        commentText: details.highlight,
      });
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Highlight was created successfully');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(true);
  });

  it('should comment on an highlight', async () => {
    const response = await chai.request(app)
      .post(`/api/v1/highlights/comment/${details.highlightId}`)
      .set('x-access-token', details.token).send({
        commentText: details.comment,
      });
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Highlight comment was created successfully');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(true);
  });

  it('should get all highlights of an article', async () => {
    const response = await chai.request(app)
      .get(`/api/v1/highlights/${details.articleId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Highlight found');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(true);
    expect(response.body).to.have.property('highlights');
  });

});

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import truncate from '../src/utilities/truncate';


chai.use(chaiHttp);
const { expect } = chai;

let userToken;

describe('Integration tests for the user controller', () => {
  beforeEach(async () => {
    await truncate();
  });

  const userDetails = {
    username: 'JohnDoe',
    password: 'testPassword',
    email: 'johndoe1@wemail.com',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'RIP John Doe',
  };

  describe('Test response for requesting for password reset', async () => {
    it('should return status code 200 and an object', async () => {
      try {
        const response = await chai.request(app)
          .post('/api/v1/auth/signup')
          .send(userDetails);
        userToken = await response.body.token;

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('token');

        const email = { email: `${response.body.email}` };
        const response2 = await chai.request(app).post('/api/v1/user/requests/password/reset')

          .send(email);
        expect(response2.status).to.deep.equal(200);
        expect(response2.body.message).to.eql(
          'check your mail for instructions on how to reset password'
        );
      } catch (error) {
        throw error;
      }
    });
    it('should return status code 404 and an object', async () => {
      const email = { email: 'emailNotFound@wfemail.com' };
      const response = await chai.request(app).post('/api/v1/user/requests/password/reset')
        .send(email);
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal(
        'user not found'
      );
    });
  });

  it('should return status code 200 and an object', async () => {
    try {
      const response = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(userDetails);
      userToken = await response.body.token;

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('token');

      const email = { email: `${response.body.email}` };
      const response2 = await chai.request(app).post('/api/v1/user/requests/password/reset')
        .send(email);
      expect(response2.status).to.equal(200);
      expect(response2.body.message).to.equal(
        'check your mail for instructions on how to reset password'
      );
    } catch (error) {
      throw error;
    }
  });
  it('should return status code 404 and an object', async () => {
    const email = { email: 'emailNotFound@wfemail.com' };
    const response = await chai.request(app).post('/api/v1/user/requests/password/reset')
      .send(email);
    expect(response.status).to.deep.equal(404);
    expect(response.body.error).to.equal(
      'user not found'
    );
  });
});

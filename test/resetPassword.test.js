import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import truncate from '../src/utilities/truncate';


chai.use(chaiHttp);
const { expect } = chai;

let userToken;

describe('Integration tests for the user controller', () => {
  const userDetails = {
    username: 'JohnDoe',
    password: 'testPassword',
    email: 'johndoe1@wemail.com',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'RIP John Doe',
  };
  beforeEach(async () => {
    await truncate();
  });
  describe('Test response when user tries to reset password', () => {
    it('should return status code 200 with a simple success message', async () => {
      try {
        const response = await chai.request(app)
          .post('/api/v1/auth/signup')
          .send(userDetails);
        userToken = await response.body.token;

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('token');

        const response2 = await chai.request(app).put(`/api/v1/change/password?token=${userToken.split('').reverse().join('')}`).send({
          email: `${userDetails.email}`,
          password: `${userDetails.password}`
        });
        expect(response2.status).to.equal(401);
        expect(response2.body.message)
          .to.equal('Authentication failed');
      } catch (err) {
        throw err;
      }
    });
  });
});

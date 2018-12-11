import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for the user controller', () => {
  describe('Test response for requesting for password reset', () => {
    it('should return status code 200 and an object', async () => {
      const email = { email: 'johndoe@wemail.com' }
      const response = await chai.request(app).post('/api/v1/user/requests/password/reset')
        .send(email);
      expect(response.status).to.deep.equal(200);
      expect(response.body.message).to.eql(
        'check your mail for instructions on how to reset password'
      )
    });
    it('should return status code 404 and an object', async () => {
      const email = { email: 'emailNotFound@wfemail.com' }
      const response = await chai.request(app).post('/api/v1/user/requests/password/reset')
        .send(email);
      expect(response.status).to.deep.equal(404);
      expect(response.body.error).to.eql(
        'user not found'
      )
    });
  })
})

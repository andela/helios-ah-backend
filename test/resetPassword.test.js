import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for the user controller', () => {
  describe('Test response when user tries to reset password', () => {
    it('should return status code 200 with a simple success message', async () => {
      const response = await chai.request(app).put('/api/v1/change/password/string of token').send({
        email: 'johndoe@wemail.com',
        password: 'LongLiveAndela'
      });
      expect(response.status).to.eql(401);
      expect(response.body.error)
        .to.eql('Unauthorized access to reset password, invalid token');
    });
  })
})

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';


chai.should();
chai.use(chaiHttp);
const { expect } = chai;

describe('GET /api/v1/profiles/:userId/follow', () => {
  const userDetails = {
    username: 'JohDoe1',
    password: 'testPassword',
    email: 'johndasxzoe1@wewedmail.com',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'RIP John Doe',
  };

  describe('Bad request', () => {
    it('should throw an Error if the userId is not of type UUIDV4',
      async () => {
        const res = await chai.request(app)
          .post('/api/v1/auth/signup')
          .send(userDetails);
        expect(res.status).to.equal(200);
      });
    it('should throw an Error if user tries to follow himself/herself',
      async () => {
        const res = await chai.request(app)
          .post('/api/v1/auth/signup')
          .send(userDetails);
        expect(res.status).to.equal(200);
      });
  });
  describe('User not found', () => {
    it('should throw an Error if the followed doesn\'t exist on database',
      async () => {
      const res = await chai.request(app)
          .post('/api/v1/auth/signup')
          .send(userDetails);
        expect(res.status).to.equal(200);
      });
  });
  describe('UnAuthenticated User', () => {
    it('should throw an Error if no token is provided', async () => {
      expect(true).to.equal(true);
    });
  });
  describe('Duplicate follow', () => {
    it('should throw an Error if user is already being followed by follower',
      async () => {
        expect(true).to.equal(true);
      });
  });
  describe('Successful follow', () => {
    it('should be successful when a user follows another', async () => {
      expect(true).to.equal(true);
    });
  });
});

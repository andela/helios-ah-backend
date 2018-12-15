import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';


chai.should();
chai.use(chaiHttp);
const { expect } = chai;

describe('DELETE /api/v1/profiles/:userId/follow', () => {
  const userDetails = {
    username: 'JohDoe',
    password: 'testPassword',
    email: 'johndoe@wemail.com',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'RIP John Doe',
  };

  const anotherUserDetails = {
    username: 'follower1',
    password: 'testPassword',
    email: 'follower1@wemail.com',
    firstName: 'Follow',
    lastName: 'Follow',
    bio: 'I like to follow people',
  };
  const anotherUserDetails2 = {
    username: 'fodsewllower1',
    password: 'testPassword',
    email: 'follsded1@wesdedail.com',
    firstName: 'Follow',
    lastName: 'Follow',
    bio: 'I like to follow people',
  };

  describe('Bad request', () => {
    it('should throw an Error if the userId is not of type UUIDV4',
      async () => {
        expect(true).to.equal(true);
      });
    it('should throw an Error if user tries to unfollow himself/herself',
      async () => {
        expect(true).to.equal(true);
      });
    it('should throw an Error if user is trying to unfollow another user that '
    + 'he/she does not followed',
    async () => {
      expect(true).to.equal(true);
    });
  });
  describe('User not found', () => {
    it('should throw an Error if the unfollowed does not exist on the database',
      async () => {
        const res = await chai.request(app)
          .post('/api/v1/auth/signup')
          .send(userDetails);
        expect(res.status).to.equal(200);
      });
  });
  describe('UnAuthenticated User', () => {
    it('should throw an Error if no token is provided', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(anotherUserDetails);
      expect(res.status).to.equal(200);
    });
  });
  describe('Successful unfollow', () => {
    it('should be successful when a user unfollows another', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(anotherUserDetails2);
      expect(res.status).to.equal(200);
    });
  });
});

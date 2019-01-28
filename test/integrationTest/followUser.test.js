import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';
import authentication from '../../src/utilities/authentication';


chai.should();
chai.use(chaiHttp);
const { expect } = chai;
let followerToken;
let followeeToken;
let decodedFolloweeToken;
let decodedFollowerToken;
let followerLoginResponse;
let followeeLoginResponse;
let followUserResponse;

describe('GET /api/v1/profiles/:userId/follow', () => {
  beforeEach(async () => {
    const followerLogin = {
      password: 'password',
      email: 'yomizy@wizzy.com'
    };
    const followeeLogin = {
      password: 'password',
      email: 'janedoereporter@wemail.com'
    };
      followeeLoginResponse = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(followeeLogin);
      followeeToken = followeeLoginResponse.body.userDetails.token;
     

     followerLoginResponse = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(followerLogin);
      followerToken = followerLoginResponse.body.userDetails.token;

      decodedFollowerToken = authentication.verifyToken(followerToken);
      decodedFolloweeToken = authentication.verifyToken(followeeToken);
  });

  describe('Bad request', () => {
    it('should throw an Error if the userId is not of type UUIDV4',
      async () => {
        try {
          followerToken = followeeLoginResponse.body.userDetails.token;
          expect(followerLoginResponse.status).to.equal(200);
          expect(followerLoginResponse.body).to.have.property('success');
          expect(followerLoginResponse.body).to.have.property('message');
          expect(followerLoginResponse.body).to.have.property('userDetails');

          followUserResponse = await chai.request(app)
            .get('/api/v1/profiles/23/follow')
            .set('x-access-token', followerToken);

          expect(followUserResponse.status).to.equal(400);
          expect(followUserResponse.body).to.have.property('message');
          expect(followUserResponse.body.message).to.equal('Invalid Id');
        } catch (err) {
          throw err;
        }
      });
    it('should throw an Error if user tries to follow himself/herself',
      async () => {
        try {
          expect(followerLoginResponse.status).to.equal(200);
          expect(followerLoginResponse.body).to.have.property('success');
          expect(followerLoginResponse.body).to.have.property('message');
          expect(followerLoginResponse.body).to.have.property('userDetails');

          followUserResponse = await chai.request(app)
            .get(`/api/v1/profiles/${decodedFollowerToken.id}/follow`)
            .set('x-access-token', followerToken);
 
          expect(followUserResponse.status).to.equal(400);
          expect(followUserResponse.body).to.have.property('message');
          expect(followUserResponse.body.message)
            .to.equal('You cannot follow or unfollow yourself');
        } catch (err) {
          throw err;
        }
      });
  });
  describe('User not found', () => {
    it('should throw an Error if the followed does not exist on the database',
      async () => {
        try {        
          expect(followerLoginResponse.status).to.equal(200);
          expect(followerLoginResponse.body).to.have.property('success');
          expect(followerLoginResponse.body).to.have.property('message');
          expect(followerLoginResponse.body).to.have.property('userDetails');

          expect(followeeLoginResponse.status).to.equal(200);
          expect(followeeLoginResponse.body).to.have.property('success');
          expect(followeeLoginResponse.body).to.have.property('message');
          expect(followeeLoginResponse.body).to.have.property('userDetails');

          followUserResponse = await chai.request(app)
            .get(`/api/v1/profiles/${decodedFolloweeToken.id.slice(0, -12)}${'0'
              .repeat(12)}/follow`)
            .set('x-access-token', followerToken);
          expect(followUserResponse.status).to.equal(404);
          expect(followUserResponse.body).to.have.property('message');
          expect(followUserResponse.body.message).to.equal('User does not exist');
        } catch (err) {
          throw err;
        }
      });
  });
  describe('UnAuthenticated User', () => {
    it('should throw an Error if no token is provided', async () => {
      try {
        expect(followerLoginResponse.status).to.equal(200);
        expect(followerLoginResponse.body).to.have.property('success');
        expect(followerLoginResponse.body).to.have.property('message');
        expect(followerLoginResponse.body).to.have.property('userDetails');

        expect(followeeLoginResponse.status).to.equal(200);
        expect(followeeLoginResponse.body).to.have.property('success');
        expect(followeeLoginResponse.body).to.have.property('message');
        expect(followeeLoginResponse.body).to.have.property('userDetails');

        followUserResponse = await chai.request(app)
          .get(`/api/v1/profiles/${decodedFolloweeToken.id}/follow`);
        expect(followUserResponse.status).to.equal(401);
        expect(followUserResponse.body).to.have.property('message');
        expect(followUserResponse.body.message).to.equal('User not authorized');
      } catch (err) {
        throw err;
      }
    });
  });
  describe('Duplicate follow', () => {
    it('should throw an Error if user is already being followed by follower',
      async () => {
        const followeeDetails = {
          password: 'password',
          email: 'yomizy@wizzy.com'
        };
        const followerDetails = {
          password: 'password',
          email: 'tonyboy@andela.com'
        };
        try {
          const duplicateTestFolloweeLogin = await chai.request(app)
            .post('/api/v1/auth/login')
            .send(followeeDetails);

          const duplicateTestFolloweeToken = duplicateTestFolloweeLogin.body.userDetails.token;
          const decodedDuplicateTestFolloweeToken = authentication.verifyToken(duplicateTestFolloweeToken);

          expect(duplicateTestFolloweeLogin.status).to.equal(200);
          expect(duplicateTestFolloweeLogin.body).to.have.property('success');
          expect(duplicateTestFolloweeLogin.body).to.have.property('message');
          expect(duplicateTestFolloweeLogin.body).to.have.property('userDetails');

          const duplicateTestFollowerLogin = await chai.request(app)
            .post('/api/v1/auth/login')
            .send(followerDetails);
          const duplicateTestFollowerToken = duplicateTestFollowerLogin.body.userDetails.token;
          expect(duplicateTestFollowerLogin.status).to.equal(200);
          expect(duplicateTestFollowerLogin.body).to.have.property('success');
          expect(duplicateTestFollowerLogin.body).to.have.property('message');
          expect(duplicateTestFollowerLogin.body).to.have.property('userDetails');

          followUserResponse = await chai.request(app)
            .get(`/api/v1/profiles/${decodedDuplicateTestFolloweeToken.id}/follow`)
            .set('x-access-token', duplicateTestFollowerToken);

          expect(followUserResponse.status).to.equal(200);
          expect(followUserResponse.body).to.have.property('message');
          expect(followUserResponse.body.message).to.equal('You are now following this user');

          const duplicateFollowUserResponse = await chai.request(app)
            .get(`/api/v1/profiles/${decodedDuplicateTestFolloweeToken.id}/follow`)
            .set('x-access-token', duplicateTestFollowerToken);
          expect(duplicateFollowUserResponse.status).to.equal(409);
          expect(duplicateFollowUserResponse.body).to.have.property('message');
          expect(duplicateFollowUserResponse.body.message).to.equal('You are already following this user');
        } catch (err) {
          throw err;
        }
      });
  });
  describe('Successful follow', () => {
    it('should be successful when a user follows another', async () => {
      try {
        expect(followerLoginResponse.status).to.equal(200);
        expect(followerLoginResponse.body).to.have.property('success');
        expect(followerLoginResponse.body).to.have.property('message');
        expect(followerLoginResponse.body).to.have.property('userDetails');

        expect(followeeLoginResponse.status).to.equal(200);
        expect(followeeLoginResponse.body).to.have.property('success');
        expect(followeeLoginResponse.body).to.have.property('message');
        expect(followeeLoginResponse.body).to.have.property('userDetails');

        followUserResponse = await chai.request(app)
        .get(`/api/v1/profiles/${decodedFolloweeToken.id}/follow`)
        .set('x-access-token', followerToken);

        expect(followUserResponse.status).to.equal(200);
        expect(followUserResponse.body).to.have.property('message');
        expect(followUserResponse.body.message).to.equal('You are now following this user');
      } catch (err) {
        throw err;
      }
    });
  });
});

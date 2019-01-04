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
let decodedFollowerToken

describe('GET /api/v1/profiles/:userId/follow', () => {
  const followeeDetails = {
    email: 'tonyboy@andela.com',
    password: 'password'
  };

  const followerDetails = {
    email: 'janedoereporter@wemail.com',
    password: 'password'
  };

  describe('Bad request', () => {
    it('should throw an Error if the userId is not of type UUIDV4',
    async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/login')
          .send(followerDetails);

          followerToken = res.body.userDetails.token;
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('userDetails');

        const res2 = await chai.request(app)
          .get('/api/v1/profiles/23/follow')
          .set('x-access-token', followerToken);

        expect(res2.status).to.equal(400);
        expect(res2.body).to.have.property('message');
        expect(res2.body.message).to.equal('Invalid Id');
      } catch (err) {
        throw err;
      }
    });
    it('should throw an Error if user tries to follow himself/herself',
      async () => {
        try {
          const res = await chai.request(app)
            .post('/api/v1/auth/login')
            .send(followerDetails);
          followerToken = await res.body.userDetails.token;
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('success');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('userDetails');

          decodedFollowerToken = authentication.verifyToken(followerToken);
          const res2 = await chai.request(app)
            .get(`/api/v1/profiles/${decodedFollowerToken.id}/follow`)
            .set('x-access-token', followerToken);

          expect(res2.status).to.equal(400);
          expect(res2.body).to.have.property('message');
          expect(res2.body.message)
            .to.equal('You cannot follow yourself');
        } catch (err) {
          throw err;
        }
      });
  });
  describe('User not found', () => {
    it('should throw an Error if the followed does not exist on the database',
      async () => {
        try {
          const res = await chai.request(app)
            .post('/api/v1/auth/login')
            .send(followerDetails);
          followerToken = await res.body.userDetails.token;
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('success');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('userDetails');

          const res2 = await chai.request(app)
            .post('/api/v1/auth/login')
            .send(followeeDetails);
          const followeeToken = await res.body.userDetails.token;
          expect(res2.status).to.equal(200);
          expect(res2.body).to.have.property('success');
          expect(res2.body).to.have.property('message');
          expect(res2.body).to.have.property('userDetails');

          decodedFolloweeToken = authentication.verifyToken(followeeToken);
          const res3 = await chai.request(app)
            .get(`/api/v1/profiles/${decodedFolloweeToken.id.slice(0, -12)}${'0'
              .repeat(12)}/follow`)
            .set('x-access-token', followerToken);
          expect(res3.status).to.equal(404);
          expect(res3.body).to.have.property('message');
          expect(res3.body.message).to.equal('User does not exist');
        } catch (err) {
          throw err;
        }
      });
  });
  describe('UnAuthenticated User', () => {
    it('should throw an Error if no token is provided', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/login')
          .send(followerDetails);
        followerToken = await res.body.userDetails.token;
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('userDetails');

        const res2 = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(followeeDetails);
        const followeeToken = await res.body.userDetails.token;
        expect(res2.status).to.equal(200);
        expect(res2.body).to.have.property('success');
        expect(res2.body).to.have.property('message');
        expect(res2.body).to.have.property('userDetails');

        decodedFolloweeToken = authentication.verifyToken(followeeToken);
        const res3 = await chai.request(app)
          .get(`/api/v1/profiles/${decodedFolloweeToken.id}/follow`);
        expect(res3.status).to.equal(401);
        expect(res3.body).to.have.property('message');
        expect(res3.body.message).to.equal('User not authorized');
      } catch (err) {
        throw err;
      }
    });
  });
  describe('Duplicate follow', () => {
    it('should throw an Error if user is already being followed by follower', 
    async() => {
      const followeeLogin = {
        password: 'password',
        email: 'yomizy@wizzy.com'
      };
      const followerLogin = {
        password: 'password',
        email: 'tonyboy@andela.com'
      }
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/login')
          .send(followeeLogin);

        const followeeToken = await res.body.userDetails.token;
        const decodedFolloweeToken = authentication.verifyToken(followeeToken);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('userDetails');;

        const res2 = await chai.request(app)
          .post('/api/v1/auth/login')
          .send(followerLogin);
        const followerToken = await res2.body.userDetails.token;
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('userDetails');

        const res3 = await chai.request(app)
        .get(`/api/v1/profiles/${decodedFolloweeToken.id}/follow`)
        .set('x-access-token', followerToken);

      expect(res3.status).to.equal(200);
      expect(res3.body).to.have.property('message');
      expect(res3.body.message).to.equal('You are now following this user');

        const res4 = await chai.request(app)
          .get(`/api/v1/profiles/${decodedFolloweeToken.id}/follow`)
          .set('x-access-token', followerToken);
        expect(res4.status).to.equal(409);
        expect(res4.body).to.have.property('message');
        expect(res4.body.message).to.equal('You are already following this user');
      } catch (err) {
        throw err;
      }
    }) 
  });
  describe('Successful follow', () => {
    it('should be successful when a user follows another', async () => {
      const followerLogin = {
        password: 'password',
        email: 'yomizy@wizzy.com'
      };
      const followeeLogin = {
        password: 'password',
        email: 'janedoereporter@wemail.com'
      }
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/login')
          .send(followeeLogin);
        followeeToken = await res.body.userDetails.token;
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('userDetails');

        const res2 = await chai.request(app)
          .post('/api/v1/auth/login')
          .send(followerLogin);
        followerToken = await res2.body.userDetails.token;
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('userDetails');

        decodedFolloweeToken = await authentication.verifyToken(followeeToken);
        const res3 = await chai.request(app)
          .get(`/api/v1/profiles/${decodedFolloweeToken.id}/follow`)
          .set('x-access-token', followerToken);

        expect(res3.status).to.equal(200);
        expect(res3.body).to.have.property('message');
        expect(res3.body.message).to.equal('You are now following this user');
      } catch (err) {
        throw err;
      }
    });
  });
});


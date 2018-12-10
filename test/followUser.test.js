import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import truncate from '../src/utilities/truncate';


chai.should();
chai.use(chaiHttp);
const { expect } = chai;
let followerToken;
let decodedUserToken;
let userToken;

describe('GET /api/v1/profiles/:userId/follow', () => {
  const userDetails = {
    username: 'JohDoe1',
    password: 'testPassword',
    email: 'johndoe1@wemail.com',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'RIP John Doe',
  };

  const followerDetails = {
    username: 'follower',
    password: 'testPassword',
    email: 'follower@wemail.com',
    firstName: 'Follow',
    lastName: 'Follow',
    bio: 'I like to follow people',
  };

  beforeEach(async () => {
    await truncate();
  });

  describe('Bad request', () => {
    it('should throw an Error if the userId is not of type UUIDV4',
      async () => {
        try {
          const res = await chai.request(app)
            .post('/api/v1/auth/signup')
            .send(userDetails);
          userToken = res.body.token;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('token');
          const res2 = await chai.request(app)
            .get('/api/v1/profiles/23/follow')
            .set('x-access-token', userToken);
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
            .post('/api/v1/auth/signup')
            .send(userDetails);
          userToken = await res.body.token;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('token');

          decodedUserToken = jwt.decode(userToken.split('').reverse().join(''));
          const res2 = await chai.request(app)
            .get(`/api/v1/profiles/${decodedUserToken.id}/follow`)
            .set('x-access-token', userToken);
          expect(res2.status).to.equal(400);
          expect(res2.body).to.have.property('message');
          expect(res2.body.message).to.equal('You cannot follow yourself');
        } catch (err) {
          throw err;
        }
      });
  });
  describe('User not found', () => {
    it('should throw an Error if the followed doesn\'t exist on database',
      async () => {
        try {
          const res = await chai.request(app)
            .post('/api/v1/auth/signup')
            .send(userDetails);
          userToken = await res.body.token;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('token');

          decodedUserToken = jwt.decode(userToken.split('').reverse().join(''));
          const res2 = await chai.request(app)
            .get(
              `/api/v1/profiles/${decodedUserToken.id.slice(0, -12)}${'0'
                .repeat(12)}/follow`
            )
            .set('x-access-token', userToken);
          expect(res2.status).to.equal(404);
          expect(res2.body).to.have.property('message');
          expect(res2.body.message).to.equal('User does not exist');
        } catch (err) {
          throw err;
        }
      });
  });
  describe('UnAuthenticated User', () => {
    it('should throw an Error if no token is provided', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/signup')
          .send(userDetails);
        userToken = await res.body.token;
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('token');

        decodedUserToken = jwt.decode(userToken.split('').reverse().join(''));
        const res2 = await chai.request(app)
          .get(`/api/v1/profiles/${decodedUserToken.id}/follow`);
        expect(res2.status).to.equal(401);
        expect(res2.body).to.have.property('message');
        expect(res2.body.message).to.equal('User not authorized');
      } catch (err) {
        throw err;
      }
    });
  });
  describe('Duplicate follow', () => {
    it('should throw an Error if user is already being followed by follower',
      async () => {
        try {
          const res = await chai.request(app)
            .post('/api/v1/auth/signup')
            .send(userDetails);
          userToken = await res.body.token;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('token');

          const res2 = await chai.request(app)
            .post('/api/v1/auth/signup')
            .send(followerDetails);
          followerToken = await res2.body.token;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('token');

          decodedUserToken = jwt.decode(userToken.split('').reverse().join(''));
          const res3 = await chai.request(app)
            .get(`/api/v1/profiles/${decodedUserToken.id}/follow`)
            .set('x-access-token', followerToken);

          expect(res3.status).to.equal(200);
          expect(res3.body).to.have.property('message');
          expect(res3.body.message).to.equal('You are now following this user');

          const res4 = await chai.request(app)
            .get(`/api/v1/profiles/${decodedUserToken.id}/follow`)
            .set('x-access-token', followerToken);
          expect(res4.status).to.equal(409);
          expect(res4.body).to.have.property('message');
          expect(res4.body.message)
            .to.equal('You are already following this user');
        } catch (err) {
          throw err;
        }
      });
  });
  describe('Successful follow', () => {
    it('should be successful when a user follows another', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/signup')
          .send(userDetails);
        userToken = await res.body.token;
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('token');

        const res2 = await chai.request(app)
          .post('/api/v1/auth/signup')
          .send(followerDetails);
        followerToken = await res2.body.token;
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('token');

        decodedUserToken = jwt.decode(userToken.split('').reverse().join(''));
        const res3 = await chai.request(app)
          .get(`/api/v1/profiles/${decodedUserToken.id}/follow`)
          .set('x-access-token', followerToken);

        expect(res3.status).to.equal(200);
        expect(res3.body).to.have.property('message');
        expect(res3.body.message).to.equal('You are now following this user');

        expect(res3.status).to.equal(200);
        expect(res3.body).to.have.property('message');
        expect(res3.body.message).to.equal('You are now following this user');
      } catch (err) {
        throw err;
      }
    });
  });
});

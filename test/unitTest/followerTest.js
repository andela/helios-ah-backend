import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../src/app';
import truncate from '../../src/utilities/truncate';
import followersUtil from '../../src/utilities/followers';


chai.should();
chai.use(chaiHttp);
const { expect } = chai;
let followerToken;
let decodedUserToken;
let decodedFollowerToken;
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
  describe('follower utils querying methods', () => {
    describe('query for existing following', () => {
      it('should show the details of an existing following', async () => {
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
          decodedFollowerToken = jwt.decode(followerToken.split('').reverse().join(''));

          const res3 = await chai.request(app)
            .get(`/api/v1/profiles/${decodedUserToken.id}/follow`)
            .set('x-access-token', followerToken);

          expect(res3.status).to.equal(200);
          expect(res3.body).to.have.property('message');
          expect(res3.body.message).to.equal('You are now following this user');

          const res4 = await followersUtil.queryForExistingFollowing(true, decodedUserToken.id, decodedFollowerToken.id);

          expect(res4).to.have.property('dataValues');
          expect(res4.dataValues).to.have.property('isActive');
          expect(res4.dataValues.isActive).to.equal(true);

          expect(res4.dataValues).to.have.property('followerId');
          expect(res4.dataValues.followerId).to.equal(`${decodedFollowerToken.id}`);

          expect(res4.dataValues).to.have.property('userId');
          expect(res4.dataValues.userId).to.equal(`${decodedUserToken.id}`);
        } catch (err) {
          throw err;
        }
      });
    });
  });
  describe('query for updating previous following', () => {
    it('should update the details of a previous following', async () => {
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
        decodedFollowerToken = jwt.decode(followerToken.split('').reverse().join(''));

        const res3 = await chai.request(app)
          .get(`/api/v1/profiles/${decodedUserToken.id}/follow`)
          .set('x-access-token', followerToken);

        expect(res3.status).to.equal(200);
        expect(res3.body).to.have.property('message');
        expect(res3.body.message).to.equal('You are now following this user');

        const res4 = await followersUtil.queryForUpdatingPreviousFollowing(false, decodedUserToken.id, decodedFollowerToken.id);
        expect(res4[1][0]).to.have.property('dataValues');
        expect(res4[1][0].dataValues).to.have.property('isActive');
        expect(res4[1][0].dataValues.isActive).to.equal(false);

        expect(res4[1][0].dataValues).to.have.property('followerId');
        expect(res4[1][0].dataValues.followerId).to.equal(`${decodedFollowerToken.id}`);

        expect(res4[1][0].dataValues).to.have.property('userId');
        expect(res4[1][0].dataValues.userId).to.equal(`${decodedUserToken.id}`);
      } catch (err) {
        throw err;
      }
    });
  });
});

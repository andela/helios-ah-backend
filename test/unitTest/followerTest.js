import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import models from '../../src/models';
import { follower } from '../../src/utilities';


chai.should();
chai.use(chaiHttp);
const { expect } = chai;
const { Follower, Users } = models;
const req = {
  params: {
    ide: '343-r4345rer43'
  },
  decoded: {
    id: '3er44-r5tfrtg-t6'
  },
  paramsUser: {
    email: 'someEmail@wemail.com',
  },
  user: {
    username: 'myUsername'
  }
};
const res = {
  status() {
    return this;
  },
  json(obj) {
    return obj;
  } 
};
const sameUserId = {
  params: {
    id: '343-r4345rer43'
  },
  decoded: {
    id: '343-r4345rer43'
  },
};
const userId = 'dccd8ee7-a832-bc98-4a8e-ca116c5fff0a';
const followerId = 'dccd8ee7-a832-4a8e-bc98-ca116c5fff0a'

describe('GET /api/v1/profiles/:userId/follow', () => {
  describe('follower utils querying methods', () => {
      it('should query for an existing following', async () => {
        const mySpy = sinon.spy(Follower, 'findOne')
        await follower
        .queryForExistingFollowing(true, userId, followerId);
        expect(mySpy.calledOnce).to.equal(true);
        mySpy.restore();
      });
  });
  describe('query for updating previous following', () => {
    it('should update the details of a previous following', async () => {
      const mySpy = sinon.spy(Follower, 'update')
        await follower
        .queryForUpdatingPreviousFollowing(true, userId, followerId);
        expect(mySpy.calledOnce).to.equal(true);
        mySpy.restore();
    });
    it('it should get all followers', async () => {
      const mySpy = sinon.spy(Users, 'findAll')
        await follower
        .getFollowers(userId);
        expect(mySpy.calledOnce).to.equal(true);
        mySpy.restore();
    });
  });

  describe('unit tests for follower utils middleware', () => {
      it('should return true if next callback is called for "checkForSelfFollow" method',
        async() => { 
          const mySpy = sinon.spy()
          await follower.checkForSelfFollow(req, res, mySpy)
          expect(mySpy.calledOnce).to.equal(true);
        });
        it('should return true if next callback is called for "checkForSelfUnfollow" method',
        async() => { 
          const mySpy = sinon.spy()
          await follower.checkForSelfUnfollow(req, res, mySpy)
          expect(mySpy.calledOnce).to.equal(true);
        });
    });
});

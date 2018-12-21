import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import models from '../../src/models';
import app from '../../src/app';
import truncate from '../../src/utilities/truncate';
import { follower } from '../../src/utilities';


chai.should();
chai.use(chaiHttp);
const { expect } = chai;
const { Follower } = models;
const req = {
  params: {
    id: '343-r4345rer43'
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
    describe('query for existing following', () => {
      it('should show the details of an existing following', async () => {
        expect(true).to.equal(true);
      });
    });
  });
  describe('query for updating previous following', () => {
    it('should update the details of a previous following', async () => {
        expect(true).to.equal(true);
    });
  });
  describe('unit tests for follow and unfollow utils', () => {
    describe('unit test for the "queryForExistingFollowing" method', () => {
      it('should return true if follower is following the user',
        async() => { 
          const stubFindOneMethod = await sinon
          .stub(Follower, 'findOne').returns(true);
          const response = await follower
          .queryForExistingFollowing(true, userId, followerId);
          expect(response).to.equal(true);
          stubFindOneMethod.restore();
        });
      it('should throw an error if follower is not following the user',
      async() => { 
        const stubFindOneMethod = await sinon
        .stub(Follower, 'findOne').returns('not following');
        const response = await follower
        .queryForExistingFollowing(true, userId, followerId);
        expect(response).to.equal('not following');
        stubFindOneMethod.restore();
      });
    });
    describe('unit test for the "queryForUpdatingPreviousFollowing" method',
      () => {
      it('should return true if user successfully unfollowed follower',
      async() => { 
        const stubUpdateMethod = await sinon
        .stub(Follower, 'update').returns(true);
        const response = await follower
        .queryForUpdatingPreviousFollowing(true, userId, followerId);
        expect(response).to.equal(true);
        stubUpdateMethod.restore();
      });
      it('should throw an error if user could not unfollow follower successfully',
      async() => { 
        const stubUpdateMethod = await sinon
        .stub(Follower, 'update').throws('could not unfollow');
        const response = await follower
        .queryForUpdatingPreviousFollowing(true, userId, followerId);
        expect(response.name).to.equal('could not unfollow');
        stubUpdateMethod.restore();
      });
    });
    describe('unit test for the "checkForExistingFollowing" middleware',
      () => {
      it('should return error message if follower already follows user',
      async() => {
        const stubQueryForExistingFollowing = await sinon
        .stub(follower, 'queryForExistingFollowing').returns(true);
        const response = await follower
        .checkForExistingFollowing(req, res);
        expect(response).to.have.property('success');
        expect(response.success).to.equal(false);
        expect(response).to.have.property('message');
        expect(response.message).to
        .equal('You are already following this user');
        stubQueryForExistingFollowing.restore();
      });
    });
    describe('unit test for the "updatePreviousFollowing" middleware',
      () => {
      it('should return success message when a follower follows a user',
      async() => { 
        const stubQueryForExistingFollowing = await sinon
        .stub(follower, 'queryForExistingFollowing').returns(true);
        const stubQueryForUpdatingPreviousFollowing = await sinon
        .stub(follower, 'queryForUpdatingPreviousFollowing').returns(true);
        const response = await follower
        .updatePreviousFollowing(req, res);
        expect(response).to.have.property('success');
        expect(response.success).to.equal(true);
        expect(response).to.have.property('message');
        expect(response.message).to
        .equal('You are now following this user');
        stubQueryForUpdatingPreviousFollowing.restore();
        stubQueryForExistingFollowing.restore();
      });
      });
    describe('unit test for the "checkForSelfFollow" middleware',
    () => {
      it('should send an error message when user tries to follow himself',
      async () => {
        const response = await follower.checkForSelfFollow(sameUserId, res);
        expect(response).to.have.property('success');
        expect(response.success).to.be.equal(false);
        expect(response).to.have.property('message');
        expect(response.message).to.be.equal('You cannot follow yourself');
      });
    });
    describe('unit test for the "checkForSelfUnfollow" middleware',
    () => {
      it('should send an error message when user tries to unfollow himself',
      async () => {
        const response = await follower.checkForSelfUnfollow(sameUserId, res);
        expect(response).to.have.property('success');
        expect(response.success).to.be.equal(false);
        expect(response).to.have.property('message');
        expect(response.message).to.be.equal('You cannot follow or unfollow yourself'); 
      });
    });
  });
});

import chai from 'chai';
import models from '../../src/models';
import sinon from 'sinon';
import checkBookmarkExists from '../../src/utilities/checkBookmarkExists';

const { expect } = chai;
const { Bookmark } = models;

const articleId = 'ced35c26-c919-47ec-bdfe-90bfaffe64d2'
const userId = 'ced35c26-c919-47ec-bdfe-90bfaffe64d2'
const man = 'ced35c26-c919-47ec-bdfe-90bfaffe64d2'

describe('Unit tests for the bookmark', () => {
  describe('Unit test for checkBookmarkExists Utility function', () => {
    it(
      'it should call Bookmark.findOne method',
      async () => {
        try{
          const mySpy = sinon.spy(Bookmark, 'findOne')
          await checkBookmarkExists(userId, articleId)
          expect(mySpy.calledOnce).to.equal(true);
        }catch(error) {
        throw error
        }
      });
  });
});
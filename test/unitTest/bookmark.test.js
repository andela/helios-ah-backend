import chai from 'chai';
import sinon from 'sinon';
import models from '../../src/models';
import checkBookmarkExists from '../../src/utilities/checkBookmarkExists';
import ArticlesController from '../../src/controller/articlesController';


const { expect } = chai;
const { Bookmark } = models;

const articleId = 'ced35c26-c919-47ec-bdfe-90bfaffe64d2';
const userId = 'ced35c26-c919-47ec-bdfe-90bfaffe64d2';

describe('Unit tests for the bookmark', () => {
  afterEach(() => sinon.restore());
  describe('Unit test for checkBookmarkExists Utility function', () => {
    it(
      'it should call Bookmark.findOne method',
      async () => {
        try {
          const mySpy = sinon.spy(Bookmark, 'findOne');
          await checkBookmarkExists(userId, articleId);
          expect(mySpy.calledOnce).to.equal(true);
        } catch (error) {
          throw error;
        }
      }
    );
  });
  it('should throw error when finding all bookmark', async () => {
    const req = {
      decoded: { id: ''},
    };
    const res = {
      body: { message: 'Internal server error', success: false },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(Bookmark, 'findAll').throws();
    await ArticlesController.getBookmark(req, res);
    expect(res.status).to.have.been.calledWith(500);
    expect(res.body.message).to.equal('Internal server error');
    expect(res.body.success).to.equal(false);
  });
  it('should not get bookmarks', async () => {
    const req = {
      decoded: { id: ''},
    };
    const res = {
      body: { message: 'Bookmark was not found', success: false },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(Bookmark, 'findAll').returnsThis();
    await ArticlesController.getBookmark(req, res);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.body.message).to.equal('Bookmark was not found');
    expect(res.body.success).to.equal(false);
  });
  it('should throw error when deleting a bookmark', async () => {
    const req = {
      params: { articleId: ''},
      decoded: { id: ''},
    };
    const res = {
      body: { message: 'Internal server error', success: false },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(Bookmark, 'update').throws();
    await ArticlesController.deleteBookmark(req, res);
    expect(res.status).to.have.been.calledWith(500);
    expect(res.body.message).to.equal('Internal server error');
    expect(res.body.success).to.equal(false);
  });
  it('should not delete bookmark of other user', async () => {
    const req = {
      params: { bookmarkId: ''},
      decoded: { id: ''},
    };
    const res = {
      body: { message: 'Bookmark was not found', success: false },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(Bookmark, 'update').returnsThis();
    await ArticlesController.deleteBookmark(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.body.message).to.equal('Bookmark was not found');
    expect(res.body.success).to.equal(false);
  });
});

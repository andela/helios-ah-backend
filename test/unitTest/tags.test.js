import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import TagController from '../../src/controller/tagsController';
import models from '../../src/models';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;
chai.use(sinonChai);

const { Tags, ArticleTag } = models;

describe('Unit tests for the tag controller', () => {
  let tagDetails = {};
  before('Create tags details', async () => {
    tagDetails = {
      tagName: 'myTag',
      firstArticle: '7d99b14c-8ea1-41f1-80cd-1f2699a759e8',
      secondArticle: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
      tagId: '8d6af24a-2597-467e-a915-3dabc2e4a7c1',
    };
  });
  afterEach(() => sinon.restore());

  it('should create a new tag with an articleID', async () => {
    const req = {
      params: { articleId: tagDetails.firstArticle},
      body: { tagName: tagDetails.tagName}
    };
    const res = {
      body: { message: 'Tag was created successfully', success: true },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(Tags, 'findOne').returnsThis();
    sinon.stub(Tags, 'create').returnsThis();
    sinon.stub(ArticleTag, 'create').returnsThis();
    await TagController.createTag(req, res);

    expect(res.status).to.have.been.calledWith(201);
    expect(res.body.message).to.equal('Tag was created successfully');
    expect(res.body.success).to.equal(true);
  });

  it('should tag an article to an existing tag name', async () => {
    const articleId = tagDetails.secondArticle;
    const tagId = tagDetails.tagId;
    const res = {
      body: { message: 'Article was tagged', success: true },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(ArticleTag, 'create').returnsThis();
    await TagController.addArticleTag(articleId, tagId, res);
    expect(res.status).to.have.been.calledWith(201);
    expect(res.body.message).to.equal('Article was tagged');
    expect(res.body.success).to.equal(true);
  });

  it('should not tag an article that is already tagged', async () => {
    const articleId = tagDetails.firstArticle;
    const tagId = tagDetails.tagId;
    const res = {
      body: { message: 'Tag already exist for the article', success: true },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(ArticleTag, 'findOne').returnsThis();
    await TagController.findArticleTag(articleId, tagId, res);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.body.message).to.equal('Tag already exist for the article');
    expect(res.body.success).to.equal(true);
  });

  it('should not tag an article that does not exist', async () => {
    const req = {
      params: { articleId: ''},
      body: { tagName: tagDetails.tagName}
    };
    const res = {
      body: { message: 'Internal server error', success: false },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(Tags, 'findOne').throws();
    await TagController.createTag(req, res);
    expect(res.status).to.have.been.calledWith(500);
    expect(res.body.message).to.equal('Internal server error');
    expect(res.body.success).to.equal(false);
  });
});

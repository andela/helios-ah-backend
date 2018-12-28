import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import HighlightController from '../../src/controller/highlightController';
import models from '../../src/models';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;
chai.use(sinonChai);

const { Highlights, HighlightComments } = models;

describe('Unit tests for the highlight controller', () => {
  let details = {};
  before('Create details', async () => {
    details = {
      highlight: 'my highlight',
      comment: 'my comment on an highlight',
      firstHighlight: '1d558292-a1ce-42dc-a76b-c19cd4c734cf',
      secondHighlight: 'bdae38e6-1e73-4b5e-b98c-c02b74336974',
      userId: '315cdb56-fad1-4712-81c8-d82ccdbc8b5a',
      articleId: '4d3ad3ef-5565-499d-bb39-96dcafc5729f',
    };
  });
  afterEach(() => sinon.restore());

  it('should add new comment on an highlight', async () => {
    const req = {
      params: { highlightId: details.firstHighlight },
      body: { commentText: details.comment },
      decoded: { id: details.userId },
    };
    const res = {
      body: { message: 'Highlight comment was created successfully', success: true },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(HighlightComments, 'create').returnsThis();
    await HighlightController.createHighlightComment(req, res);

    expect(res.status).to.have.been.calledWith(201);
    expect(res.body.message).to.equal('Highlight comment was created successfully');
    expect(res.body.success).to.equal(true);
  });

  it('should return error on adding new comment on an highlight', async () => {
    const req = {
      params: { highlightId: details.secondHighlight },
      body: { commentText: details.comment },
      decoded: { id: details.userId },
    };
    const res = {
      body: { message: 'Internal server error', success: false },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(HighlightComments, 'create').throws();
    await HighlightController.createHighlightComment(req, res);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.body.message).to.equal('Internal server error');
    expect(res.body.success).to.equal(false);
  });

  it('should comment on an highlight', async () => {
    const options = {
      comment: details.comment,
      highlightId: details.firstHighlight,
      userId: details.userId,
      transaction: {},
    };
    const res = {
      body: {
        message: 'Highlight comment was created successfully',
        success: true,
      },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(HighlightComments, 'create').returnsThis();
    await HighlightController.newHighlightComment(options, res);
    expect(res.status).to.have.been.calledWith(201);
    expect(res.body.message).to.equal('Highlight comment was created successfully');
    expect(res.body.success).to.equal(true);
  });

  it('should create an highlight with comment', async () => {
    const req = {
      params: { articleId: details.articleId },
      body: { comment: details.comment, commentText: details.highlight },
      decoded: { id: details.userId },
    };
    const res = {
      body: {
        message: 'Highlight comment was created successfully',
        success: true,
      },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(Highlights, 'create').returnsThis();
    sinon.stub(HighlightComments, 'create').returnsThis();
    await HighlightController.createHighlight(req, res);
    expect(res.status).to.have.been.calledWith(201);
    expect(res.body.message).to.equal('Highlight comment was created successfully');
    expect(res.body.success).to.equal(true);
  });

  it('should create an highlight without comment', async () => {
    const req = {
      params: { articleId: details.articleId },
      body: { commentText: details.highlight },
      decoded: { id: details.userId },
    };
    const res = {
      body: {
        message: 'Highlight was created successfully',
        success: true,
      },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(Highlights, 'create').returnsThis();
    await HighlightController.createHighlight(req, res);
    expect(res.status).to.have.been.calledWith(201);
    expect(res.body.message).to.equal('Highlight was created successfully');
    expect(res.body.success).to.equal(true);
  });

  it('should return error on creating an highlight', async () => {
    const req = {
      params: { articleId: details.articleId },
      body: { comment: details.comment, commentText: details.highlight },
      decoded: { id: details.userId },
    };
    const res = {
      body: {
        message: 'Internal server error',
        success: false,
      },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(Highlights, 'create').throws();
    await HighlightController.createHighlight(req, res);
    expect(res.status).to.have.been.calledWith(500);
    expect(res.body.message).to.equal('Internal server error');
    expect(res.body.success).to.equal(false);
  });

  it('should not find highlight of an article', async () => {
    const req = {
      params: { articleId: details.articleId },
    };
    const res = {
      body: {
        message: 'Highlight was not found',
        success: false,
      },
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(Highlights, 'findAll').returnsThis();
    await HighlightController.getHighlights(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.body.message).to.equal('Highlight was not found');
    expect(res.body.success).to.equal(false);
  });

});

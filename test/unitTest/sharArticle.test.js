import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { sendEmail } from '../../src/utilities';
import { ShareArticleController } from '../../src/controller';

chai.use(chaiHttp);
const { expect } = chai;

describe("Unit test for the Share Article via email method", () => {
  const req = {
    body: {
        articleId: '34t-56t5-6yt-56r7-65rt',
        email: 'testemail@we,ail.com',
        title: 'Taking your first step',
        author: 'Chris Olajuwon',
      },
  };
  const res = {
    status(){
      return this;
    },
    json(obj){
      return obj;
    }
  }
  it('should send a response on successfully sharing an article', async () => {
    const stubShareArticle = sinon.stub(sendEmail, 'shareArticle').returns(true);
    const response = await ShareArticleController.ShareArticleViaEmail(req, res);
    expect(response).to.have.property('success');
    expect(response.success).to.equal(true);
    expect(response).to.have.property('message');
    expect(response.message).to.equal(
      'You have successfully shared the article with the owner of the email address.');
    sinon.assert.calledOnce(stubShareArticle);
    stubShareArticle.restore();
  });
});

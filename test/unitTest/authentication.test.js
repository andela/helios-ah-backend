import chai from 'chai';
import chaiHttp from 'chai-http';
import { Authentication } from '../../src/utilities';
import models from '../../src/models';
import app from '../../src/app';
import Access from '../../src/utilities/helperMethods';

chai.use(chaiHttp);
const { expect } = chai;
const { Comments } = models;

let data = {
  id: 'ec0d84a1-4195-4a98-b46c-5976e1839a06',
  role: 1,
  username: 'john134'
}

describe('valid token should be generated', () => {
  it('it should return a Scrambled token', async () => {
    const token = await Authentication.getToken(data);
    expect(token).to.be.a('String');
  });
});

describe('scrambled token should be unscrambled and Validated', () => {
  it('it should unscramble token and validate', async () => {
    const token = await Authentication.getToken(data);
    const user = await Authentication.verifyToken(token);
    expect(user.id).to.be.equal('ec0d84a1-4195-4a98-b46c-5976e1839a06');
    expect(user.role).to.be.equal(1);
    expect(user.username).to.be.equal('john134');
    expect(user).to.be.a('object');
  });
});

describe('Access test', () => {
  let data, myToken, comment;

    before('Create a user before running tests', async () => {
      const userDetails = {
        email: 'yomizy@wizzy.com',
        password: 'myPassword',
      };
      const commentDetails = {
        commentText: 'I like this article very much.'
      };
      const response = await chai.request(app).post('/api/v1/auth/login')
          .send(userDetails);
      myToken = response.body.userDetails.token;
      const articleDetails = {
        title: 'Dont trian a dragon',
        body: 'do you want toß die?',
        description: 'training a dragon is risjy',
        image: 'https://someimage.uplodersite.com',
      };
      data = await chai.request(app).post('/api/v1/articles')
        .set('x-access-token', myToken).send(articleDetails);
      comment = await chai.request(app).post(`/api/v1/articles/${data.body.articleCreated.id}/comments`)
        .set('x-access-token', myToken).send(commentDetails);
    });

  it('it should give access to authorized user', async () => {
    const myAccess = await Access.checkAcces('COMMENT', comment.body.commentCreated.id, data.body.articleCreated.userId);
    expect(myAccess).to.equal(1);
  });

  it('it should deny access to unathorized user', async () => {
    const myAccess = await Access.checkAcces('COMMENT', comment.body.commentCreated.id, 'e7eaef9b-c3d9-40fa-89e1-26eae190f1aa');
    expect(myAccess).to.equal(0);
  });
});

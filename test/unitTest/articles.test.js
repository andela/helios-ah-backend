import chai from 'chai';
import sinon from 'sinon';
import models from '../../src/models';
import checkArticleExists from '../../src/utilities/checkArticleExists';

const { expect } = chai;
const { Article } = models;

const invalidURLasValue = {
  title: 'The brow fox',
  body: 'so i saw a dog',
  description: 'narrative',
  image: 'someimageuplodersite',
  userId: 'aa4aaa2c-c6ca-d5f5-b8b2-0b5c78ee2cb7',
  readTime: '2 mins'
};
const invalidCharacterInTitle = {
  title: 'The* brow fox',
  body: 'so i saw a dog',
  description: 'narrative',
  image: 'https://someimage.uploder.site.com',
  userId: 'aa4aaa2c-c6ca-d5f5-b8b2-0b5c78ee2cb7',
  readTime: '2 mins',
};
const tooLongTitle = {
  title: `Thebrowdfghtgvfghgmjnbvbgmvbnmbbvxghgnbnvbbnvbcnbbngmnbnbvbgnbvnncno
  ertyhhgfghgfghjhgfghjhgfghvbnbvbnmjhgfcvbnmjhytfcvbnmjhgfvbnjhytfg`,
  body: 'so i saw a dog',
  description: 'narrative',
  image: 'https://someimage.uploder.site.com',
  userId: 'aa4aaa2c-c6ca-d5f5-b8b2-0b5c78ee2cb7',
  readTime: '2 mins',
};

let res;
res = {
  status() {
    return this;
  },
  json(obj) {
    return obj;
  },
  body: {

  },
};
const articleId = 'ced35c26-c919-47ec-bdfe-90bfaffe64d2';
describe('Unit tests for the articles', () => {
  describe('Unit tests for the articles model', () => {
    it(
      'should send an error message if an invalid URL is sent',
      async () => {
        try {
          await Article.create(invalidURLasValue);
        } catch (error) {
          expect(error.errors[0]).to.have.property('message');
          expect(error.errors[0].message).to.equal('Please use an image URL.');
        }
      }
    );
    it('should throw an error when the title field contains invalid characters',
      async () => {
        let createMethodOfArticleModel;
        try {
          createMethodOfArticleModel = await sinon.spy(Article, 'create');
          await Article.create(invalidCharacterInTitle);
        } catch (error) {
          expect(error.errors[0]).to.have.property('message');
          expect(error.errors[0].message).to.equal(
            'Title should contain letters, numbers, !""?'
          );
          await createMethodOfArticleModel.restore();
          sinon.assert.calledOnce(createMethodOfArticleModel);
        }
      });
    it('should throw an error when the title field is too long',
      async () => {
        try {
          await Article.create(tooLongTitle);
        } catch (error) {
          expect(error.errors[0]).to.have.property('message');
          expect(error.errors[0].message).to.equal('Title field accepts 2 - 80 characters');
        }
      });
    describe('Unit test for checkArticleExists Utility function', () => {
      it(
        'it should call article.findOne method',
        async () => {
          try {
            const mySpy = sinon.spy(Article, 'findOne');
            await checkArticleExists(articleId, res);
            expect(mySpy.calledOnce).to.equal(true);
          } catch (error) {
            throw error;
          }
        }
      );
    });
  });
});

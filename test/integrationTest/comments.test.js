import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';
import { Authentication } from '../../src/utilities';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for comments controller', () => {
    let myToken;
    let articleId;
    let commentId;

    before('Create a user before running tests', async () => {
        const userDetails = {
            id: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
            username: 'SamDoe',
            password: 'password',
            email: 'samdoe@wemail.com',
            firstName: 'Sam',
            lastName: 'Doe',
            bio: 'sleeps and eat a lot',
        }
        myToken  = await Authentication.getToken(userDetails);
    });

    describe('Tests for creating a comment for an article', () => {
        const largeCommentText = {
            commentText: `Duis eros praesent. Mauris est cras. Nec amet vivamus. Interdum dolor mus integer felis gravida. 
            Aliquam pretium mollis. Et mauris ultrices integer ornare ornare purus enim elit vestibulum sem consectetuer. 
            Ad sodales ligula quis dolorem vel. Sit lorem tempor iaculis fusce tempus ut maecenas neque. 
            Maecenas velit odio tellus duis ut ut vestibulum primis in turpis eget. Fermentum vestibulum tristique. 
            Aliquam vitae wisi ligula donec magna a ac dignissim adipiscing pede lacus. Accusantium eu massa. 
            Lorem netus aliquam. Vulputate maecenas eros. Lectus placerat nec eget lorem duis dui ut nec magna nonummy sit. 
            Morbi tortor augue. Vestibulum libero at. At semper sit. Pulvinar vestibulum et suspendisse ligula lectus. 
            ros metus quam. Nisl pede pulvinar. Lorem sed non feugiat urna a. 
            Magna adipiscing per venenatis lectus in dis est felis feugiat at tellus tincidunt duis commodo lacinia feugiat 
            isl mollis gravida gravida sit lobortis sapien blandit sed ipsum. Amet morbi hendrerit ullamcorper lobortis wisi. 
            Nulla et sed erat dapibus sit felis at ipsum.`
        };
        const emptyComment = {
        };
        const commentDetails = {
            commentText: 'I like this article very much.'
        };
        before('create an article before running this test suite', async () => {
            const articleDetails = {
                title: 'Dont trian a dragon',
                body: 'do you want toß die?',
                description: 'training a dragon is risjy',
                image: 'https://someimage.uplodersite.com',
            };
            const response = await chai.request(app).post('/api/v1/articles')
                .set('x-access-token', myToken).send(articleDetails);
            articleId = response.body.articleCreated.id;
        });

        it('should create a comment for an article', async () => {
            const response = await chai.request(app).post(`/api/v1/articles/${articleId}/comments`).
                set('x-access-token', myToken).send(commentDetails);
            commentId = response.body.commentCreated.id;
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('success');
            expect(response.body).to.have.property('commentCreated');
            expect(response.body.commentCreated).to.have.property('commentText');
            expect(response.body.commentCreated).to.have.property('id');
            expect(response.body.success).to.equal(true);
            expect(response.body.commentCreated.commentText).to.equal('I like this article very much.');
        });
        it('should send an error message when the required body field is missing', async () => {
            const response = await chai.request(app).post(`/api/v1/articles/${articleId}/comments`).
                set('x-access-token', myToken).send(emptyComment);
            expect(response).to.have.status(400);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.deep.equal('commentText field is required');
        });
        it('should send an error message when the required articleId params is invalid', async () => {
            const response = await chai.request(app).post(`/api/v1/articles/${29}/comments`).
                set('x-access-token', myToken).send(commentDetails);
            expect(response).to.have.status(400);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.deep.equal(':articleId is not a valid uuid type');
        });
        it('should send an error message when body field is too long', async () => {
            const response = await chai.request(app).post(`/api/v1/articles/${articleId}/comments`).
                set('x-access-token', myToken).send(largeCommentText);
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal('Text should be between 3 and 250 characters');
        });
        describe('Tests for creating a childcomment for a comment', () => {
            it('should create a childcomment for a comment', async () => {
                const response = await chai.request(app).post(`/api/v1/comments/${commentId}/childcomments`).
                    set('x-access-token', myToken).send(commentDetails);
                expect(response.status).to.equal(201);
                expect(response.body).to.have.property('childCommentCreated');
                expect(response.body).to.have.property('success');
                expect(response.body.success).to.equal(true);
                expect(response.body.childCommentCreated).to.have.property('id');
                expect(response.body.childCommentCreated).to.have.property('commentText');
                expect(response.body.childCommentCreated.commentText).to.equal('I like this article very much.');
            });
            it('should send an error message when the required body field is missing', async () => {
                const response = await chai.request(app).post(`/api/v1/comments/${commentId}/childcomments`).
                    set('x-access-token', myToken).send(emptyComment);
                expect(response).to.have.status(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.deep.equal('commentText field is required');
            });
            it('should send an error message when the required commentId params is invalid', async () => {
                const response = await chai.request(app).post(`/api/v1/comments/${9}/childcomments`).
                    set('x-access-token', myToken).send(commentDetails);
                expect(response).to.have.status(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.deep.equal(':commentId is not a valid uuid type');
            });
            it('should send an error message when body field is too long', async () => {
                const response = await chai.request(app).post(`/api/v1/comments/${commentId}/childcomments`).
                    set('x-access-token', myToken).send(largeCommentText);
                expect(response.status).to.equal(400);
                expect(response.body).to.have.property('success');
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.equal('Text should be between 3 and 250 characters');
            });
        });
    });
});

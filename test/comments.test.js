import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for comments controller', () => {
    let myToken;
    let articleId;
    let commentId;

    before('Create a user before running tests', async () => {
        const userDetails = {
            username: 'SamDoe',
            password: 'password',
            email: 'samdoe@wemail.com',
            firstName: 'Sam',
            lastName: 'Doe',
            bio: 'sleeps and eat a lot',
        }
        const response = await chai.request(app).post('/api/v1/auth/signup')
            .send(userDetails);
        myToken = response.body.token;
    });

    describe('Tests for creating a comment for an article', () => {
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
            const commentDetails = {
                body: 'I like this article very much.'
            };
            const response = await chai.request(app).post(`/api/v1/articles/${articleId}/comments`).
                set('x-access-token', myToken).send(commentDetails);
            commentId = response.body.commentCreated.id;
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('success');
            expect(response.body).to.have.property('commentCreated');
            expect(response.body.commentCreated).to.have.property('body');
            expect(response.body.commentCreated).to.have.property('id');
            expect(response.body.success).to.equal(true);
            expect(response.body.commentCreated.body).to.equal('I like this article very much.');
        });
        it('should send an error message when the required body field is missing', async () => {
            const commentDetails = {
            };
            const response = await chai.request(app).post(`/api/v1/articles/${articleId}/comments`).
                set('x-access-token', myToken).send(commentDetails);
            expect(response).to.have.status(400);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.deep.equal('Invalid request. All fields are required');
        });
        it('should send an error message when the required articleId params is invalid', async () => {
            const commentDetails = {
                body: 'I like this article very much.'
            };
            const response = await chai.request(app).post(`/api/v1/articles/${29}/comments`).
                set('x-access-token', myToken).send(commentDetails);
            expect(response).to.have.status(400);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.deep.equal(':articleId is not a invalid uuid type');
        });
        it('should send an error message when body field is too long', async () => {
            const commentDetails = {
                body: `Thebrowfoxwertyhgfdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
                          asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjhdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
                          asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjhdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
                          asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjhdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
                          asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjhdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
                          asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjh`
            };
            const response = await chai.request(app).post(`/api/v1/articles/${articleId}/comments`).
                set('x-access-token', myToken).send(commentDetails);
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('success');
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal('Text should be between 3 and 250 characters');
        });
        describe('Tests for creating a childcomment for a comment', () => {
            it('should create a childcomment for a comment', async () => {
                const commentDetails = {
                    body: 'I like this comment very much.'
                };
                const response = await chai.request(app).post(`/api/v1/comments/${commentId}/childcomments`).
                    set('x-access-token', myToken).send(commentDetails);
                expect(response.status).to.equal(201);
                expect(response.body).to.have.property('childCommentCreated');
                expect(response.body).to.have.property('success');
                expect(response.body.success).to.equal(true);
                expect(response.body.childCommentCreated).to.have.property('id');
                expect(response.body.childCommentCreated).to.have.property('body');
                expect(response.body.childCommentCreated.body).to.equal('I like this comment very much.');
            });
            it('should send an error message when the required body field is missing', async () => {
                const commentDetails = {
                };
                const response = await chai.request(app).post(`/api/v1/comments/${commentId}/childcomments`).
                    set('x-access-token', myToken).send(commentDetails);
                expect(response).to.have.status(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.deep.equal('Invalid request. All fields are required');
            });
            it('should send an error message when the required commentId params is invalid', async () => {
                const commentDetails = {
                    body: 'I like this article very much.'
                };
                const response = await chai.request(app).post(`/api/v1/comments/${9}/childcomments`).
                    set('x-access-token', myToken).send(commentDetails);
                expect(response).to.have.status(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.deep.equal(':commentId is not a invalid uuid type');
            });
            it('should send an error message when body field is too long', async () => {
                const commentDetails = {
                    body: `Thebrowfoxwertyhgfdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
                              asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjhdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
                              asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjhdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
                              asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjhdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
                              asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjhdrghnbfrtyhjnbgfthjmnbghjmnbghjmnbghjmnbghjnbg
                              asdfghjnbvcdfghnbvfrtyuioiuytuioiuhghjkiuytyuiughjkghjh`
                };
                const response = await chai.request(app).post(`/api/v1/comments/${commentId}/childcomments`).
                    set('x-access-token', myToken).send(commentDetails);
                expect(response.status).to.equal(400);
                expect(response.body).to.have.property('success');
                expect(response.body.success).to.equal(false);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.equal('Text should be between 3 and 250 characters');
            });
        });
    });
});

import chai from 'chai';
import models from '../../src/models';

const { expect } = chai;
const { Likes } = models;

const testObject = {
    invalidCommentId: {
       commentId: '5d5dlkjdf9-djfdkjh-484849',
    },
    invalidUserId: {
        userId: '5d5dlkjdf9-djfdkjh-484849',
    },
    invalidArticleId: {
        articleId: '5d5dlkjdf9-djfdkjh-484849',
    },
    invalidChildCommentId: {
        childCommentId: '5d5dlkjdf9-djfdkjh-484849',
    },
    invalidIsLikeValue: {
        isLiked: 'true8',
    }
}


describe('Unit test for Likes model', () => {
    it('should reject an invalid uuid type for commentId', async () => {
        try {
            await Likes.create(testObject.invalidCommentId)
        } catch (error) {
            expect(error.errors[0].message)
                .to.equal(':commentId is not a valid uuid type');
        }
    });
    it('should reject an invalid uuid type for childCommentId', async () => {
        try {
            await Likes.create(testObject.invalidChildCommentId)
        } catch (error) {
            expect(error.errors[0].message)
                .to.equal(':childCommentId is not a valid uuid type');
        }
    });
    it('should reject an invalid uuid type for articleId', async () => {
        try {
            await Likes.create(testObject.invalidArticleId)
        } catch (error) {
            expect(error.errors[0].message)
                .to.equal(':articleId is not a valid uuid type');
        }
    });
    it('should reject an invalid uuid type for userId', async () => {
        try {
            await Likes.create(testObject.invalidUserId)
        } catch (error) {
            expect(error.errors[0].message)
                .to.equal(':userId is not a valid uuid type');
        }
    });
    it('should reject non boolean value for isLike', async () => {
        try {
            await Likes.create(testObject.invalidIsLikeValue)
        } catch (error) {
            expect(error.errors[0].message)
                .to.equal('like status must be a boolean value');
        }
    });
});

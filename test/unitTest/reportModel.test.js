import chai from 'chai';
import models from '../../src/models';

const { expect } = chai;
const { Report } = models;

const testObject = {
    invalidReportComment: {
        plagiarism: true,
        reportComment: 'd',
        userId: '5d5e06e0-bd59-4207-940d-9324ace16b38',
        articleId: '5d5e06e0-bd59-4207-940d-9324ace16b38'
    },
    invalidArticleId: {
        plagiarism: true,
        reportComment: 'my work was plagiarised in the second paragraph of this article',
        userId: '5d5e06e0-bd59-4207-940d-9324ace16b38',
        articleId: '5d5dlkjdf9-djfdkjh-484849'
    },
    invalidUserId: {
        plagiarism: true,
        reportComment: 'my work was plagiarised in the second paragraph of this article',
        userId: '5d5dlkjdf9-djfdkjh-484849',
        articleId: '5d5e06e0-bd59-4207-940d-9324ace16b38'
    },
    invalidPlagiarismValue: {
        plagiarism: 'true',
        reportComment: 'my work was plagiarised in the second paragraph of this article',
        userId: '5d5e06e0-bd59-4207-940d-9324ace16b38',
        articleId: '5d5e06e0-bd59-4207-940d-9324ace16b38'
    },
    invalidAgreementViolationValue: {
        agreementViolation: 'true',
        reportComment: 'my work was plagiarised in the second paragraph of this article',
        userId: '5d5e06e0-bd59-4207-940d-9324ace16b38',
        articleId: '5d5e06e0-bd59-4207-940d-9324ace16b38'
    }
}


describe('Unit test for report model', () => {
    it('should reject reportComment not between 3 and 250 characters', async () => {
        try {
            await Report.create(testObject.invalidReportComment)
        } catch (error) {
            expect(error.errors[0].message)
                .to.equal('Text should be between 3 and 250 characters');
        }
    });
    it('should reject an invalid uuid type for articleId', async () => {
        try {
            await Report.create(testObject.invalidArticleId)
        } catch (error) {
            expect(error.errors[0].message)
                .to.equal(':articleId is not a valid uuid type');
        }
    });
    it('should reject an invalid uuid type for userId', async () => {
        try {
            await Report.create(testObject.invalidUserId)
        } catch (error) {
            expect(error.errors[0].message)
                .to.equal(':userId is not a valid uuid type');
        }
    });
    it('should reject non boolean value for plagiarism', async () => {
        try {
            await Report.create(testObject.invalidPlagiarismValue)
        } catch (error) {
            expect(error.errors[0].message)
                .to.equal('boolean value expected');
        }
    });
    it('should reject non boolean value for agreementViolation', async () => {
        try {
            await Report.create(testObject.invalidAgreementViolationValue)
        } catch (error) {
            expect(error.errors[0].message)
                .to.equal('boolean value expected');
        }
    });
});

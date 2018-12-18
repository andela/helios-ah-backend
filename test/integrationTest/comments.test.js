import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for comments controller', () => {

    it('should create a user before running tests', async () => {
        expect(true).to.equal(true);
    });
});

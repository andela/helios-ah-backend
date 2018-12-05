import chai from 'chai';
import models from '../../src/models';
import Authentication from '../../src/utilities/authentication';

const { expect } = chai;
const { userTokens } = models;
const payload = {
  id: 'ca1cc601-fbcc-4c93-b66e-1e3a089ae0d8',
  username: 'username',
  role: 1
};

describe('Tests userTokens model', () => {
  it('should contain data where isExpired column equals false', async () => {
    const data = await userTokens.findOne({
      where: {
        isExpired: false
      }
    });
    expect(data).to.be.an('object');
    expect(data).to.have.property('userId');
  })
})

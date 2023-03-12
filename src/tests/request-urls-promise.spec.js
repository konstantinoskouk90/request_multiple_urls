import {
  expect
} from 'chai';
import requestMultipleUrls from '../index';

import ftseFsi from './data/ftse-fsi.json';
import gbpHkd from './data/gbp-hkd.json';
import gbpUsd from './data/gbp-usd.json';

const validUrls = [
  'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/ftse-fsi.json',
  'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-hkd.json',
  'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-usd.json'
];

describe('lib/request-urls-promise.js', () => {
  it('Expect to get a input is not an array custom validation error', async () => {
    await requestMultipleUrls('not-an-array').catch((error) => {
      expect(error.code).to.equal('INPUT_MUST_BE_OF_TYPE_ARRAY');
      expect(error.response.status).to.equal(400);
      expect(error.response.statusText).to.equal('Bad Request');
    });
  });

  it('Expect to get a input array cannot be empty custom validation error', async () => {
    await requestMultipleUrls([]).catch((error) => {
      expect(error.code).to.equal('INPUT_ARRAY_CANNOT_BE_EMPTY');
      expect(error.response.status).to.equal(400);
      expect(error.response.statusText).to.equal('Bad Request');
    });
  });

  it('Expect urls response status to be fulfilled and data to equal mock json data for all', async () => {
    const response = await requestMultipleUrls(validUrls);

    expect(
      [response[0].status, response[1].status, response[2].status]
    ).to.deep.equal(['fulfilled', 'fulfilled', 'fulfilled']);

    expect(
      [response[0].value.status, response[1].value.status, response[2].value.status]
    ).to.deep.equal([200, 200, 200]);

    expect(
      [response[0].value.statusText, response[1].value.statusText, response[2].value.statusText]
    ).to.deep.equal(['OK', 'OK', 'OK']);

    expect(
      [response[0].value.data, response[1].value.data, response[2].value.data]
    ).to.deep.equal([ftseFsi, gbpHkd, gbpUsd]);
  });

  it('Expect urls response status to be rejected with a custom invalid URL validation error for all', async () => {
    const response = await requestMultipleUrls(['invalid-url', 'invalid-url-2', 'invalid-url-3']);

    expect(
      [response[0].status, response[1].status, response[2].status]
    ).to.deep.equal(['rejected', 'rejected', 'rejected']);

    expect(
      [response[0].reason.code, response[1].reason.code, response[2].reason.code]
    ).to.deep.equal(['INVALID_URL', 'INVALID_URL', 'INVALID_URL']);

    expect(
      [response[0].reason.response.status, response[1].reason.response.status, response[2].reason.response.status]
    ).to.deep.equal([400, 400, 400]);

    expect(
      [response[0].reason.response.statusText, response[1].reason.response.statusText, response[2].reason.response.statusText]
    ).to.deep.equal(['Bad Request', 'Bad Request', 'Bad Request']);

    expect(
      [response[0].value, response[1].value, response[2].value]
    ).to.deep.equal([undefined, undefined, undefined]);
  });

  it('Expect urls response status for 2nd and 3rd urls to be fulfilled but rejected for the 1st one with a custom invalid URL validation error', async () => {
    const response = await requestMultipleUrls(['invalid-url', validUrls[1], validUrls[2]]);

    expect(
      [response[0].status, response[1].status, response[2].status]
    ).to.deep.equal(['rejected', 'fulfilled', 'fulfilled']);

    expect(response[0].reason.code).to.equal('INVALID_URL');

    expect(
      [response[0].reason.response.status, response[1].value.status, response[2].value.status]
    ).to.deep.equal([400, 200, 200]);

    expect(
      [response[0].reason.response.statusText, response[1].value.statusText, response[2].value.statusText]
    ).to.deep.equal(['Bad Request', 'OK', 'OK']);

    expect(
      [response[0].value, response[1].value.data, response[2].value.data]
    ).to.deep.equal([undefined, gbpHkd, gbpUsd]);
  });

  it('Expect urls response status for 1st and 3rd urls to be fulfilled but rejected for the 2nd one with a custom invalid URL validation error', async () => {
    const response = await requestMultipleUrls([validUrls[0], 'invalid-url', validUrls[2]]);

    expect(
      [response[0].status, response[1].status, response[2].status]
    ).to.deep.equal(['fulfilled', 'rejected', 'fulfilled']);

    expect(response[1].reason.code).to.equal('INVALID_URL');

    expect(
      [response[0].value.status, response[1].reason.response.status, response[2].value.status]
    ).to.deep.equal([200, 400, 200]);

    expect(
      [response[0].value.statusText, response[1].reason.response.statusText, response[2].value.statusText]
    ).to.deep.equal(['OK', 'Bad Request', 'OK']);

    expect(
      [response[0].value.data, response[1].value, response[2].value.data]
    ).to.deep.equal([ftseFsi, undefined, gbpUsd]);
  });

  it('Expect urls response status for 1st and 2nd urls to be fulfilled but rejected for the 3rd one with a custom invalid URL validation error', async () => {
    const response = await requestMultipleUrls([validUrls[0], validUrls[1], 'invalid-url']);

    expect(
      [response[0].status, response[1].status, response[2].status]
    ).to.deep.equal(['fulfilled', 'fulfilled', 'rejected']);

    expect(response[2].reason.code).to.equal('INVALID_URL');

    expect(
      [response[0].value.status, response[1].value.status, response[2].reason.response.status]
    ).to.deep.equal([200, 200, 400]);

    expect(
      [response[0].value.statusText, response[1].value.statusText, response[2].reason.response.statusText]
    ).to.deep.equal(['OK', 'OK', 'Bad Request']);

    expect(
      [response[0].value.data, response[1].value.data, response[2].value]
    ).to.deep.equal([ftseFsi, gbpHkd, undefined]);
  });

  it('Expect urls response status for 2nd and 3rd urls to be fulfilled but rejected for the 1st one with an axios 404 Not Found error code', async () => {
    // Note: There is a typo in the 1st URL
    const response = await requestMultipleUrls(['https://ftt-tech-test-example.s3-eu-west-1.amazonaws.com/ftse-fsi.json', validUrls[1], validUrls[2]]);

    expect(
      [response[0].status, response[1].status, response[2].status]
    ).to.deep.equal(['rejected', 'fulfilled', 'fulfilled']);

    expect(response[0].reason.code).to.equal('ERR_BAD_REQUEST');

    expect(
      [response[0].reason.response.status, response[1].value.status, response[2].value.status]
    ).to.deep.equal([404, 200, 200]);

    expect(
      [response[0].reason.response.statusText, response[1].value.statusText, response[2].value.statusText]
    ).to.deep.equal(['Not Found', 'OK', 'OK']);

    expect(
      [response[0].value, response[1].value.data, response[2].value.data]
    ).to.deep.equal([undefined, gbpHkd, gbpUsd]);
  });

  it('Expect urls response status for 1st and 3rd urls to be fulfilled but rejected for the 2nd one with an axios 404 Not Found error code', async () => {
    // Note: There is a typo in the 2rd URL
    const response = await requestMultipleUrls([validUrls[0], 'https://ftt-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-hkd.json', validUrls[2]]);

    expect(
      [response[0].status, response[1].status, response[2].status]
    ).to.deep.equal(['fulfilled', 'rejected', 'fulfilled']);

    expect(response[1].reason.code).to.equal('ERR_BAD_REQUEST');

    expect(
      [response[0].value.status, response[1].reason.response.status, response[2].value.status]
    ).to.deep.equal([200, 404, 200]);

    expect(
      [response[0].value.statusText, response[1].reason.response.statusText, response[2].value.statusText]
    ).to.deep.equal(['OK', 'Not Found', 'OK']);

    expect(
      [response[0].value.data, response[1].value, response[2].value.data]
    ).to.deep.equal([ftseFsi, undefined, gbpUsd]);
  });

  it('Expect urls response status for 1st and 2nd urls to be fulfilled but rejected for the 3rd one with an axios 404 Not Found error code', async () => {
    // Note: There is a typo in the 3rd URL
    const response = await requestMultipleUrls([validUrls[0], validUrls[1], 'https://ftt-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-usd.json']);

    expect(
      [response[0].status, response[1].status, response[2].status]
    ).to.deep.equal(['fulfilled', 'fulfilled', 'rejected']);

    expect(response[2].reason.code).to.equal('ERR_BAD_REQUEST');

    expect(
      [response[0].value.status, response[1].value.status, response[2].reason.response.status]
    ).to.deep.equal([200, 200, 404]);

    expect(
      [response[0].value.statusText, response[1].value.statusText, response[2].reason.response.statusText]
    ).to.deep.equal(['OK', 'OK', 'Not Found']);

    expect(
      [response[0].value.data, response[1].value.data, response[2].value]
    ).to.deep.equal([ftseFsi, gbpHkd, undefined]);
  });
});
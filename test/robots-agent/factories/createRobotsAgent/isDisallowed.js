// @flow

import test, {
  after,
  before
} from 'ava';
import nock from 'nock';
import createRobotsAgent from '../../../../src/factories/createRobotsAgent';

before(async () => {
  nock.disableNetConnect();
});

after(() => {
  nock.enableNetConnect();
});

test('determines if path is disallowed', async (t) => {
  const responseBody = `
User-agent: *
Allow: /foo/
Disallow: /bar/
`;

  nock('http://foo.tld')
    .get('/robots.txt')
    .reply(200, responseBody, {
      'content-type': 'text/plain'
    });

  const robotsAgent = await createRobotsAgent();

  t.true(await robotsAgent.isDisallowed('http://foo.tld/foo/') === false);
  t.true(await robotsAgent.isDisallowed('http://foo.tld/bar/') === true);
});

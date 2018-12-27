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

test('returns true if robots.txt is available', async (t) => {
  const responseBody = `
User-agent: *
Disallow: /foo/
`;

  nock('http://foo.tld')
    .get('/robots.txt')
    .reply(200, responseBody, {
      'content-type': 'text/plain'
    });

  const robotsAgent = await createRobotsAgent();

  t.true(await robotsAgent.isRobotsAvailable('http://foo.tld/foo/') === true);
});

test('returns false if robots.txt is available', async (t) => {
  nock('http://foo.tld')
    .get('/robots.txt')
    .reply(404);

  const robotsAgent = await createRobotsAgent();

  t.true(await robotsAgent.isRobotsAvailable('http://foo.tld/foo/') === false);
});

test('does not make repeat requests for the same protocol and hostname combination', async (t) => {
  const responseBody = `
User-agent: *
Disallow: /foo/
`;

  const scope = nock('http://foo.tld')
    .get('/robots.txt')
    .reply(200, responseBody, {
      'content-type': 'text/plain'
    });

  const robotsAgent = await createRobotsAgent();

  await robotsAgent.isRobotsAvailable('http://foo.tld/foo/');
  await robotsAgent.isRobotsAvailable('http://foo.tld/foo/');

  // A second request would trigger `nock` error.
  t.true(scope.isDone());
});

// @flow

import test, {
  after,
  before
} from 'ava';
import nock from 'nock';
import getRobotsContents from '../../../src/services/getRobotsContents';

before(async () => {
  nock.disableNetConnect();
});

after(() => {
  nock.enableNetConnect();
});

test('retrieves contents of the robots.txt', async (t) => {
  const responseBody = `
User-agent: *
Disallow: /
`;

  nock('http://foo.tld')
    .get('/robots.txt')
    .reply(200, responseBody, {
      'content-type': 'text/plain'
    });

  const robots = await getRobotsContents('http://foo.tld/robots.txt');

  t.true(robots === responseBody);
});

test('returns null if response cannot be recognized as a valid robots.txt', async (t) => {
  nock('http://foo.tld')
    .get('/robots.txt')
    .reply(200, 'foo', {
      'content-type': 'text/plain'
    });

  const robots = await getRobotsContents('http://foo.tld/robots.txt');

  t.true(robots === null);
});

test('returns null if response produces an error', async (t) => {
  nock('http://foo.tld')
    .get('/robots.txt')
    .reply(404);

  const robots = await getRobotsContents('http://foo.tld/robots.txt');

  t.true(robots === null);
});

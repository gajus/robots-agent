// @flow

import test from 'ava';
import getRobotsUrl from '../../../src/utilities/getRobotsUrl';

test('constructs URL using protocol and hostname', (t) => {
  const actual = getRobotsUrl('https://foo.tld/bar/');

  t.true(actual === 'https://foo.tld/robots.txt');
});

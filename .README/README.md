# robots-agent

[![Travis build status](http://img.shields.io/travis/gajus/robots-agent/master.svg?style=flat-square)](https://travis-ci.org/gajus/robots-agent)
[![Coveralls](https://img.shields.io/coveralls/gajus/robots-agent.svg?style=flat-square)](https://coveralls.io/github/gajus/robots-agent)
[![NPM version](http://img.shields.io/npm/v/robots-agent.svg?style=flat-square)](https://www.npmjs.org/package/robots-agent)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

robots.txt agent with cache.

{"gitdown": "contents"}

## Usage

```js
import {
  createRobotsAgent
} from 'robots-agent';

const robotsAgent = createRobotsAgent();

const firstUsageExample = async () => {
  // The first request retrieves robots.txt contents and initiates an instance of 'robots-parser'.
  const robotsIsAvailable = await robotsAgent.isRobotsAvailable('http://gajus.com/');

  // If robots.txt is not available, then `isAllowed` and other methods will throw an error.
  if (!robotsIsAvailable) {
    return false;
  }
};

const secondUsageExample = async () => {
  // robots.txt cache is per a unique protocol+hostname combination, i.e.
  // 'http://gajus.com/' and 'https://gajus.com/' will result in two robots.txt lookups.
  const robotsIsAvailable = await robotsAgent.isRobotsAvailable('https://gajus.com/');

  if (!robotsIsAvailable) {
    return false;
  }

  // Follow up requests for the same protocol+hostname combination will not create new HTTP requests.
  await robotsAgent.isAllowed('https://gajus.com/foo/');
  await robotsAgent.isAllowed('https://gajus.com/bar/');
};

const main = async () => {
  await firstUsageExample();
  await secondUsageExample();
};

main();

```

## API

```js
/**
 * @property getMatchingLineNumber https://github.com/samclarke/robots-parser#getmatchinglinenumberurl-ua
 * @property getPreferredHost https://github.com/samclarke/robots-parser#getpreferredhost
 * @property getSitemaps https://github.com/samclarke/robots-parser#getsitemaps
 * @property isAllowed https://github.com/samclarke/robots-parser#isallowedurl-ua
 * @property isDisallowed https://github.com/samclarke/robots-parser#isdisallowedurl-ua
 * @property isRobotsAvailable Identifies whether robots.txt is available for the URL.
 */
type RobotsAgentType = {|
  +getMatchingLineNumber: (url: string, userAgent?: string) => Promise<number>,
  +getPreferredHost: (url: string) => Promise<string | null>,
  +getSitemaps: (url: string) => Promise<$ReadOnlyArray<string>>,
  +isAllowed: (url: string, userAgent?: string) => Promise<boolean>,
  +isDisallowed: (url: string, userAgent?: string) => Promise<boolean>,
  +isRobotsAvailable: (url: string, userAgent?: string) => Promise<boolean>
|};

```

## Errors

All `robots-agent` errors extend from `RobotsAgentError`.

`RobotsNotAvailableError` is thrown when any of the `robots-parser` methods are invoked for a URL with unavailable robots.txt.

```js
import {
  RobotsAgentError,
  RobotsNotAvailableError
} from 'robots-agent';

```

## Difference from `robots-parser`

`robots-agent` abstract `robots-parser` methods by automating retrieval and cache of robots.txt content and safe handling of `robots-parser` methods.

Unlike `robots-parser`, `robots-agent` will throw an error if `getMatchingLineNumber`, `getPreferredHost`, `getSitemaps`, `isAllowed` or `isDisallowed` is invoked for a URL that does not have robots.txt. Use `isRobotsAvailable` to check availability of robots.txt prior to invoking the parser methods.

## Implementation

`robots-agent` uses [`robots-parser`](https://github.com/samclarke/robots-parser) to implement all robots.txt checks.

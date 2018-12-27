// @flow

import parseUrl from 'parse-url';

export default (url: string): string => {
  const urlTokens = parseUrl(url);

  return urlTokens.protocol + '://' + urlTokens.resource + '/robots.txt';
};

// @flow

import got from 'got';

export default async (robotsUrl: string): Promise<string | null> => {
  const response = await got(robotsUrl, {
    headers: {
      'user-agent': null
    },
    retry: 0,
    throwHttpErrors: false
  });

  if (response.statusCode !== 200) {
    return null;
  }

  const normalisedBody = response.body.toLowerCase();

  if (normalisedBody.includes('user-agent:') || normalisedBody.includes('disallow:') || normalisedBody.includes('allow:')) {
    return response.body;
  }

  return null;
};

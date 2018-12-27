// @flow

import parseRobots from 'robots-parser';
import parseUrl from 'parse-url';
import {
  getRobotsContents
} from '../services';
import {
  getRobotsUrl
} from '../utilities';
import {
  RobotsNotAvailableError
} from '../errors';
import Logger from '../Logger';
import type {
  RobotsAgentType
} from '../types';

const log = Logger.child({
  namespace: 'createRobotsAgent'
});

export default (): RobotsAgentType => {
  const robotsIndex = {};

  const getRobotsAgent = async (url: string) => {
    const urlTokens = parseUrl(url);

    const robotsNamespace = JSON.stringify({
      hostname: urlTokens.resource,
      protocol: urlTokens.protocol
    });

    if (robotsIndex[robotsNamespace] === undefined) {
      const robotsUrl = getRobotsUrl(url);

      log.debug('indexing robots.txt for %s', robotsUrl);

      const robotsContents = await getRobotsContents(robotsUrl);

      if (robotsContents) {
        robotsIndex[robotsNamespace] = parseRobots(robotsContents);
      } else {
        robotsIndex[robotsNamespace] = null;
      }
    }

    return robotsIndex[robotsNamespace];
  };

  return {
    getMatchingLineNumber: async (url: string, userAgent?: string): Promise<number> => {
      const robotsAgent = await getRobotsAgent(url);

      if (!robotsAgent) {
        throw new RobotsNotAvailableError();
      }

      return robotsAgent.getMatchingLineNumber(url, userAgent);
    },
    getPreferredHost: async (url: string): Promise<string | null> => {
      const robotsAgent = await getRobotsAgent(url);

      if (!robotsAgent) {
        throw new RobotsNotAvailableError();
      }

      return robotsAgent.getMatchingLineNumber();
    },
    getSitemaps: async (url: string): Promise<$ReadOnlyArray<string>> => {
      const robotsAgent = await getRobotsAgent(url);

      if (!robotsAgent) {
        throw new RobotsNotAvailableError();
      }

      return robotsAgent.getSitemaps();
    },
    isAllowed: async (url: string, userAgent?: string): Promise<boolean> => {
      const robotsAgent = await getRobotsAgent(url);

      if (!robotsAgent) {
        throw new RobotsNotAvailableError();
      }

      return robotsAgent.isAllowed(url, userAgent);
    },
    isDisallowed: async (url: string, userAgent?: string): Promise<boolean> => {
      const robotsAgent = await getRobotsAgent(url);

      if (!robotsAgent) {
        throw new RobotsNotAvailableError();
      }

      return robotsAgent.isDisallowed(url, userAgent);
    },
    isRobotsAvailable: async (url: string): Promise<boolean> => {
      const robotsAgent = await getRobotsAgent(url);

      return Boolean(robotsAgent);
    }
  };
};

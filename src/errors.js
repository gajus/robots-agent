// @flow

import ExtendableError from 'es6-error';

export class RobotsAgentError extends ExtendableError {}

export class RobotsNotAvailableError extends RobotsAgentError {
  constructor () {
    super('robots.txt is not available.');
  }
}

// @flow

export type RobotsAgentType = {|
  +getMatchingLineNumber: (url: string, userAgent?: string) => Promise<number>,
  +getPreferredHost: (url: string) => Promise<string | null>,
  +getSitemaps: (url: string) => Promise<$ReadOnlyArray<string>>,
  +isAllowed: (url: string, userAgent?: string) => Promise<boolean>,
  +isDisallowed: (url: string, userAgent?: string) => Promise<boolean>,
  +isRobotsAvailable: (url: string, userAgent?: string) => Promise<boolean>
|};

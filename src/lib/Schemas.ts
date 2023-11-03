import { Static, Type } from '@sinclair/typebox'

export const AppConfig = Type.Object({
  /** The URL to the Upstash Redis instance. */
  upstashUrl: Type.String({ default: process.env.UPSTASH_URL }),

  /** The token for the Upstash Redis instance. */
  upstashToken: Type.String({ default: process.env.UPSTASH_TOKEN }),

  /** The token for the Slack API. */
  slackAuthToken: Type.String({ default: process.env.SLACK_AUTH_TOKEN }),
})

export const EmojiEntry = Type.Object({
  /** The name of the Emoji. */
  name: Type.String(),

  /** The URL for the emoji image. */
  url: Type.String(),
})

export const CachedEmoji = Type.Object({
  /** The key where the emoji is stored in Redis. */
  key: Type.String(),

  /** The URL for the emoji image. */
  url: Type.String(),

  /** When the emoji was first added to the cache. */
  added: Type.String(),

  /** When the emoji was last updated. */
  lastUpdated: Type.String(),
})

export type CachedEmoji = Static<typeof CachedEmoji>
export type EmojiEntry = Static<typeof EmojiEntry>
export type AppConfig = Static<typeof AppConfig>

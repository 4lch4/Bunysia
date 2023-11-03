import { logger } from '@4lch4/backpack'
import { Redis } from '@upstash/redis'
import Day from 'dayjs'
import PQueue from 'p-queue'
import { EmojiEntry } from '../Schemas'

/** The keys used to store data in Redis. */
const RedisKeys = {
  /** The key for the number of emoji cached. */
  count: 'emoji:meta:count',

  /** The key for the date/time the emoji cache was last updated. */
  updated: 'emoji:meta:lastUpdated',

  /**
   * Creates the key for an emoji entry with the given `name`, e.g. `emoji:entry:100`.
   *
   * @param name The name of the emoji.
   *
   * @returns The key for an emoji entry with the given name.
   */
  entry: (name: string) => `emoji:entry:${name}`,
}

/**
 * A utility class for interacting with the [Redis][0] cache in [Upstash][1]
 *
 * [0]: https://upstash.com/docs/redis/overall/getstarted
 * [1]: https://upstash.com
 */
export class RedisUtil {
  /** An instance of the {@link Redis Upstash Redis} client. */
  private client: Redis

  public constructor(url: string, token: string) {
    this.client = new Redis({ url, token })
  }

  /**
   * Updates/sets the metadata for the emoji cache. This includes:
   *
   * - The number of emoji cached.
   *   - `emoji:meta:count`
   * - The date/time the emoji cache was last updated.
   *  - `emoji:meta:lastUpdated`
   *
   * @param emojiCount The number of emoji retrieved from Slack.
   *
   * @returns Whether the metadata was successfully updated.
   */
  public async updateMetadata(emojis: EmojiEntry[]) {
    logger.debug(`[RedisUtil#updateMetadata]: Updating cache metadata...`)

    const metadataCount = await this.client.set(RedisKeys.count, `${emojis.length}`)
    const metadataUpdated = await this.client.set(RedisKeys.updated, Day().format())

    return { metadataCount, metadataUpdated }
  }

  private async saveEmojiEntry(cacheKey: string, emoji: EmojiEntry) {
    logger.debug(`[RedisUtil#saveEmojiEntry]: Caching emoji w/ key ${cacheKey}...`)

    return this.client.hset(cacheKey, {
      url: emoji.url,
      added: Day().format(),
      updated: Day().format(),
    })
  }

  private async updateEmojiEntry(cacheKey: string, emoji: EmojiEntry) {
    logger.debug(`[RedisUtil#updateEmojiEntry]: Updating emoji w/ key ${cacheKey}...`)

    return this.client.hset(cacheKey, { url: emoji.url, updated: Day().format() })
  }

  public async cacheEmojis(emojis: EmojiEntry[]) {
    const { metadataCount, metadataUpdated } = await this.updateMetadata(emojis)

    if (metadataCount !== 'OK') {
      logger.warn(`[RedisUtil#cacheEmojis]: Failed to update emoji count metadata.`)
      logger.warn(`[RedisUtil#cacheEmojis]: Response: ${metadataCount}`)
    }

    if (metadataUpdated !== 'OK') {
      logger.warn(`[RedisUtil#cacheEmojis]: Failed to update emoji lastUpdated metadata.`)
      logger.warn(`[RedisUtil#cacheEmojis]: Response: ${metadataUpdated}`)
    }

    for (const emoji of emojis) {
      const cacheKey = RedisKeys.entry(emoji.name)
      const exists = await this.client.exists(cacheKey)

      if (exists) {
        await this.updateEmojiEntry(cacheKey, emoji)
      } else {
        await this.saveEmojiEntry(cacheKey, emoji)
      }
    }
  }

  public async getCacheMetadata() {
    logger.debug(`[RedisUtil#getCacheMetadata]: Retrieving cache metadata...`)

    const count = await this.client.get(RedisKeys.count)
    const updated = await this.client.get(RedisKeys.updated)

    return { count, updated }
  }

  public async cacheEmojisQueued(emojis: EmojiEntry[]) {
    const { metadataCount, metadataUpdated } = await this.updateMetadata(emojis)

    if (metadataCount !== 'OK') {
      logger.warn(`[RedisUtil#cacheEmojisQueued]: Failed to update emoji count metadata.`)
      logger.warn(`[RedisUtil#cacheEmojisQueued]: Response: ${metadataCount}`)
    }

    if (metadataUpdated !== 'OK') {
      logger.warn(`[RedisUtil#cacheEmojisQueued]: Failed to update emoji lastUpdated metadata.`)
      logger.warn(`[RedisUtil#cacheEmojisQueued]: Response: ${metadataUpdated}`)
    }

    const queue = new PQueue()

    for (const emoji of emojis) {
      queue.add(async () => {
        const cacheKey = RedisKeys.entry(emoji.name)
        const exists = await this.client.exists(cacheKey)

        if (exists) {
          await this.updateEmojiEntry(cacheKey, emoji)
        } else {
          await this.saveEmojiEntry(cacheKey, emoji)
        }
      })
    }

    return queue.onIdle()
  }
}

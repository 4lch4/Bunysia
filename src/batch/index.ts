import { logger } from '@4lch4/backpack'
import { RedisUtil, SlackUtil, getConfig } from '../lib/index'

export async function runJob() {
  try {
    const { slackAuthToken, upstashToken, upstashUrl } = getConfig()

    logger.debug(`[batch][main]: Config loaded...`)

    const slackUtil = new SlackUtil(slackAuthToken)
    const redisUtil = new RedisUtil(upstashUrl, upstashToken)

    logger.debug(`[batch][main]: Getting emoji...`)

    const emojis = await slackUtil.getEmojiWithRetries()

    logger.debug(`[batch][main]: ${emojis.length} emoji retrieved from Slack...`)

    const { metadataCount, metadataUpdated } = await redisUtil.updateMetadata(emojis)

    logger.debug(`[batch][main]: ${metadataCount} emoji count metadata updated...`)
    logger.debug(`[batch][main]: ${metadataUpdated} emoji lastUpdated metadata updated...`)

    const cacheRes = await redisUtil.cacheEmojisQueued(emojis)

    logger.success(`[batch][main]: Batch job completed successfully!`, { cacheRes })

    return 0
  } catch (error) {
    logger.error(`[batch][main+catch]: Error getting emoji!`, { error })

    return 1
  }
}

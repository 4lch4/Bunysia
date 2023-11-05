import { logger } from '@4lch4/backpack'
import { Elysia } from 'elysia'
import { runJob } from '../batch'
import { getConfig, RedisUtil } from '../lib'

const { upstashUrl, upstashToken } = getConfig()

const redisUtil = new RedisUtil(upstashUrl, upstashToken)

export const SlackRoute = new Elysia()
  // Returns the cached metadata about the emoji.
  .get(
    '/emoji',
    async () => {
      const { count, updated } = await redisUtil.getCacheMetadata()

      return { count, updated }
    },
    {
      detail: {
        description: 'Returns the cached metadata about the emoji.',
        summary: 'Get the emoji metadata.',
      },
    },
  )
  // A route for manually kicking off a cache sync.
  .get(
    '/emoji/sync',
    async () => {
      logger.info('Executing cron job to sync cache...')

      const res = await runJob()

      if (res === 0) return { status: 'success' }
      else return { status: 'error' }
    },
    {
      detail: {
        description: 'A route for manually kicking off a cache sync.',
        summary: 'Manually sync the emoji cache.',
      },
    },
)
  .post('/events', async _ctx => {
    
  })

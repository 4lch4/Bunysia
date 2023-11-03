import { prefixedHealthCheckRoutes, printRoutes } from '@4lch4/backpack/elysia'
import { cron } from '@elysiajs/cron'
import { swagger } from '@elysiajs/swagger'
import { logger as logysia } from '@grotto/logysia'
import { Elysia } from 'elysia'
import { SlackRoute } from './api'
import { runJob } from './batch'
// import { logger } from './lib'
import { logger } from '@4lch4/backpack'

export const app = new Elysia()
  .use(logysia())
  .use(swagger())
  .use(prefixedHealthCheckRoutes('/status'))
  .use(SlackRoute)
  .use(
    cron({
      name: 'bunysia-batch',
      pattern: '*/30 * * * *',
      run: async () => {
        logger.info('Running cron job...')
        await runJob()
      },
    }),
  )

// Only output the routes & success logs if we're not in a test environment.
if (!Bun.main.includes('bunysia/test')) {
  printRoutes(app.routes)

  logger.success('The server has come online!')
  logger.success(`Listening on ${app.server?.hostname}:${app.server?.port}...`)
}

app.listen(process.env.APP_PORT || 4242)

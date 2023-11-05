import { logger } from '@4lch4/backpack'
import { HealthCheckRoutes, printRoutes } from '@4lch4/backpack/elysia'
import { cron } from '@elysiajs/cron'
import { swagger } from '@elysiajs/swagger'
import { logger as logysia } from '@grotto/logysia'
import { Elysia } from 'elysia'
import { SlackRoute } from './api'
import { runJob } from './batch'

export const app = new Elysia()
  .use(logysia())
  .use(swagger())
  .use(HealthCheckRoutes('/status'))
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
  ).listen(process.env.APP_PORT || 4242)

// Only output the routes & success logs if we're not in a test environment.
if (!Bun.main.includes('bunysia/test')) {
  printRoutes(app.routes, { multiMethodRows: true })

  logger.success('The server has come online!')
  logger.success(`Listening on ${app.server?.hostname}:${app.server?.port}...`)
}

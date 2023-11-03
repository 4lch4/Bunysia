import { logger } from '@4lch4/backpack'
import { promiseTimeout } from '@4lch4/backpack/utils'
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import promiseRetry from 'promise-retry'
import { EmojiEntry } from '../Schemas'

export class SlackUtil {
  private client: AxiosInstance

  public constructor(
    authToken: string,
    { baseURL = 'https://slack.com/api', timeout = 5000 }: AxiosRequestConfig = {},
  ) {
    this.client = Axios.create({
      headers: { Authorization: `Bearer ${authToken}` },
      // Prevent Axios from throwing errors on non-2xx responses.
      validateStatus: () => true,
      baseURL,
      timeout,
    })
  }

  public async getLatestEmoji(): Promise<EmojiEntry[]> {
    try {
      const { data, status, statusText } = await this.client.get('/emoji.list', {
        validateStatus: () => true,
        timeout: 5000,
      })

      if (status === 200) {
        return Object.entries(data.emoji).map(entry => {
          return { name: entry[0], url: entry[1] as string }
        })
      } else {
        logger.error(`[getEmoji]: Error getting emoji!`)
        logger.error(`[getEmoji]: ${status} - ${statusText}`)

        return []
      }
    } catch (error) {
      logger.error(`[getEmoji+catch]: Error getting emoji!`, { error })
      throw error
    }
  }

  public async getEmojiWithRetries(retries: number = 5): Promise<EmojiEntry[]> {
    return promiseRetry<EmojiEntry[]>(
      retry => {
        return promiseTimeout<EmojiEntry[]>({
          message: 'Request timed out.',
          delay: '5s',
          promise: this.getLatestEmoji(),
        }).catch(retry)
      },
      { retries },
    )
  }
}

import { describe, expect, it } from 'bun:test'
import { app } from '../src'

const BaseURL = `http://localhost:${app.server?.port}`
console.log(`BaseURL: ${BaseURL}`)

type EmojiEndpointResponse = {
  count: number
  updated: string
}

describe('/emoji Endpoint', async () => {
  const response: EmojiEndpointResponse = await app
    .handle(new Request(`${BaseURL}/emoji`))
    .then((res: Response) => res.json())

  it('returns a response', async () => {
    expect(response).not.toBeNull()
  })

  it('returns an object', async () => {
    expect(response.toString()).toBe('[object Object]')
  })

  it('returns a count property', async () => {
    expect(response.count).toBeNumber()
  })

  it('returns an updated property', async () => {
    expect(response.count).toBeNumber()
  })
})

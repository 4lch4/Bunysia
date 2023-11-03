export function getConfig() {
  const upstashUrl = process.env.UPSTASH_URL
  const upstashToken = process.env.UPSTASH_TOKEN
  const slackAuthToken = process.env.SLACK_AUTH_TOKEN

  if (!upstashUrl) throw new Error('[Config#getConfig]: UPSTASH_URL is not set.')
  if (!upstashToken) throw new Error('[Config#getConfig]: UPSTASH_TOKEN is not set.')
  if (!slackAuthToken) throw new Error('[Config#getConfig]: SLACK_AUTH_TOKEN is not set.')

  return { slackAuthToken, upstashToken, upstashUrl }
}

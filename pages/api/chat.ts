// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

type Data = {
  message?: ChatCompletionRequestMessage
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let message: ChatCompletionRequestMessage[] = req.body.message
  if (message.length < 1)
    return res.status(400).json({ error: 'No message provided' })
  if (message.length > 50) message = message.slice(-50)
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: message,
  })
  return res.status(200).json({ message: completion.data.choices[0].message })
}

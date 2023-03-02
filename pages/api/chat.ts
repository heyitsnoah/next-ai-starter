// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

type Data = {
  message: string | undefined
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Grab the data from the post request body
  const { message } = req.body
  if (!message) return res.status(400).json({ message: 'No message provided' })
  console.log(message)
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
  })
  console.log(completion.data.choices[0].message?.content)
  return res
    .status(200)
    .json({ message: completion.data.choices[0].message?.content })
}

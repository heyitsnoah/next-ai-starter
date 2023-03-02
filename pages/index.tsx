import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {
  Box,
  Button,
  Container,
  Skeleton,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { ChatCompletionRequestMessage } from 'openai'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // use chakra toast
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [chatSession, setChatSession] = useState<
    { role: string; content: string }[]
  >([])
  const chatInput = useRef<HTMLTextAreaElement>(null)
  const getChatResponse = async () => {
    setIsLoading(true)

    const chatInputValue = chatInput.current?.value
    chatInput.current!.value = ''
    if (!chatInputValue) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setIsLoading(false)
      return
    }
    let currentSession = [
      ...chatSession,
      { role: 'user', content: chatInputValue },
    ]

    setChatSession(currentSession)
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: currentSession }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      setIsLoading(false)
      return
    }
    const data = await response.json()
    currentSession = [...currentSession, data.message]

    setChatSession(currentSession)
    setIsLoading(false)
  }
  return (
    <>
      <Head>
        <title>AI Starter</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <VStack my={'3'} align={'baseline'} spacing={'3'}>
          {chatSession.length > 0
            ? chatSession.map((message, index) => (
                <Box display={'flex'} whiteSpace={'pre-line'} key={index}>
                  <Text
                    mr={'1'}
                    fontWeight={'bold'}
                    textTransform={'capitalize'}
                  >
                    {message.role}:{' '}
                  </Text>
                  <Text>{message.content.trim()}</Text>
                </Box>
              ))
            : null}
        </VStack>
        {isLoading ? (
          <Box mb={'3'}>
            <Skeleton height="20px" />
          </Box>
        ) : null}
        <Textarea ref={chatInput} />
        <Button
          onClick={() => {
            getChatResponse()
          }}
        >
          Submit
        </Button>
      </Container>
    </>
  )
}

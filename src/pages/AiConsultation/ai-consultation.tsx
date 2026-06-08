import { useState, useEffect, useRef } from 'react'
import styles from './ai-consultation.module.css'
import { api } from '../../config/api/api'
import { queryAiModel } from '../../utils/aiQuery'
import { Funcionarios } from '../Funcionarios/Funcionarios'
import { handleAlertMessage } from '../../utils/handleAlertMessage'
import { FaMicrophone, FaPaperPlane } from "react-icons/fa"
import { AiChartRenderer } from '../../components/AiCharts'

interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: Date
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

export function AiConsultation() {
  const [question, setQuestion] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Olá! Sou seu assistente de I.A do GISI. Como posso ajudar você hoje com as informações dos funcionários?\n\nExperimente me pedir informações consolidadas ou gráficos como:\n- "Gere um gráfico de pizza da quantidade de funcionários por sexo"\n- "Qual a média salarial por setor em formato de gráfico de barras?"\n- "Mostre a quantidade de admissões por ano em um gráfico de linha"',
      timestamp: new Date()
    }
  ])
  const [funcionarios, setFuncionarios] = useState<Funcionarios[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [recording, setRecording] = useState<boolean>(false)
  
  const recognitionRef = useRef<any>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Fetch employees on mount
  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await api.get('/funcionarios')
        setFuncionarios(response.data)
      } catch (error) {
        console.error('Erro ao carregar funcionários para consulta:', error)
      }
    }
    fetchFuncionarios()
  }, [])

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Setup voice recording
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.lang = 'pt-BR'
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false

    recognitionRef.current.onstart = () => {
      setRecording(true)
    }

    recognitionRef.current.onend = () => {
      setRecording(false)
    }

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = ''
      for (let i = event.results.length - 1; i >= 0; i--) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript
        }
      }
      if (transcript) {
        setQuestion((prev) => prev + (prev ? ' ' : '') + transcript)
      }
    }

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      handleAlertMessage(`Erro na gravação: ${event.error}`, 'error')
      setRecording(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      handleAlertMessage('Seu navegador não suporta gravação de voz', 'error')
      return
    }
    if (recording) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim()) {
      handleAlertMessage('Por favor, digite uma pergunta', 'error')
      return
    }

    const questionToSend = question
    setQuestion('') // clear input immediately

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: 'user',
      text: questionToSend,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      let currentFuncionarios = funcionarios
      if (currentFuncionarios.length === 0) {
        const response = await api.get('/funcionarios')
        currentFuncionarios = response.data
        setFuncionarios(currentFuncionarios)
      }

      // Prepare history for API (sender and text only)
      const history = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }))

      const aiResponse = await queryAiModel(questionToSend, currentFuncionarios, history)

      const aiMessage: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      handleAlertMessage('Erro ao obter resposta da I.A. Tente novamente.', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e as any)
    }
  }

  // Parse AI response to separate text and chart JSON blocks
  const renderMessageContent = (text: string) => {
    const regex = /```chart([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        })
      }
      parts.push({
        type: 'chart',
        content: match[1].trim()
      })
      lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      })
    }

    return parts.map((part, index) => {
      if (part.type === 'chart') {
        try {
          const config = JSON.parse(part.content)
          return <AiChartRenderer key={`chart-${index}`} config={config} />
        } catch (e) {
          console.error("Erro ao fazer o parse do JSON do gráfico:", e, part.content)
          return (
            <div key={`chart-error-${index}`} className="alert alert-danger p-2 my-2 rounded" style={{ fontSize: '0.85rem' }}>
              Erro ao processar estrutura do gráfico.
            </div>
          )
        }
      } else {
        return (
          <div key={`text-${index}`} className={styles.textPart}>
            {part.content.split('\n').map((line, lineIdx) => {
              if (!line.trim()) return <div key={lineIdx} className="mb-2" />
              return (
                <p key={lineIdx} className="mb-2">
                  {line}
                </p>
              )
            })}
          </div>
        )
      }
    })
  }

  return (
    <div className={styles.container}>
      <h1 className="mb-4">
        <span className="text-primary">Consulta com I.A</span>
      </h1>

      <div className={styles.chatWrapper}>
        {/* Messages Area */}
        <div className={styles.chatArea}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageWrapper} ${
                msg.sender === 'user' ? styles.userWrapper : styles.aiWrapper
              }`}
            >
              <div
                className={`${styles.messageBubble} ${
                  msg.sender === 'user' ? styles.userBubble : styles.aiBubble
                }`}
              >
                {msg.sender === 'ai' ? (
                  renderMessageContent(msg.text)
                ) : (
                  <p className="mb-0">{msg.text}</p>
                )}
                <span className={styles.timestamp}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.messageWrapper} ${styles.aiWrapper}`}>
              <div className={`${styles.messageBubble} ${styles.aiBubble} ${styles.loadingBubble}`}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className={styles.inputArea}>
          <form onSubmit={handleSendMessage} className="d-flex gap-2 align-items-center w-100">
            <textarea
              id="question"
              className="form-control flex-grow-1"
              rows={1}
              placeholder="Pergunte algo ou solicite um gráfico sobre os funcionários..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || recording}
              style={{ resize: 'none' }}
            />
            
            <button
              type="button"
              className={`btn d-flex align-items-center justify-content-center ${
                recording ? 'btn-danger' : 'btn-outline-secondary'
              } ${styles.recordButton} ${recording ? styles.recordButtonPulsing : ''}`}
              onClick={toggleRecording}
              disabled={loading}
              title={recording ? 'Parar gravação' : 'Gravar áudio'}
            >
              <FaMicrophone size={18} />
            </button>

            <button
              type="submit"
              className="btn btn-primary d-flex align-items-center justify-content-center"
              disabled={loading || recording || !question.trim()}
              style={{ width: '45px', height: '38px', borderRadius: '8px' }}
              title="Enviar mensagem"
            >
              <FaPaperPlane size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

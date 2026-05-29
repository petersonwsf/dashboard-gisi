import { useState, useEffect, useRef } from 'react'
import styles from './ai-consultation.module.css'
import { api } from '../../config/api/api'
import { queryAiModel } from '../../utils/aiQuery'
import { Funcionarios } from '../Funcionarios/Funcionarios'
import { handleAlertMessage } from '../../utils/handleAlertMessage'

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

export function AiConsultation() {
  const [question, setQuestion] = useState<string>('')
  const [response, setResponse] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [recording, setRecording] = useState<boolean>(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      handleAlertMessage('Navegador não suporta gravação de áudio', 'error')
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
    if (recording) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim()) {
      handleAlertMessage('Por favor, digite uma pergunta', 'error')
      return
    }

    setLoading(true)
    setResponse('')

    try {
      const funcionariosResponse = await api.get('/funcionarios')
      const funcionarios: Funcionarios[] = funcionariosResponse.data

      const aiResponse = await queryAiModel(question, funcionarios)
      setResponse(aiResponse)
      setQuestion('')
    } catch (error) {
      handleAlertMessage('Erro ao processar sua pergunta. Tente novamente.', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className="mb-4">
        <span className="text-primary">Consulta com I.A</span>
      </h1>

      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="question" className="form-label fw-semibold">
              Sua pergunta:
            </label>
            <textarea
              id="question"
              className="form-control"
              rows={4}
              placeholder="Digite sua pergunta sobre os funcionários ou use o botão de gravação..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading || recording}
              style={{ resize: 'none' }}
            />
          </div>

          <div className="d-flex gap-2 mb-3">
            <button
              type="submit"
              className="btn btn-primary flex-grow-1"
              disabled={loading || recording}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Processando...
                </>
              ) : (
                'Enviar'
              )}
            </button>
            <button
              type="button"
              className={`btn ${recording ? 'btn-danger' : 'btn-outline-secondary'}`}
              onClick={toggleRecording}
              disabled={loading}
              title="Clique para gravar ou parar"
            >
              <i className={`bi bi-${recording ? 'stop-circle-fill' : 'mic'}`}></i>
              {recording ? ' Parando...' : ' Gravar Áudio'}
            </button>
          </div>
        </form>

        {response && (
          <div className={styles.responseSection}>
            <h5 className="fw-semibold text-primary mb-3">Resposta da I.A:</h5>
            <div className={styles.responseContent}>
              {response.split('\n').map((line, index) => (
                <p key={index} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {!response && !loading && (
          <div className={styles.emptyState}>
            <p className="text-muted">Faça uma pergunta sobre os funcionários da empresa...</p>
          </div>
        )}
      </div>
    </div>
  )
}

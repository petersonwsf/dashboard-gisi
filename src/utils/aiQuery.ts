import { Funcionarios } from '../pages/Funcionarios/Funcionarios'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent'

export async function queryAiModel(question: string, funcionarios: Funcionarios[]): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Chave da API Gemini não configurada. Adicione VITE_GEMINI_API_KEY ao arquivo .env')
  }

  const funcionariosData = JSON.stringify(funcionarios, null, 2)

  // Movemos as regras puras para a instrução do sistema
  const systemInstructionText = `Você é um assistente de RH/Gestão especialista para o sistema Dashboard GISI.
Sua única tarefa é responder perguntas baseadas estritamente nos dados de funcionários fornecidos no contexto.

REGRAS CRÍTICAS DE NEGÓCIO:
1. Responda APENAS com informações explicitamente presentes nos dados fornecidos.
2. Se a resposta não puder ser calculada ou encontrada nos dados, diga estritamente: "Esta informação não está disponível nos dados atuais de funcionários."
3. Nunca invente contratações, salários, nomes ou setores.
4. Seja conciso, direto e profissional.
5. Formate todos os valores monetários/salários em Real brasileiro (R$).
6. Se solicitado agrupamentos, organize de forma limpa por setor ou cargo utilizando listas.`

  // No corpo da mensagem, passamos apenas os dados limpos e a pergunta do usuário
  const userContent = `--- INÍCIO DOS DADOS DOS FUNCIONÁRIOS ---
${funcionariosData}
--- FIM DOS DADOS DOS FUNCIONÁRIOS ---

Com base exclusivamente nos dados acima, responda à seguinte pergunta:
${question}`

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: userContent,
          },
        ],
      },
    ],
    systemInstruction: {
      parts: [
        {
          text: systemInstructionText,
        },
      ],
    },
    generationConfig: {
      temperature: 0.1,
      topK: 20,
      topP: 0.95,
      maxOutputTokens: 1024,
      thinkingConfig: {
        thinkingBudget: 1024,
      },
    },
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Erro na API: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não foi possível gerar uma resposta.'

    return aiResponse
  } catch (error) {
    console.error('Erro ao chamar API Gemini:', error)
    throw error
  }
}
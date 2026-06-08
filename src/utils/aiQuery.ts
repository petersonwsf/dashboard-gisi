import { Funcionarios } from '../pages/Funcionarios/Funcionarios'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export async function queryAiModel(
  question: string,
  funcionarios: Funcionarios[],
  chatHistory: { sender: 'user' | 'ai'; text: string }[] = []
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Chave da API Gemini não configurada. Adicione VITE_GEMINI_API_KEY ao arquivo .env')
  }

  const funcionariosData = JSON.stringify(funcionarios, null, 2)

  const systemInstructionText = `Você é um assistente de RH/Gestão especialista para o sistema Dashboard GISI.
Sua única tarefa é responder perguntas baseadas estritamente nos dados de funcionários fornecidos no contexto.

DADOS DOS FUNCIONÁRIOS ATUAIS:
${funcionariosData}

REGRAS CRÍTICAS DE NEGÓCIO:
1. Responda APENAS com informações explicitamente presentes nos dados fornecidos.
2. Se a resposta não puder ser calculada ou encontrada nos dados, diga estritamente: "Esta informação não está disponível nos dados atuais de funcionários."
3. Nunca invente contratações, salários, nomes ou setores.
4. Seja conciso, direto e profissional.
5. Formate todos os valores monetários/salários em Real brasileiro (R$).
6. Se solicitado agrupamentos, organize de forma limpa por setor ou cargo utilizando listas.

CAPACIDADE DE GRÁFICOS:
Você pode (e deve, quando útil ou solicitado pelo usuário) gerar gráficos interativos do Recharts para resumir os dados de funcionários visualmente.
Para fazer isso, insira um bloco de código especial no formato exato abaixo em qualquer parte da sua resposta (geralmente após uma breve explicação em texto):

\`\`\`chart
{
  "type": "bar" | "pie" | "line" | "area",
  "title": "Título Explicativo do Gráfico",
  "xAxisKey": "propriedade_do_eixo_x",
  "dataKey": "propriedade_do_eixo_y_valor",
  "data": [
    { "chave_do_eixo_x": "Label", "chave_do_eixo_y_valor": 123 }
  ]
}
\`\`\`

REGRAS PARA GRÁFICOS:
- Use "bar" para comparações de valores categóricos (ex: salário médio por setor, número de funcionários por escolaridade, etc.).
- Use "pie" para exibir proporções ou divisões percentuais (ex: funcionários por sexo, distribuição por setor se forem poucas categorias).
- Use "line" para mostrar evolução no tempo ou dados ordenados (ex: contratações/admissões de funcionários agrupados por ano).
- Use "area" para gráficos com visual premium de volume ou tendências gerais.
- Agrupe e calcule os dados você mesmo a partir dos funcionários fornecidos antes de montar a propriedade "data". Não envie a lista bruta de funcionários. Por exemplo, se o usuário pedir quantidade por setor, calcule a contagem para cada setor e forneça o array compilado no "data".
- Garanta que o JSON fornecido dentro do bloco \`\`\`chart seja um JSON válido e sem comentários.
- A propriedade "dataKey" deve conter números para que o gráfico possa plotar os valores.
- O campo "xAxisKey" deve conter o nome do campo correspondente ao rótulo.`

  // Constrói o conteúdo com o histórico da conversa
  const contents = [
    ...chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [
        {
          text: msg.text,
        },
      ],
    })),
    {
      role: 'user',
      parts: [
        {
          text: question,
        },
      ],
    },
  ]

  const requestBody = {
    contents: contents,
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
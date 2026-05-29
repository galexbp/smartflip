// WEBAPP CREATED BY ALEXANDER BONE, HTTPS://WWW.ALEXBOPE75.COM
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

function getApiKey() {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('smartflip_api_key');
    if (stored) return stored;
  }
  return import.meta.env.VITE_DEEPSEEK_API_KEY || 'YOUR_DEEPSEEK_API_HERE';
}

const DIFFICULTY_HINTS = {
  easy: 'Nivel básico: conceptos fundamentales, definiciones claras y preguntas directas.',
  medium: 'Nivel intermedio: combina conceptos, requiere comprensión y algo de análisis.',
  hard: 'Nivel avanzado: preguntas desafiantes, matices, excepciones y aplicación profunda.',
};

function parseJsonResponse(content) {
  try {
    return JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No se pudo parsear la respuesta como JSON');
  }
}

async function callDeepSeek(prompt, maxTokens = 3000) {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'YOUR_DEEPSEEK_API_HERE') {
    throw new Error('Configura tu clave API de DeepSeek en Ajustes antes de generar contenido.');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Clave API inválida. Revisa tu clave en Ajustes.');
    }
    throw new Error(`Error de API: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function buildOptionsBlock(count, difficulty) {
  const diffHint = DIFFICULTY_HINTS[difficulty] || DIFFICULTY_HINTS.medium;
  return `
Genera exactamente ${count} elementos.
${diffHint}
Responde ÚNICAMENTE con un array JSON válido. NO incluyas texto fuera del array JSON.`;
}

export const generateFlashcards = async (content, type = 'describe', options = {}) => {
  const { count = 15, difficulty = 'medium' } = options;
  let prompt;

  if (type === 'paste' || type === 'file') {
    prompt = `Eres un asistente educativo especializado en crear tarjetas de estudio efectivas.

Texto a analizar:
${content}

Instrucciones:
1. Identifica los términos y conceptos más importantes del texto
2. Frente conciso (1-10 palabras), reverso claro (máximo 50 palabras)
3. Las tarjetas deben ser educativas y fáciles de estudiar

Formato JSON:
[{"front": "Término", "back": "Definición"}]

${buildOptionsBlock(count, difficulty)}`;
  } else {
    prompt = `Eres un asistente educativo. Crea tarjetas de estudio sobre: "${content}"

Adapta el enfoque al tema (ubicaciones, historia, ciencia, idiomas, etc.).
Frente conciso, reverso educativo (máximo 50 palabras).

Formato JSON:
[{"front": "Término", "back": "Definición"}]

${buildOptionsBlock(count, difficulty)}`;
  }

  const raw = await callDeepSeek(prompt, 2500);
  return parseJsonResponse(raw);
};

export const generateQuiz = async (content, type = 'describe', options = {}) => {
  const { count = 15, difficulty = 'medium' } = options;
  let prompt;

  const formatHint = `Formato JSON:
[{"question": "...", "options": ["A","B","C","D"], "correctAnswer": 0, "explanation": "..."}]`;

  if (type === 'paste' || type === 'file') {
    prompt = `Crea preguntas de opción múltiple (4 opciones, una correcta) basadas en:

${content}

Cada pregunta: enunciado claro, 4 opciones plausibles, índice correctAnswer (0-3), explicación breve.

${formatHint}
${buildOptionsBlock(count, difficulty)}`;
  } else {
    prompt = `Crea preguntas de opción múltiple sobre el tema: "${content}"

4 opciones por pregunta, una correcta, explicación breve.

${formatHint}
${buildOptionsBlock(count, difficulty)}`;
  }

  const raw = await callDeepSeek(prompt, 3500);
  return parseJsonResponse(raw);
};

export const generatePracticeTest = async (content, type = 'describe', options = {}) => {
  const { count = 20, difficulty = 'medium' } = options;
  let prompt;

  const formatHint = `Formato JSON con tipos "multiple", "truefalse", "fill", "match".
Incluye al menos una pregunta de cada tipo en la mezcla.`;

  if (type === 'paste' || type === 'file') {
    prompt = `Crea una prueba práctica mixta basada en:

${content}

Tipos: multiple (4 opciones), truefalse, fill (texto), match (options + matches + correctAnswer array).

${formatHint}
${buildOptionsBlock(count, difficulty)}`;
  } else {
    prompt = `Crea una prueba práctica mixta sobre: "${content}"

Tipos: multiple, truefalse, fill, match. Variedad de formatos.

${formatHint}
${buildOptionsBlock(count, difficulty)}`;
  }

  const raw = await callDeepSeek(prompt, 4500);
  return parseJsonResponse(raw);
};

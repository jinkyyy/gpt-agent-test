const express = require('express');
const router = express.Router();
const { buildPrompt } = require('../utils/promptBuilder');
const classifyInput = require('../utils/classifyInput');
const { searchMemory } = require('../utils/memoryClient'); // 또는 supabase 기반 memoryClient
const { askGPT } = require('../utils/gpt'); // OpenAI API 호출 함수가 여기에 들어간다고 가정

router.post('/respond', async (req, res) => {
  const userInput = req.body.userInput;
  const characterName = req.body.character || 'fairy';

  if (!userInput) {
    return res.status(400).json({ error: 'userInput is required' });
  }

  // 1. 상황 분류
  const situation = classifyInput(userInput);

  // 2. 기억 검색
  const memoryRaw = await searchMemory(userInput);
  const memory = memoryRaw.map(m => ({
    topic: m.topic || '기타',
    content: m.content
  }));

  // 3. 프롬프트 생성
  const prompt = await buildPrompt({ characterName, userInput, memory, situation });

  // 4. GPT 응답 생성
  const gptResponse = await askGPT(prompt);

  // 5. GPT 커스텀 액션 스펙에 맞는 응답 반환
  res.json({ result: gptResponse });
});

module.exports = router;

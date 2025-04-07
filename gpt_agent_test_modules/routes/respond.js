const express = require('express');
const router = express.Router();
const { buildPrompt } = require('../utils/promptBuilder');
const classifyInput = require('../utils/classifyInput');
const { searchMemory } = require('../utils/memoryClient'); // Supabase 기반

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

  // 4. GPT API는 사용하지 않으므로 프롬프트 텍스트 그대로 전달
  res.json({ result: prompt });
});

module.exports = router;

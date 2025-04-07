const express = require('express');
const router = express.Router();
const { searchMemory } = require('../utils/memoryClient');
const { buildPrompt } = require('../utils/promptBuilder');
const classifyInput = require('../utils/classifyInput');
const path = require('path');

router.post('/respond', async (req, res) => {
  const userInput = req.body.message;
  const characterName = req.query.character || 'fairy'; // 쿼리에서 캐릭터명 추출, 기본값 'fairy'

  // [1] 상황 분류
  const situation = classifyInput(userInput);

  // [2] 기억 검색
  const memoryRaw = await searchMemory(userInput);
  const memory = memoryRaw.map(m => ({
    topic: m.topic || '기타',
    content: m.content
  }));

  // [3] 프롬프트 구성
  const prompt = await buildPrompt({
    characterName,
    userInput,
    memory,
    situation
  });

  // [4] GPT 호출은 목업
  const reply = `<< Render API 응답 예시 >>\n${prompt.slice(-300)}...`;

  res.json({ reply });
});

module.exports = router;

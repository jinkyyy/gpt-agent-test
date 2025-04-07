const express = require('express');
const router = express.Router();
const { searchMemory } = require('../utils/memoryClient');
const { buildPrompt } = require('../utils/promptBuilder');
const classifyInput = require('../utils/classifyInput');
const path = require('path');

router.post('/respond', async (req, res) => {
  const userInput = req.body.message;

  // [1] 상황 분류
  const situation = classifyInput(userInput);

  // [2] 기억 검색 (상황 대신 입력 기반)
  const memoryRaw = await searchMemory(userInput);
  const memory = memoryRaw.map(m => ({
    topic: m.topic || '기타',
    content: m.content
  }));

  // [3] 프롬프트 구성
  const characterPath = path.join(__dirname, '../Fairy_Character_Sheet_v3.json');
  const dialoguePath = path.join(__dirname, '../data/dialogue_samples_fairy.json');

  const prompt = buildPrompt({
    characterPath,
    dialoguePath,
    situation,
    memory,
    userInput
  });

  // [4] GPT 호출은 별도 처리 예정
  const reply = `<< Render API 응답 예시 >>\n${prompt.slice(-300)}...`;

  res.json({ reply });
});

module.exports = router;

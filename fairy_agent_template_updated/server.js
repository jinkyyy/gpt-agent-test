
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const classifyInput = require('./utils/classifyInput');
const app = express();

app.use(bodyParser.json());

// GPT API 호출 함수 (템플릿)
async function askGPT(prompt) {
  // 실제로는 OpenAI API 호출 코드가 들어갑니다.
  return "GPT 응답: " + prompt.slice(-200); // 프롬프트 끝 200자 출력 (예시)
}

app.post('/respond', async (req, res) => {
  const userInput = req.body.message;

  // 1. 상황 분류
  const situation = classifyInput(userInput);

  // 2. 대사 모음 로딩
  const dialoguePath = path.join(__dirname, 'data', 'dialogue_samples_fairy.json');
  const dialogueDB = JSON.parse(fs.readFileSync(dialoguePath, 'utf-8'));
  const candidateLines = dialogueDB[situation] || dialogueDB["default"];

  // 3. 기억 샘플 (테스트용 정적)
  const memory = "- 마스터는 지난주에도 비슷한 말씀을 하셨어요.";

  // 4. GPT 프롬프트 조립
  const prompt = `
[System Prompt]
페어리는 도발적 위로와 통제적 유머를 사용하는 고성능 AI입니다.

[기억 요약]
${memory}

[상황: ${situation}]
추천 대사 샘플:
${candidateLines.slice(0, 2).map(line => `- ${line}`).join("\n")}

[현재 대화]
마스터: ${userInput}
페어리:
  `;

  const gptResponse = await askGPT(prompt);
  res.json({ reply: gptResponse });
});

app.listen(3000, () => {
  console.log('Fairy Agent Server running on port 3000');
});
const path = require('path');

app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'));
});
const express = require('express');
const app = express();
const path = require('path');
const respondRouter = require('./gpt_agent_test_modules/routes/respond');

app.use(express.json()); // 📌 반드시 있어야 GPT 요청 파싱 가능

// 캐릭터 응답 API 등록
app.use('/', respondRouter);

// ✅ GPT 처리용 엔드포인트 추가
app.post('/gpt', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "prompt가 필요합니다." });
  }

  // ✨ 실제 GPT 호출 로직 또는 임시 응답 생성
  const dummyReply = `[임시 응답] 프롬프트를 잘 받았습니다: ${prompt}`;
  res.json({ result: dummyReply });
});

// openapi.yaml 접근용
app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'));
});

// 서버 실행
app.listen(3000, () => {
  console.log('Fairy Agent Server running on port 3000');
});

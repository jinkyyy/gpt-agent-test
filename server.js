const express = require('express');
const app = express();
const path = require('path');
const respondRouter = require('./routes/respond');

app.use(express.json()); // 📌 반드시 있어야 GPT 요청 파싱 가능

// 캐릭터 응답 API 등록
app.use('/', respondRouter);

// openapi.yaml 접근용
app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'));
});

// 서버 실행
app.listen(3000, () => {
  console.log('Fairy Agent Server running on port 3000');
});

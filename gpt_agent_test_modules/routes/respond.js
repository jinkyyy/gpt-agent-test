const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { searchMemory } = require("../utils/memoryClient");
const { buildPrompt } = require("../utils/promptBuilder");

// ✅ 외부 GPT 처리용 Render API 주소 (사용자 입력 필요)
const GPT_RENDER_API_URL = "https://gpt-agent-test.onrender.com/gpt"; // ← 여기 직접 입력

// GPT 호출 함수
async function askRenderAPI(prompt) {
  try {
    const response = await axios.post(
      GPT_RENDER_API_URL,
      { prompt },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.result || "[Render 응답 없음]";
  } catch (err) {
    console.error("Render GPT API 호출 실패:", err.response?.data || err.message);
    return "[Render API 호출 오류]";
  }
}

// 메인 응답 엔드포인트
router.post("/respond", async (req, res) => {
  try {
    const { userInput, character } = req.body;
    if (!userInput || !character) {
      return res.status(400).json({ error: "userInput과 character가 필요합니다." });
    }

    // 상황 정의 및 기억 검색
    const memory = await searchMemory(userInput);

    // 프롬프트 생성
    const prompt = await buildPrompt({
      characterName: character,
      userInput,
      memory,
    });

    // GPT 호출
    const gptReply = await askRenderAPI(prompt);
    res.json({ result: gptReply });
  } catch (err) {
    console.error("Respond API error:", err);
    res.status(500).json({ error: "응답 생성 중 오류 발생" });
  }
});

module.exports = router;

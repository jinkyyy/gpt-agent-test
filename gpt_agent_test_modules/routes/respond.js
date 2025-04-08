
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { searchMemory } = require("../utils/memoryClient");
const { classifyInput } = require("../../utils/classifyInput");
const { buildPrompt } = require("../utils/promptBuilder");

// Render API를 통한 GPT 호출
async function askRenderAPI(prompt) {
  try {
    const response = await axios.post(
      "https://fairy-agent.onrender.com/respond", // 당신의 Render API 주소
      { prompt },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.result || "[Render 응답 없음]";
  } catch (err) {
    console.error("Render GPT API 호출 실패:", err.response?.data || err.message);
    return "[Render API 호출 오류]";
  }
}

router.post("/respond", async (req, res) => {
  try {
    const { userInput, character } = req.body;
    if (!userInput || !character) {
      return res.status(400).json({ error: "userInput과 character가 필요합니다." });
    }

    const situation = classifyInput(userInput);
    const memory = await searchMemory(userInput);

    const dialoguePath = path.join(__dirname, "../data/dialogue_samples_fairy.json");
    const dialogue = JSON.parse(fs.readFileSync(dialoguePath, "utf-8"));
    const sampleDialogue = dialogue[situation] || [];

    const prompt = await buildPrompt({
      characterName: character,
      userInput,
      memory,
      situation,
      dialogueSamples: sampleDialogue,
    });

    const gptReply = await askRenderAPI(prompt);
    res.json({ result: gptReply });
  } catch (err) {
    console.error("Respond API error:", err);
    res.status(500).json({ error: "응답 생성 중 오류 발생" });
  }
});

module.exports = router;

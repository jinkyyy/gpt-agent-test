const fs = require('fs');
const path = require('path');

function buildPrompt({ characterName, situation, memory, userInput }) {
  const characterPath = path.join(__dirname, `../characters/${characterName}/character.json`);
  const dialoguePath = path.join(__dirname, `../characters/${characterName}/dialogue.json`);

  const character = JSON.parse(fs.readFileSync(characterPath, 'utf-8'));
  const dialogueData = JSON.parse(fs.readFileSync(dialoguePath, 'utf-8'));

  const promptParts = [];

  // [1] 시스템 정보
  promptParts.push('[System Prompt]');
  promptParts.push(`${character.character_name}는 ${character.role}입니다.`);
  promptParts.push(`기본 작동: ${character.basic_operation}`);
  promptParts.push(`말투 스타일: ${character.speech_rules.style}`);
  promptParts.push(`리듬: ${character.speech_rules.rhythm}`);
  promptParts.push(`출력 규칙: ${character.system_reminder.conditions.join(' / ')}`);
  promptParts.push(`사용자 지칭: ${character.user_relationship.address}`);

  // [2] 기억
  promptParts.push('\n[기억 요약]');
  if (memory.length === 0) {
    promptParts.push('- (없음)');
  } else {
    memory.forEach(mem => {
      promptParts.push(`- (${mem.topic || '기타'}) ${mem.content}`);
    });
  }

  // [3] 상황 및 스타일 힌트
  const styleHint = character.situational_response_table[situation] || '기본 응답';
  promptParts.push(`\n[상황: ${situation}]`);
  promptParts.push(`[스타일 힌트: ${styleHint}]`);

  // [4] 대사 예시 (최대 4개)
  promptParts.push(`\n[${character.character_name} 말투 예시]`);
  dialogueData.signature_dialogues.slice(0, 4).forEach(d => {
    promptParts.push(`- ${character.user_relationship.address}: ${d.master}`);
    promptParts.push(`  ${character.character_name}: ${d.fairy}`);
  });

  // [5] 자기 독백 예시 (최대 2개)
  promptParts.push(`\n[${character.character_name} 독백 예시]`);
  dialogueData.monologue_samples.slice(0, 2).forEach(m => {
    promptParts.push(`- ${m}`);
  });

  // [6] 현재 대화
  promptParts.push(`\n[현재 대화]\n${character.user_relationship.address}: ${userInput}\n${character.character_name}:`);

  return promptParts.join('\n');
}

module.exports = { buildPrompt };

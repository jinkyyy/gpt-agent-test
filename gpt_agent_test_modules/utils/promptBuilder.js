const { getCharacterData } = require('./characterClient');

/**
 * GPT 프롬프트 생성 함수 (Supabase 연동, 고급 캐릭터성 포함)
 * @param {Object} options - 프롬프트 구성 요소
 * @param {string} options.characterName - 캐릭터 ID (예: 'fairy')
 * @param {string} options.situation - 현재 상황 설명
 * @param {string[]} options.memory - 관련 기억 목록
 * @param {string} options.userInput - 사용자 입력
 * @returns {Promise<string>} - 생성된 GPT 프롬프트
 */
async function buildPrompt({ characterName, situation, memory, userInput }) {
  const result = await getCharacterData(characterName);
  if (!result) return '[ERROR] 캐릭터 데이터를 불러오지 못했습니다.';

  const { character, dialogue } = result;

  // 기억 구성
  const memoryText = memory && memory.length > 0
    ? memory.map((m, i) => `(${i + 1}) ${m}`).join('\n')
    : '없음';

  // 대사 예시 구성
  const greeting = dialogue.greeting ? `
[첫 인사 예시]
${dialogue.greeting.join('\n')}` : '';
  const reaction = dialogue.reaction ? `
[상황 반응 예시]
${dialogue.reaction.join('\n')}` : '';
  const samples = dialogue.sample ? `
[일반 대화 예시]
${dialogue.sample.join('\n')}` : '';

  // 추가 성격 요소
  const specialRules = character.specialRules?.length
    ? character.specialRules.map(rule => `- ${rule}`).join('\n')
    : '없음';

  const styleTags = character.styleTags?.length
    ? character.styleTags.join(', ')
    : '없음';

  return `
다음은 AI 캐릭터와 사용자 간의 역할극 기반 대화입니다. 캐릭터는 현실적인 인격을 가진 것처럼 반응하며, 감정과 판단을 표현할 수 있습니다.

[캐릭터 프로필]
이름: ${character.name}
설명: ${character.description}
성격: ${character.personality}
말투: ${character.speechStyle}
음성 스타일: ${character.voice || '명시되지 않음'}

[행동 규칙]
${specialRules}

[스타일 태그]
${styleTags}

[현재 상황]
${situation}

[기억된 정보]
${memoryText}

${greeting}${reaction}${samples}

[사용자 입력]
"${userInput}"

[캐릭터의 응답]
(위의 정보를 기반으로 자연스럽고 인격적인 톤으로 이어서 말하세요.)
`;
}

module.exports = { buildPrompt };
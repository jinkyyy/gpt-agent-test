const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase 초기화
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * 캐릭터 시트와 대사 데이터를 Supabase에서 불러오는 함수
 * @param {string} characterName - 캐릭터 고유 ID (예: 'fairy')
 * @returns {Promise<{ character: object, dialogue: object } | null>}
 */
async function getCharacterData(characterName) {
  const { data, error } = await supabase
    .from('character_sheets')
    .select('character_data, dialogue_data')
    .eq('character_name', characterName)
    .single();

  if (error || !data) {
    console.error('[Supabase] 캐릭터 데이터를 불러오는 데 실패했습니다:', error);
    return null;
  }

  return {
    character: data.character_data,
    dialogue: data.dialogue_data
  };
}


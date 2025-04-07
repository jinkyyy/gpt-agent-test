// debugClient.js
// Supabase 연결 및 캐릭터/메모리 디버깅 모드

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testCharacterTable() {
  const { data, error } = await supabase.from('characters').select('*').limit(1);
  if (error) {
    console.error('[❌ characterClient 연결 오류]:', error.message);
  } else {
    console.log('[✅ characterClient 연결 성공]:', data.length ? '데이터 존재' : '빈 테이블');
  }
}

async function testMemoryTable() {
  const { data, error } = await supabase.from('memory').select('*').limit(1);
  if (error) {
    console.error('[❌ memoryClient 연결 오류]:', error.message);
  } else {
    console.log('[✅ memoryClient 연결 성공]:', data.length ? '메모리 있음' : '메모리 없음');
  }
}

async function testCharacterQuery(characterName) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('character_name', characterName)
    .single();

  if (error) {
    console.error(`[🧨 캐릭터 "${characterName}" 불러오기 실패]:`, error.message);
  } else if (!data) {
    console.warn(`[⚠️ 캐릭터 "${characterName}" 데이터 없음]`);
  } else {
    console.log(`[✅ 캐릭터 "${characterName}" 데이터 불러오기 성공]`, data);
  }
}

// 실행
(async () => {
  console.log('\n=== 🔍 Supabase 디버그 시작 ===\n');
  await testCharacterTable();
  await testMemoryTable();
  await testCharacterQuery('fairy'); // 기본 디버깅 캐릭터 이름
  console.log('\n=== ✅ 디버그 완료 ===\n');
})();

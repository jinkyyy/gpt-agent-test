
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function rememberMemory(topic, content) {
  const { error } = await supabase
    .from('memory')
    .insert([{ topic, content }]);
  if (error) console.error('Error saving memory:', error);
  return !error;
}

async function searchMemory(keyword) {
  const { data, error } = await supabase
    .from('memory')
    .select()
    .ilike('content', `%${keyword}%`);
  if (error) {
    console.error('Error searching memory:', error);
    return [];
  }
  return data;
}

module.exports = {
  rememberMemory,
  searchMemory,
};

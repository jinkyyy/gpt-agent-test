
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient('url', 'anon key');

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

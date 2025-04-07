
module.exports = function classifyInput(text) {
  if (/우울|힘들|피곤/.test(text)) return "anxiety_worry";
  if (/검색|정보|어떻게/.test(text)) return "information_request";
  return "default";
};

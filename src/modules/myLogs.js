const error = (text) => {
  console.log(`Error: ${text}`);
  return text;
};

const info = (text) => {
  console.log(`Info: ${text}`);
  return text;
};

module.exports.error = error;
module.exports.info = info;

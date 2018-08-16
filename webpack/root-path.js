const path = require('path');

function getRootPath(dir) {
  return path.resolve(path.join(dir, '..'));
}

module.exports = getRootPath;

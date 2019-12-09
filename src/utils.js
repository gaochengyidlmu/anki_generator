function color(s, type) {
  const types = {
    red: ['\x1B[1;31m', '\x1B[0m'],
    green: ['\x1b[1;32m', '\x1B[0m'],
    yellow: ['\x1b[1;33m', '\x1B[0m'],
    blue: ['\x1b[1;34m', '\x1B[0m'],
    pink: ['\x1b[1;35m', '\x1B[0m'],
    gray: ['\x1b[0;37m', '\x1B[0m'],
  };

  if (!types[type]) return s;
  return types[type][0] + s + types[type][1];
}

exports.color = color;

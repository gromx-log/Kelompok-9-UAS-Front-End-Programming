// Helper untuk matching route dengan params (misal: /api/products/:id)
function matchRoute(pattern, url) {
  // Convert pattern "/api/products/:id" jadi regex
  const paramNames = [];
  const regexPattern = pattern.replace(/:([a-zA-Z]+)/g, (match, paramName) => {
    paramNames.push(paramName);
    return '([^/]+)'; // Match anything except slash
  });

  const regex = new RegExp(`^${regexPattern}$`);
  const match = url.match(regex);

  if (!match) return null;

  // Extract params
  const params = {};
  paramNames.forEach((name, index) => {
    params[name] = match[index + 1];
  });

  return params;
}

module.exports = { matchRoute };
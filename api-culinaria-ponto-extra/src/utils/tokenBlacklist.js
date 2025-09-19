const blacklist = new Set();

export const adicionarBlacklist = (token) => blacklist.add(token);
export const verificarBlacklist = (token) => blacklist.has(token);

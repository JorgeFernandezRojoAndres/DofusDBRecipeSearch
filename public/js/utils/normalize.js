// utils/normalize.js
export function normalize(text) {
  return text.toLowerCase()
             .normalize("NFD")
             .replace(/[\u0300-\u036f]/g, "")
             .replace(/\s+/g, "-")
             .replace(/[^a-z0-9-]/g, "");
}

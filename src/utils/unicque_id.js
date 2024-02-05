export default function generateUniqueId() {
  return '_' + Math.random().toString(36).slice(2, 11);
}
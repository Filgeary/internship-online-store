export default function get(object, path) {
  const _path = Array.isArray(path) ? path : path.split(".");
  if (object && _path.length > 1) {
    const key = _path.splice(0, 1).join('');
    return get(object[key], _path);
  }
  return object[path];
};

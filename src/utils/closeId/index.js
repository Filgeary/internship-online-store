/**
 * Поиск id для удаления модалки
 * @param {Array} modals 
 * @param {String} name 
 * @returns id
 */
export default function closeId(modals, name) {
    const modal = modals.find((item) => item.name === name)
    return modal.id
  }
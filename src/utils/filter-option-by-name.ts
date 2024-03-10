interface Options {
  title: string;
  [key: string]: any; // остальные поля могут быть любого типа
}

export default function filterOptionByName (options: Options[], value: string): Options[] {
  return options.filter((country) =>
    country.title.toLowerCase().includes(value.toLowerCase())
  ).sort((a, b) => {
    const aIndex = a.title.toLowerCase().indexOf(value.toLowerCase());
    const bIndex = b.title.toLowerCase().indexOf(value.toLowerCase());
    if (aIndex === 0 && bIndex !== 0) {
      return -1;
    } else if (aIndex !== 0 && bIndex === 0) {
      return 1;
    } else if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    } else {
      return 0;
    }
  })
}

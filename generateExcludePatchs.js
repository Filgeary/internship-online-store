/* eslint-disable promise/always-return, no-restricted-syntax, func-names, no-unused-vars, no-console */

// Сделано на основе https://myrusakov.ru/nodejs-read-dir-recursively.html [Михаил Русаков]

const { resolve } = require('path');
const { readdir } = require('fs').promises; // промифицированная версия функций из метода
const { createWriteStream } = require('fs');
const path = require('node:path');

// Путь для обработки
const PATH = './src';
// Путь, от которого будет строиться относительный путь
const CURRENT_DIR = './';
// Имя файла с результатом
const RESULT_FILENAME = 'exclude_paths_generated.txt';

const JSoptions = {
  path: PATH,
  currentDir: CURRENT_DIR,
  resultFilename: RESULT_FILENAME,
  // Список расширений входных файлов, для которых надо добавить исключения
  srcExt: ['.js'],
  // Исключения, которые необходимо создать
  targetExt: ['.js', '.jsx', '.ts', '.tsx'],
};

const CSSoptions = {
  path: PATH,
  currentDir: CURRENT_DIR,
  resultFilename: RESULT_FILENAME,
  srcExt: ['.css'],
  targetExt: ['.css', '.scss', '.less'],
};

/*
Пример обработки:

  - Для файла с таким путём:
    './src/app/article/index.js'

  - Будут созданы следующие пути исключений:

    'src/app/article/index.js'
    'src/app/article/index.jsx'
    'src/app/article/index.ts'
    'src/app/article/index.tsx'

Это нужно, чтобы когда будем переводить js на ts, файл всё равно остался в исключениях,
до тех пор пока мы явно его оттуда не удалим.
*/

// Рекурсивно обходим каталог
async function getFiles(dir) {
  // читаем содержимое директории
  const dirents = await readdir(dir, { withFileTypes: true });
  // проходимся по папкам и, при необходимости, рекурсивно вызываем функцию
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  // преобразуем массив файлов в одномерный
  return files.flat();
}

// Создаём пути исключений
const fileProcessing = (array, opt) => {
  const newArray = [];
  array.forEach((pathStr) => {
    // DOC: https://nodejsdev.ru/api/path/#pathparsepath
    const pathObj = path.parse(pathStr);
    for (const ext of opt.srcExt)
      if (ext === pathObj.ext)
        for (const targetExt of opt.targetExt) {
          const result = { ...pathObj, base: pathObj.base.replace(pathObj.ext, targetExt), ext: targetExt };
          // DOC: https://nodejsdev.ru/api/path/#pathrelativefrom-to
          newArray.push(path.relative(opt.currentDir, path.format(result)));
        }
  });
  return newArray;
};

// Пишем результат в файл
const writeFile = (array, fileName) => {
  const stream = createWriteStream(fileName);
  stream.once('open', function (fd) {
    for (const line of array) stream.write(`${line}\n`);
    stream.end();
  });
};

// Запускаем
getFiles(PATH)
  .then((files) => {
    const jsPaths = fileProcessing(files, JSoptions);
    const cssPaths = fileProcessing(files, CSSoptions);
    writeFile(jsPaths.concat(cssPaths), RESULT_FILENAME);
  })
  .catch((err) => console.error(err));

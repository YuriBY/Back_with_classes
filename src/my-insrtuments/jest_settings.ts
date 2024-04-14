// Установка и настройка библиотек:
// yarn add jest ts-jest @types/jest supertest @types/supertest
// yarn ts-jest config:init

/*
"scripts": {
    "jest": "jest"
},
*/

// В корне проекта создаем папку  __tests__
// В папке  __tests__  создаем файл  name.e2e.test.ts

// В случае, когда число файлов с тестами становится больше одного, как на картинке ниже, возникает ряд проблем.
// Одна из которых - одновременный запуск всех тестовых файлов. Чтобы избежать этой проблемы в файл package.json в scripts нужно подправить команду запуска jest

// создаем новый файл setting.ts, выносим в него export const app = express(), app.use и роуты

/*
 jest.config.ts

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 100000, //от этой ошибки! -> thrown: "Exceeded timeout of 5000 ms for a test.
    testRegex: '.e2e.test.ts$', //<-- чтобы запускались только файлы с расширением ".e2e.test.ts"
}
*/

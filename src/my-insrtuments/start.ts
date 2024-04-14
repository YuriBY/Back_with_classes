//инициализируем node приложение:
// yarn init --yes​

//устанавливаем express:
// yarn add express

// устанавливаем nodemon в devDependencies:
// yarn add nodemon --dev

//устанавливаем typescript и типы для express, node:
// yarn add typescript ts-node @types/node @types/express --dev

// генерируем tsconfig (или создаем вручную файл tsconfig.json в корневой папке проекта):
// yarn tsc --init

// в tsconfig.json указываем путь для образования js файла:
// "outDir": "./dist"
// настройки выглядят так (использовано дополнителбное экранирование - убрать лишние /)
/*
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src//**/ /*"],
  "exclude": ["node_modules", "**/ /*.test.ts"]
}
*/

// в package.json добавляем scripts:
/*
"scripts": {
    "dev": "yarn nodemon --inspect dist/index.js",
    "watch": "tsc -w"
  },
*/

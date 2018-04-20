# Занятие 1 - Continuous Integration

## Цель


## План занятия

* IDE
* разработать простой сервер;
* показать работу с git;
* продемонстрировать работу с unit test;
* продемонстрировать систему автоматической сборки travis;
* автоматическое размертывание на heroku;
* понятие "покрытие кода";
* интеграция с coveralls.


### IDE
Будем использовать кроссплатформенную среду разработки [WebStorm](https://jetbrains.ru/products/webstorm/).

### Simple web server
```js
const http = require('http');

const port = 8000;

function requestHandler(request, response) {
    console.log(request.url);
    response.end(request.url);
}

function listenCallback(err) {
    if (err) {
        return console.log('soemthing bad happened', err)
    }

    console.log(`server is listening on ${port}`)
}

const server = http.createServer(requestHandler);
server.listen(port, listenCallback);
```

_Не используем лямдбы для упрощения восприятия кода_

### Git
```bash
> git init
> git add *.js
> git commit -m "first commit"
> git remote add origin https://github.com/drewxa/demo-01.git
> git push -u origin master
```

Замечаем ошибку `soemthing bad happened`. Исправим её.
```bash
> git commit -m "typo fixed"
```

Изменим порт, на котором висит сервер.
```bash
> git commit -m "changed port"
> git push -u origin master
```

### Server
См [тут](https://github.com/bmstu-iu8-intro-dev/sem-01)

### Unit tests

Установим mocha — это javascript фреймворк для Node.js, который позволяет проводить асинхронное тестирование.
```bash
> npm install --save-dev mocha
```

Создадим папку `test`, в ней файл `filename.ut.js`
```js
let assert = require('assert');
function test(){
    it('description of test', function () {
        assert.equal(true, true);
    });
}
describe('Test isPointInArea', function() {

    describe('description of group tests', test);

});
```

Запуск тестов из командной строки:
```
> mocha
```

Можно запускать тесты из IDE.

### Travis
Автоматизируем сборку/запуск тестов. Для этого воспользуемся сервисом [TravisCI](https://travis-ci.org).

Создадим файл `.travis.yml` в корневой директории репозитория. Содержимое файла:
```
language: node_js
node_js:
  - "node"
```
И изменим файл `package.json`:
```
{
  "devDependencies": {
    "mocha": "~1.4.0"
  },
  "scripts": {
    "test": "mocha"
  }
}
```
Теперь после каждого изменения репозитория TravisCI будет запускать тестирование кода.


### Heroku
* зарегистрируемся на [Heroku](https://heroku.com)
* создадим приложение, назовем его demo-01
* изменим немного код. Строку `server.listen(port, listenCallback);` надо заменить на `server.listen(process.env.PORT || port, listenCallback);`
* установим приложение `travis`

_Инструкция для ubuntu. Если у вас другая система, читайте официальную документацию по установке клиента travis_
```
> sudo apt-get install ruby ruby-dev
> sudo gem install travis
```
* выполним команду
```
cd ПУТЬ_ДО_РЕПОЗИТРИЯ
travis setup heroku
travis encrypt $(heroku auth:token) --add deploy.api_key
git add .travis.yml
git commit
git push
```

Если все прошло успешно, то после каждого изменения репозитория на Github'е сервис TravisCI будет запускать юнит-тестирование и развертывание приложения на платформе Heroku.
Если тестирование завершилось ошибкой, то обновление приложения в Heroku не произойдет.


### Coverage
Что такое "покрытие кода", можно прочитать [по ссылке](http://www.protesting.ru/testing/testcoverage.html)

Чтобы проверить покрытие кода в нашей программе, установим istanbul.
```bash
> npm install --save-dev istanbul
```

### Coveralls
Установим необходимые пакеты
```bash
> npm install --save-dev mocha-lcov-reporter coveralls
```

Изменим файл `.travis.yml`, добавив в него:
```
after_success:
  - npm run coveralls
```

Изменим файл `package.json`:
```
{
  "devDependencies": {
    "coveralls": "^3.0.0",
    "istanbul": "^0.4.5",
    "mocha": "~1.4.0",
    "mocha-lcov-reporter": "^1.3.0"
  },
  "scripts": {
    "test": "mocha",
    "cover": "istanbul cover _mocha",
    "coveralls": "npm run cover -- --report lcovonly && cat ./coverage/lcov.info | coveralls"
  }
}
```

Зарегистрируемся в [Coveralls.io](https://coveralls.io) и активируем репозиторий с кодом.
С этого момента TravisCI запускает тестирование кода, считает покрытие кода тестами и публикует результат в Coveralls и разворачивает приложение на Heroku.

## Заключение

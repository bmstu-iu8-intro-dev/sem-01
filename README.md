# Занятие 1 - Continuous Integration

## Цель
Цель занятия продемонстрировать базовые практики и принципы разработки, которые позволяют повысить производительность разработчика и взаимодействие команды разработчиков.

## План занятия

* IDE;
* простой сервер;
* работа git;
* демонстрация unit test;
* понятие "покрытие кода";
* демонстрация системы автоматической сборки travis;
* автоматическое размертывание на heroku;
* использование docker;
* интеграция с coveralls.


### IDE
На этом занятии будем использовать язык программирования NodeJs и кроссплатформенную среду разработки [WebStorm](https://jetbrains.ru/products/webstorm/).

### Simple web server
Реализуем простой web-сервер
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
Создадим репозиторий на [Github](https://github.com). Для этого выполним в командной строке следующие действия:
```bash
> git init
> git add *.js
> git commit -m "first commit"
> git remote add origin https://github.com/drewxa/demo-01.git
> git push -u origin master
```

Исправим опечатку `soemthing bad happened` и выполним команду
```bash
> git commit -m "typo fixed"
```

Изменим порт, на котором прослушивает соединения сервер.
```bash
> git commit -m "changed port"
> git push -u origin master
```

### Server
Немного усложним сервер. Код смотрите [тут](https://github.com/bmstu-iu8-intro-dev/sem-01).

### Unit tests
Идея модульного тестирования состоит в том, чтобы писать тесты для каждой нетривиальной функции или метода. Это позволяет достаточно быстро проверить, не привело ли очередное изменение кода к регрессии, то есть к появлению ошибок в уже оттестированных местах программы, а также облегчает обнаружение и устранение таких ошибок.

Установим mocha — это javascript фреймворк для Node.js, который позволяет проводить асинхронное тестирование.
```bash
> npm install --save-dev mocha
```

Создадим папку `test`, а в ней файл `filename.ut.js`
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

Тесты можно запускать из IDE, а можно из командной строки, для этого выполните команду:
```bash
> mocha
```

*Замечание*. Если вы считаете, что модульное тестирование _неприменимо_ к вашему коду, то наиболее вероятно вы неправильно декомпозируете код. При корректном проектировании и декомпозиции кода всегда есть возможность применить модульное тестирование.

### Coverage
Под понятием "покрытие кода" можно понимать количественную меру, которая показывает на сколько "хорошо" ваши модульные тесты. Чем больше эта величина, тем лучше. Для больших проектов считается приемлемым покрытие кода около 65%.
Добробнее про "покрытие кода", можно прочитать [по ссылке](http://www.protesting.ru/testing/testcoverage.html).

Чтобы проверить покрытие кода в нашем приложении, установим istanbul.
```bash
> npm install --save-dev istanbul
```

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
    "istanbul": "^0.4.5",
    "mocha": "~1.4.0",
  },
  "scripts": {
    "test": "mocha",
    "cover": "istanbul cover _mocha"
  }
}
```
[![Build Status](https://travis-ci.org/bmstu-iu8-intro-dev/sem-01.svg?branch=master)](https://travis-ci.org/bmstu-iu8-intro-dev/sem-01)

Теперь после каждого изменения репозитория TravisCI будет запускать модульное тестирование кода.


### Heroku
Heroku - это облачная система для запуска веб приложений.

Чтобы использовать Heroku выполним ряд действий:
* зарегистрируемся на [Heroku](https://heroku.com);
* создадим приложение, назовем его demo-01;
* изменим немного код. Строку `server.listen(port, listenCallback)` надо заменить на `server.listen(process.env.PORT || port, listenCallback)`;
* установим приложение `travis` для своей операционной системы;

_Инструкция для ubuntu. Если у вас другая система, читайте официальную документацию по установке клиента travis_
```
> sudo apt-get install ruby ruby-dev
> sudo gem install travis
```
* выполним команду.
```
cd ПУТЬ_ДО_РЕПОЗИТРИЯ
travis setup heroku
travis encrypt $(heroku auth:token) --add deploy.api_key
git add .travis.yml
git commit
git push
```

Если все прошло успешно, то, после каждого изменения в репозитории на Github'е, сервис TravisCI будет запускать юнит-тестирование и развертывание приложения на платформе Heroku.
Если тестирование завершилось ошибкой, то обновление приложения в Heroku не произойдет.

### Docker
Docker — программное обеспечение для автоматизации развёртывания и управления приложениями в среде виртуализации на уровне операционной системы. Позволяет «упаковать» приложение со всем его окружением и зависимостями в контейнер, а также предоставляет среду по управлению контейнерами.

#### Локальная сборка
```bash
> sudo apt-get install docker.io
```

Создадим файл `Dockerfile` в репозитории:
```
FROM node:9.11-alpine

COPY package.json /src/package.json
COPY info.js /src/info.js
COPY server.js /src/server.js

RUN cd /src/ && npm install
CMD cd /src/ && node server.js
```

Проверим корректность:
```bash
> sudo docker build -t demo-01 .
> sudo docker run -p 5000:80 --rm -it demo-01
```
В консоли появится надпись `server is listening on 80`. Для проверки работоспособности перейдем в браузере по ссылке `http://localhost:5000/`

Опубликуем образ на сервисе [Docker](https://docker.com). Для этого надо зарегистрироваться там. А затем выполнить команды:
```bash
> sudo docker build -t $USERNAME/demo-01 .
> sudo docker login -u $USERNAME -p $PASSWORD
> sudo docker push $USERNAME/demo-01
```
* `$USERNAME` - это ваш логин на docker.com
* `$PASSWORD` - это ваш пароль на docker.com

Теперь ваш образ опубликован в репозитории docker.com. Его можно скачивать и запускать на любой машине поддерживающей docker.
```bash
> sudo docker pull $USERNAME/demo-01
> sudo docker run $USERNAME/demo-01
```

#### Автоматическая сборка
Чтобы в репозитории был всегда свежий образ докера, настроим атоматическую выкладку средствами TravisCI.
Для этого в файл `.travi.yml` добавим следующие строки:
```
after_success:
- docker build -f Dockerfile -t $USERNAME/demo-01 .
- docker login -u $USERNAME -p $DOCKER_PASSWORD
- docker push $USERNAME/demo-01
```
`$DOCKER_PASSWORD` -  это пароль от Docker.com, его надо настроить через переменные окружения в Travis

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

[![Coverage Status](https://coveralls.io/repos/github/bmstu-iu8-intro-dev/sem-01/badge.svg)](https://coveralls.io/github/bmstu-iu8-intro-dev/sem-01)

С этого момента TravisCI запускает тестирование кода, считает покрытие кода тестами и публикует результат в Coveralls и разворачивает приложение на Heroku.

## Заключение
На занятии были расмотрены технологии и средства, упрощающие работу разработчика и принимающие на себя часть рутинных задач.
В заключении стоит сказать, что время и силы, потраченные на настраивание системы CI, атоматического тестирования и автоматизации развертывания сервиса, компенсируются при дальнейшей разработки приложения. А модульное тестирование кода поможет предотвратить многие ошибки.

## Самостоятельное задание
Для закрепления пройденного материала:
* разработайте сервис, который ;
* обеспечте покрытие тестами кода не менее 80%;
* настройте TravisCI для автоматической проверки тестов;
* настройте автоматическую сборку докерного образа вашего сервиса из ветки master на github'е;
* настройте автоматическую выкладку вашего сервиса на Heroku из ветки release.

## Полезные ссылки
* [Как создать современную CI/CD-цепочку с помощью бесплатных облачных сервисов](https://habr.com/company/southbridge/blog/329262/)
* [Travis & Heroku](https://docs.travis-ci.com/user/deployment/heroku)
* [Continuously deploy Node apps with GitHub, Travis and Heroku](https://shapeshed.com/continuously-deploy-node-apps-with-github-travis-and-heroku/)
* [Node Hero - Node.js Unit Testing Tutorial](https://blog.risingstack.com/node-hero-node-js-unit-testing-tutorial/)

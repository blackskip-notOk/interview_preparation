# **localStorage && sessionStorage**

## **Ссылки**

* [**localStorage**](#localstorage)
* [**sessionStorage**](#sessionstorage)
* [**Событие storage**](#событие-storage)

***

Веб-сайты, размещенные в браузере, не имеют памяти для хранения данных пользователя. Пользователь, переходящий с одной страницы на другую, каждый раз будет рассматриваться как новый пользователь. Браузер предоставляет различные типы механизмов хранения для решения этой проблемы. Механизм хранения позволяет веб-сайту, отслеживать перемещение пользователя с одной страницы на другую, чтобы не запрашивалась одна и та же информация, которая уже предоставлена сайту.

localStorage, sessionStorage и файлы cookie - это все клиентские решения для хранения, которые хранятся в одном файле в системе пользователя. Данные сеанса хранятся на сервере, на котором размещено приложение / веб-сайт.

Объекты веб-хранилища **localStorage** и **sessionStorage** позволяют хранить пары ключ/значение в браузере.

В отличие от куки, объекты веб-хранилища не отправляются на сервер при каждом запросе. Поэтому мы можем хранить гораздо больше данных. Большинство браузеров могут сохранить как минимум 2 мегабайта данных (или больше), и этот размер можно поменять в настройках.
Ещё одно отличие от куки – сервер не может манипулировать объектами хранилища через HTTP-заголовки. Всё делается при помощи **JavaScript**. Хранилище привязано к источнику (домен/протокол/порт). Это значит, что разные протоколы или поддомены определяют разные объекты хранилища, и они не могут получить доступ к данным друг друга. Объекты хранилища **localStorage** и **sessionStorage** предоставляют одинаковые методы и свойства:

* `setItem(key, value)` – сохранить пару ключ/значение.
* `getItem(key)` – получить данные по ключу `key`.
* `removeItem(key)` – удалить данные с ключом `key`.
* `clear()` – удалить всё.
* `key(index)` – получить ключ на заданной позиции.
* `length` – количество элементов в хранилище.

Интерфейс похож на `Map`, но также запоминается порядок элементов, и можно получить доступ к элементу по индексу.
***

## **localStorage**

Этот объект один на все вкладки и окна в рамках источника (один и тот же домен/протокол/порт - same origin policy). Данные не имеют срока давности, по которому истекают и удаляются (В последних обновлениях Safari разработчики добавили ограничение в 7 дней). Сохраняются после перезапуска браузера и даже ОС. Но, хоть эти данные могут храниться бесконечно в браузере, обычный пользователь может их удалить, например выполнив очистку истории. Если запустить код:

````js
localStorage.setItem('test', 1);
````

закрыть/открыть браузер или открыть ту же страницу в другом окне, то можно получить данные:

````js
alert( localStorage.getItem('test') ); // 1
````

Достаточно находиться на том же источнике (домен/протокол/порт), при этом URL-путь может быть разным. Объект **localStorage** доступен всем окнам из одного источника, поэтому, если мы устанавливаем данные в одном окне, изменения становятся видимыми в другом. Также можно получать/записывать данные, как в обычный объект:

````js
// установить значение для ключа
localStorage.test = 2;
// получить значение по ключу
alert( localStorage.test ); // 2
// удалить ключ
delete localStorage.test;
````

Это возможно по историческим причинам и, как правило, работает, но обычно не рекомендуется. Если ключ генерируется пользователем, то он может быть каким угодно, включая `length` или `toString` или другой встроенный метод **localStorage**. В этом случае `getItem/setItem` сработают нормально, а вот чтение/запись как свойства объекта не пройдут. Когда мы модифицируем данные, то срабатывает событие `storage`. Но это событие не происходит при записи без `setItem`, как свойства объекта:

````js
let key = 'length';
localStorage[key] = 5; // Ошибка, невозможно установить length
````

Ключ и значение должны быть строками. Если использовать любой другой тип, то он автоматически преобразуется в строку:

````js
localStorage.user = {name: "John"};
alert(localStorage.user); // [object Object]

localStorage.user = JSON.stringify({name: "John"});

let user = JSON.parse(localStorage.user);
alert( user.name ); // John

// Также возможно привести к строке весь объект хранилища, например для отладки:
alert( JSON.stringify(localStorage, null, 2) );
````

Объекты веб-хранилища нельзя перебрать в цикле, они не итерируемы, но можно пройти по ним, как по обычным массивам:

````js
for(let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  alert(`${key}: ${localStorage.getItem(key)}`);
}
````

Другой способ – использовать цикл, как по обычному объекту `for key in localStorage`. Здесь перебираются ключи, но вместе с этим выводятся несколько встроенных полей:

````js
// bad try
for(let key in localStorage) {
  alert(key); // покажет getItem, setItem и другие встроенные свойства
}
````

Поэтому нужно либо отфильтровать поля из прототипа проверкой hasOwnProperty:

````js
for(let key in localStorage) {
  if (!localStorage.hasOwnProperty(key)) {
    continue; // пропустит такие ключи, как "setItem", "getItem" и так далее
  }
  alert(`${key}: ${localStorage.getItem(key)}`);
}
````

Либо просто получить «собственные» ключи с помощью `Object.keys`, а затем при необходимости вывести их при помощи цикла:

````js
let keys = Object.keys(localStorage);
for(let key of keys) {
  alert(`${key}: ${localStorage.getItem(key)}`);
}
````

### **SecurityError**

Запрос к хранилищу нарушает разрешение политик, либо источник для хранения не является корректной комбинацией схема/хост/порт (такое может произойти, если источником для хранения является `file:` или `data:` схемы, например). Как ещё один пример появления ошибки, пользователь через конфигурацию браузера запретил хранение данных для некоторых источников.

### **Проверка на наличие**

Браузеры поддерживаемые `localStorage` будут иметь свойство `localStorage` объекта `window`. Тем не менее, простое утверждение, что это свойство существует, может вызывать исключение, т.к. различные броузеры обладают настройками которые отключают его. Один из таких примеров браузер **Safari**, который в **Private Browsing mode** возвращает пустой `localStorage` объект, фактически делая его непригодным для использования. Функция, которая проверяет браузеры на поддержку и доступность `localStorage`:

````js
function storageAvailable(type) {
    try {
        const storage = window[type],

        x = '__storage_test__';

        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return false;
    }
}

//Вот как вы бы могли использовать это:
if (storageAvailable('localStorage')) {
    // Yippee! We can use localStorage awesomeness
}
else {
    // Too bad, no localStorage for us
}
````

* Не поддерживается старыми браузерами, например, IE 7 и ниже.
* Максимальный размер хранилища `localStorage` – до 10 МБайт на каждый домен.

***

## **sessionStorage**

Объект `sessionStorage` используется гораздо реже, чем `localStorage`. Свойства и методы такие же, но есть существенные ограничения:

* `sessionStorage` существует только в рамках текущей вкладки браузера.
* Другая вкладка с той же страницей будет иметь другое хранилище, но оно разделяется между ифреймами на той же вкладке (при условии, что они из одного и того же источника).
* Данные продолжают существовать после перезагрузки страницы, но не после закрытия/открытия вкладки.

Максимальный размер хранилища `sessionStorage` – 5 МБайт на каждый домен.
***

## **Событие storage**

Когда обновляются данные в `localStorage` или `sessionStorage`, генерируется событие `storage` со следующими свойствами:

* `key` – ключ, который обновился (`null`, если вызван `.clear()`).
* `oldValue` – старое значение (`null`, если ключ добавлен впервые).
* `newValue` – новое значение (`null`, если ключ был удалён).
* `url` – `url` документа, где произошло обновление.
* `storageArea` – объект `localStorage` или `sessionStorage`, где произошло обновление.

Событие срабатывает на всех остальных объектах `window`, где доступно хранилище, кроме того окна, которое его вызвало. Представьте, что у вас есть два окна с одним и тем же сайтом. Хранилище localStorage разделяется между ними.

Если открыть страницу в двух окнах браузера то оба окна слушают `window.onstorage`. Каждое из них будет реагировать на обновления, произошедшие в другом окне.

````js
// срабатывает при обновлениях, сделанных в том же хранилище из других документов
window.onstorage = event => {
  if (event.key != 'now') return;
  alert(event.key + ':' + event.newValue + " at " + event.url);
};

localStorage.setItem('now', Date.now());
````

Событие также содержит: `event.url` – `url`-адрес документа, в котором данные обновились. Также `event.storageArea` содержит объект хранилища – событие одно и то же для `sessionStorage` и `localStorage`, поэтому `event.storageArea` ссылается на то хранилище, которое было изменено. Это позволяет разным окнам одного источника обмениваться сообщениями. Современные браузеры также поддерживают **Broadcast channel API** специальный **API** для связи между окнами одного источника, он более полнофункциональный, но менее поддерживаемый. Существуют библиотеки (полифилы), которые эмулируют это **API** на основе `localStorage` и делают его доступным везде.

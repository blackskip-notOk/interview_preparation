# **Методы объктов**

## **Ссылки**

* [**toString()**](#tostring)
* [**toLocaleString()**](#tolocalestring)
* [**valueOf()**](#valueof)
* [**toJSON()**](#tojson)

***

## **toString()**

`toString()` не имеет аргументов, возвращает строку, каким-то об­разом представляющую значение объекта, на котором он вызван. Интерпретатор **JavaScript** вызывает данный метод всякий раз, когда объект необходимо преоб­разовать в строку.

````js
let s = { x: 1, у: 1 } .toString() ; // s == "[object Object]"
````

Поскольку стандартный метод `toString()` не предоставляет достаточный объем полезной информации, многие классы определяют собственные версии `toString()`. Например, когда массив преобразуется в строку, вы получаете список элементов массива, каждый из которых сам преобразован в строку, а когда функция преобразуется в строку, вы получаете исходный код для функ­ции.
***

## **toLocaleString()**

`toLocaleString()` предназначен для возвращения локализованного строкового представления объекта. Стандартный метод `toLocaleString()`, оп­ределенный в `Object`, никакой локализации не делает: он вызывает ме­тод `toString()` и возвращает его значение. В классах `Date` и `Number` определе­ны настроенные версии `toLocaleString()`, которые пытаются форматировать числа, даты и время в соответствии с локальными соглашениями. В классе `Array`  `toLocaleString()`, который работает подобно `toString()`, но форматирует элементы массива, вызывая их методы `toLocaleString()`.
***

## **valueOf()**

`valueOf()` во многом похож на метод `toString()`, но вызывается, когда интерпретатору **JavaScript** необходимо преобразовать объект в какой-то элементарный тип, отличающийся от строки — обычно в число. Интерпретатор **JavaScript** вызывает `valueOf()` автоматически, если объект используется в контексте, где требуется элементарное значение. Стандартный метод `valueOf()` не делает ничего интересного, но некоторые встроенные классы определяют собственные методы `valueOf()`. Класс `Date` определяет метод `valueOf()` для преобразования дат в числа, что позволяет сравнивать объекты `Date` хронологически посредством операций `<` и `>`.
***

## **toJSON()**

В `Object.prototype` на самом деле не определен метод `toJSON()`, но метод `JSON.stringify()` ищет метод `toJSON()` в каждом объекте, который нужно сериализировать. Если этот метод существует, тогда он вызывается и сериализируется его возвращаемое значение, а не первоначальный объект. Класс `Date` определяет метод `toJSON()`, который возвращает допускающее сериализацию строковое представление даты.
***

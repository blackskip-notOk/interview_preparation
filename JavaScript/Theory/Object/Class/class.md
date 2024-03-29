# **Класс**

В **JavaScript** нет абстрактных «планов» объектов, называемых классами, какие существуют в языках, ориентированных на использование классов. В **JavaScript** есть только объекты. **JavaScript** занимает почти уникальное положение среди языков: это едва ли не единственный язык, который может с полным правом использовать определение «объектно-ориентированный», потому что он входит в очень короткий список языков, в которых объект может создаваться напрямую, без использования классов. В **JavaScript** классы не могут описывать то, что могут делать объекты (потому что они не существуют). Объект сам определяет свое поведение напрямую. Есть только объект.

## **Функции «классов»**

В **JavaScript** есть своеобразный тип поведения, которым в течение многих лет злоупотребляли и пытались сделать его похожим на классы. Это нетипичное поведение «чего-то похожего на классы» основано на странной особенности функций: все функции по умолчанию получают открытое, не перечисляемое свойство с именем `prototype`, которое указывает на произвольный объект:

````js
function Foo() {
 // ...
}
Foo.prototype; // { }
````

Этот объект часто называется прототипом `Foo`, потому что мы обращаемся к нему по ссылке на свойство `Foo.prototype`. Тем не менее, эта терминология неизбежно приводит к путанице. Самое простое объяснение, что каждый объект, создаваемый вызовом [`new Foo()`](../object.md), наделяется связью через [`Prototype`](../Prototype/prototype.md) с этим объектом «Foo-точка-прототип».

````js
function Foo() {
 // ...
}
var a = new Foo();
Object.getPrototypeOf( a ) === Foo.prototype; // true
````

При создании `a` вызовом `new Foo()` он получает внутреннюю ссылку `[[Prototype]]` на объект, на который указывает `Foo.prototype`. В языках, ориентированных на использование классов, можно создать несколько копий (то есть экземпляров) класса — что-то вроде штамповки по готовым формам. Это происходит из-за того, что процесс создания экземпляров класса означает «скопировать план поведения из этого класса в физический объект», и это повторяется для каждого нового экземпляра. Но в **JavaScript** такое копирование не выполняется. Можно создать несколько объектов, связанных с общим объектом через `[[Prototype]]`. Но по умолчанию копирование не происходит, а следовательно, эти объекты не получаются полностью самостоятельными и отсоединенными друг от друга — они остаются связанными между собой. `new Foo()` приводит к созданию нового объекта, и этот новый объект `a` во внутренней реализации связывается через `[[Prototype]]` с объектом `Foo.prototype`. В итоге появляются два объекта, связанных друг с другом. Поведение не копировалось из «класса» в конкретный объект. Мы просто связали два объекта друг с другом по ссылке.
От многих JS-разработчиков ускользает один секрет: вызов новой функции `Foo()` не имеет практически ничего общего с процессом создания ссылки. Это своего рода побочный эффект. `new Foo()` — непрямой обходной путь для получения нужного результата: нового объекта, связанного с другим объектом.
Этот механизм часто называется наследованием на основе прототипов. Обычно это называется версией классического наследования для динамических языков. Это попытка воспользоваться общим пониманием того, что означает «наследование» вмире, ориентированном на использование классов, но при этом слегка подстроить понятную семантику для динамических сценариев. Наследование подразумевает операцию копирования, а **JavaScript** не копирует свойства объектов (по умолчанию). Вместо этого **JS** создает связь между двумя объектами, благодаря которой один объект может делегировать обращения к свойствам/функциям другому объекту. Термин «делегирование» гораздо точнее описывает механизм связывания объектов в **JavaScript**.

## **«Конструкторы»**

Что именно заставляет вас думать, что `Foo` является «классом»? Во-первых, мы видим использование ключевого слова `new`, как в языках, ориентированных на использование классов, при конструировании экземпляров классов. Во-вторых, кажется, что мы действительно выполняем метод-конструктор класса, потому что метод `Foo()` действительно вызывается — подобно тому, как конструктор реального класса вызывается при создании экземпляра этого класса. Путаница семантики «конструктора» усугубляется тем, что у объекта со странным обозначением `Foo.prototype` в запасе есть еще один трюк:

````js
function Foo() {
 // ...
}
Foo.prototype.constructor === Foo; // true
var a = new Foo();
a.constructor === Foo; // true
````

Объект `Foo.prototype` по умолчанию получает открытое неперечисляемое свойство с именем `.constructor`, и это свойство содержит обратную ссылку на функцию (`Foo` в данном случае), с которой был связан объект. Более того, мы видим, что объект `a`, созданный вызовом «конструктора» `new Foo()`, вроде бы тоже содержит свойство `.constructor`, которое аналогичным образом указывает на «функцию, которая создала его». На самом деле это не так: `a` не содержит свойства `.constructor`, и хотя `a.constructor` действительно дает функцию `Foo`, «конструктор» в данном случае не означает «тот, кто сконструировал», как могло бы показаться. По действующим в мире **JavaScript** соглашениям имя «класса» начинается с прописной буквы, и сам факт использования `Foo` вместо `foo` указывает на то, что мы предполагаем, что это «класс». Эти соглашения настолько сильны, что многие статические анализаторы кода JS предупрежают о вызове `new` с методом, имя которого начинается со строчной буквы, или если `new` не вызывается с функцией, начинающейся с прописной буквы. В действительности `Foo` заслуживает называться «конструктором» ничуть не больше, чем любая другая функция в программе. Сами функции конструкторами не являются. Тем не менее, когда вы ставите ключевое слово `new`
перед обычным вызовом функции, это делает вызов функции «вызовом конструктора». Можно сказать, что `new` в каком-то смысле захватывает любую нормальную функцию и вызывает ее способом, который конструирует объект (в дополнение к тому, что она еще собирается сделать).

````js
function NothingSpecial() {
 console.log( "Don’t mind me!" );
}

var a = new NothingSpecial(); // "Don’t mind me!"

a; // {}
````

`NothingSpecial` — совершенно обычная функция, но при вызове с `new` она конструирует объект, который присваивается `a`. Этот вызов был вызовом конструктора, но функция `NothingSpecial` сама по себе не является конструктором. Иначе говоря, в **JavaScript** правильнее всего говорить, что «конструктор» — любая функция, вызываемая с ключевым словом `new`. Функции не являются конструкторами, но вызовы функций являются «вызовами конструктора» в том и только том случае, если они используются с `new`.
***

## **Механика**

````js
function Foo(name) {
 this.name = name;
}

Foo.prototype.myName = function() {
 return this.name;
};

var a = new Foo( "a" );
var b = new Foo( "b" );

a.myName(); // "a"
b.myName(); // "b"
````

Этот фрагмент демонстрирует еще два трюка из этой же категории:

1. `this.name = name` добавляет свойство `.name` к каждому объекту по аналогии с тем, как экземпляры классов инкапсулируют значения данных.

2. `Foo.prototype.myName = ...` эта конструкция добавляет свойство (функцию) в объект `Foo.prototype`. Теперь `a.myName()` работает. Может показаться, будто в приведенном фрагменте при создании `a` и `b` свойства/функции объекта `Foo.prototype` копируются в каждый из объектов `a` и `b`. Тем не менее этого не происходит. В силу способа их создания каждый из объектов `a` и `b` получает внутреннюю ссылку `[[Prototype]]` на `Foo.prototype`. Когда свойство `myName` не удается найти в `a` и `b` соответственно, оно вместо этого находится в `Foo.prototype`.

Свойство `.constructor` объекта `Foo.prototype` присутствует по умолчанию только у объекта, созданного при объявлении функции `Foo`. Если вы создадите новый объект и замените ссылку `.prototype` по умолчанию у функции, то новый объект не получит `.constructor` неким волшебным образом.

````js
function Foo() { /* .. */ }
Foo.prototype = { /* .. */ }; // создание нового объекта

var a1 = new Foo();
a1.constructor === Foo; // false!
a1.constructor === Object; // true!
````

Ведь объект `a1` не был «сконструирован» `Object(..)`, скорее уж он был «сконструирован» `Foo()`. Многие разработчики считают, что `Foo()` конструирует объект, но если вы думаете, что «конструктор» означает «тот, кто сконструировал», картина тут же распадается — по этой логике свойство `a1.constructor` должно содержать `Foo`, но это не так. Объект `a1` не содержит свойство `.constructor`, поэтому он делегирует обращение по цепочке `[[Prototype]]` к `Foo.prototype`. Но и этот объект не содержит `.constructor` (в отличие от объекта `Foo.prototype` по умолчанию), поэтому делегирование продолжается и доходит до `Object.prototype`, вершины цепочки делегирования. А у этого объекта имеется свойство `.constructor`, которое указывает на встроенную функцию `Object(..)`. Неверное представление привело к полному провалу. Конечно, вы можете добавить `.constructor` в объект `Foo.prototype`, но это придется делать вручную, особенно если вы захотите воспроизвести встроенное поведение и сделать свойство неперечисляемым.

````js
function Foo() { /* .. */ }
Foo.prototype = { /* .. */ }; // создание нового объекта prototype

// Необходимо "исправить" отсутствующее свойство `.constructor` нового объекта, заменяющего `Foo.prototype`.
Object.defineProperty( Foo.prototype, "constructor" , {
 enumerable: false,
 writable: true,
 configurable: true,
 value: Foo // свойство `.constructor` указывает на `Foo`
} );
````

Слишком много ручной работы для исправления `.constructor`. Более того, фактически мы лишь пытаемся подкрепить неверное представление о том, что «конструктор» означает «тот, кто сконструировал». По сути свойство `.constructor` объекта указывает по умолчанию на функцию, которая взаимно содержит ссылку на этот объект — ссылку, которая называется `.prototype`. Слова «конструктор» и «прототип» имеют лишь неформальное значение по умолчанию, которое может оправдаться или не оправдаться в будущем. Из-за правил обхода цепочки `[[Prototype]]` алгоритмом `[[Get]]` ссылка из свойства `.constructor`, где бы она ни находилась, может разрешаться совсем не так, как вы ожидаете. 
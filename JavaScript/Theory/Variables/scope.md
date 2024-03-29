# **Область видимости**

## **Ссылки**

* [**Стадия лексического анализа**](#стадия-лексического-анализа)
* [**Поиск**](#поиск)
* [**Искажение лексической области видимости**](#искажение-лексической-области-видимости)
* [**eval**](#eval)
* [**with**](#with)
* [**Быстродействие**](#быстродействие)
* [**Функциональные и блочные области видимости**](#функциональные-и-блочные-области-видимости)

Для понимания области видимости js - [теория компиляции](./theory.md)

Существуют две основные модели работы области видимости. Первая модель встречается намного чаще и используется в подавляющем большинстве языков программирования (используется в JavaScript). Она называется лексической областью видимости (lexical scope);

Другая модель, которая до сих пор используется в некоторых языках (например, в сценариях Bash, некоторых режимах Perl и т. д.), называется динамической областью видимости (dynamic scope).

## **Стадия лексического анализа**

Лексической областью видимости называется область видимости, определяемая на стадии лексического анализа. Другими словами, лексическая область видимости определяется тем, где вы разместили переменные и блоки области видимости во время написания
программы, а следовательно, (в основном) жестко фиксируется на момент обработки кода лексическим анализатором.

```` js
function foo(a) {
 var b = a * 2;

 function bar(c) {
 console.log( a, b, c );
 }

 bar( b * 3 );
}

foo( 2 ); // 2, 4, 12
````

В этом примере существуют три области видимости. Для наглядности можно представить их как пузыри, вложенные друг в друга.

* Пузырь 1 охватывает глобальную область видимости и содержит всего один идентификатор: `foo`.

* Пузырь 2 охватывает область видимости `foo` и содержит три идентификатора: `a`, `bar` и `b`.

* Пузырь 3 охватывает область видимости `bar` и включает один идентификатор: `c`.

Пузыри областей видимости определяются тем, где располагаются блоки, какой из них вложен в другой и т. д. Пузырь для `bar` полностью содержится внутри пузыря для `foo`, потому что (и только по этой причине) мы решили определить функцию `bar` именно здесь.
Обратите внимание на строгую вложенность пузырей. Структура не похожа на диаграммы Венна, в которых возможно пересечение пузырей. Другими словами, пузырь некоторой функции не может находиться одновременно в двух других пузырях внешней области действия, и никакая функция не может частично находиться внутри двух других родительских функций.

***

## **Поиск**

Структура и относительное размещение пузырей областей видимости полностью объясняет движку, где он должен искать идентификатор. В предыдущем фрагменте кода движок выполняет команду `console.log(..)` и переходит к поиску трех переменных, `a`, `b` и `c`. Поиск начинается с внутренней области видимости, то есть области видимости функции `bar(..)`. Здесь найти переменную `a` не удается, поэтому поиск поднимается на один уровень к ближайшей области видимости, то есть области видимости `foo(..)`.
Здесь находится переменная `a`, поэтому движок использует эту переменную `a`. То же самое происходит с `b`. Но переменная `c` обнаруживается внутри `bar(..)`.
Если бы переменная `c` присутствовала и внутри `bar(..)`, и внутри `foo(..)`, команда `console.log(..)` нашла и использовала бы переменную из `bar(..)`, так и не добравшись до переменной из `foo(..)`. Поиск по областям видимости останавливается при нахождении первого совпадения. Одно имя идентификатора может быть задано на нескольких уровнях вложенных областей видимости, что называется «замещением» (внутренний идентификатор «замещает» внешний идентификатор). Независимо от замещения поиск области видимости всегда начинается с внутренней области видимости, выполняемой в настоящее время, и перемещается наружу/вверх до первого совпадения, где останавливается. Глобальные переменные также автоматически являются свойствами глобального объекта (window в браузерах и т. д.). Это означает, что на глобальную переменную можно ссылаться не только напрямую по ее лексическому имени, но и косвенно через свойство глобального объекта: `window.a`. Этот синтаксис открывает доступ к глобальной переменной, которая в противном случае была бы недоступна из-за замещения. Неглобальные замещенные переменные остаются недоступными. Неважно, где вызывается функция, и даже как она вызывается — ее лексическая область видимости определяется только тем, где была объявлена функция. Лексическая область видимости применяется только к полноценным идентификаторам, таким как `a`, `b` и `c`. Если фрагмент кода содержит ссылку `foo.bar.baz`, поиск лексической области видимости будет относиться к идентификатору `foo`, но после того, как переменная будет обнаружена, вступят в силу правила обращения к свойствам объектов для разрешения имен свойств `bar` и `baz` соответственно.

## **Искажение лексической области видимости**

В **JavaScript** существуют два таких механизма. Оба в равной степени осуждаются сообществом разработчиков как признаки плохого стиля в вашем коде. Однако типичные аргументы против них часто упускают из виду самое важное обстоятельство: искажение лексической области видимости ведет к снижению быстродействия.

### **eval**

Функция `eval(..)` в **JavaScript** получает строковый аргумент и интерпретирует содержимое строки так, словно это реальный код в текущей точке программы. Иначе говоря, вы можете на программном уровне генерировать код внутри своей программы и выполнять сгенерированный код так, словно вы сами его написали.
Если рассматривать `eval(..)` в этом свете, станет ясно, как `eval()` позволяет изменить окружение лексической области видимости. В строках кода, следующих за выполнением `eval(..)`, движок не будет «знать», что код был интерпретирован динамически, а следовательно, изменил окружение лексической области видимости. Движок просто выполнит поиск по лексической области видимости так, как он это делает всегда.

```` js
function foo(str, a) {
 eval( str ); // изменение!
 console.log( a, b );
}

var b = 2;

foo( "var b = 3;", 1 ); // 1, 3
````

Строка `"var b = 3;"` в точке вызова `eval(..)` интерпретируется как код, который здесь был изначально. Так как в этом коде объявляется новая переменная `b`, он изменяет существующую лексическую область видимости `foo(..)`. Как упоминалось ранее, этот код фактически создает внутри `foo(..)` переменную `b`, которая
замещает переменную `b`, объявленную во внешней (глобальной) области видимости.
Когда в программе происходит вызов `console.log(..)`, он находит `a` и `b` в области видимости `foo(..)` и не находит внешнюю переменную `b`. Таким образом, программа выводит «1, 3» вместо «1, 2», как должна была бы. В этом упрощенном примере передаваемая строка «кода» представляет собой фиксированный литерал. Но она с таким же успехом могла строиться на программном уровне с объединением символов на основании логики программы. Функция `eval(..)` обычно используется для выполнения динамически создаваемого кода, так как динамическое вычисление статического по своей сути кода из строкового литерала не даст никаких реальных преимуществ перед простым написанием кода. По умолчанию, если строка кода, выполняемая вызовом `eval(..)`, содержит одно или несколько объявлений (переменных или функций), это действие изменяет существующую лексическую область видимости, в которой находится `eval(..)`. С технической точки зрения `eval(..)` может вызываться косвенно с использованием различных трюков в результате чего она будет выполняться в контексте глобальной области видимости, которая и будет изменяться. Как бы то ни было, `eval(..)` позволяет изменить лексическую область видимости на стадии выполнения. При использовании в режиме `strict eval(..)` работает в своей собственной лексической области видимости. Это означает, что объявления, созданные внутри `eval(..)`, не будут изменять внешнюю область видимости.

```` js
function foo(str) {
 "use strict";
 eval( str );
 console.log( a ); // ReferenceError: переменная a не определена
}

foo( "var a = 2" );
````

***

В JavaScript существуют и другие средства, приводящие практически к тому же результату, что и `eval(..)`. `setTimeout(..)` и `setInterval(..)` могут получать строку в своем первом аргументе, содержимое которого интерпретируется как код динамически генерируемой функции. Это старое унаследованное поведение, которое давным-давно считается устаревшим. Не используйте его! Функция-конструктор `new Function(..)` тоже получает в своем последнем аргументе строку кода, который преобразуется в динамически сгенерированную функцию. Синтаксис конструктора чуть безопаснее `eval(..)`, но его следует избегать в коде. Ситуации, требующие динамического генерирования кода в программе, встречаются крайне редко, так как снижение быстродействия почти никогда не стоит того.

## **with**

Другая нежелательная (а теперь считающаяся устаревшей) возможность искажения лексической области видимости в JavaScript основана на использовании ключевого слова `with`. Обычно `with` объясняется как сокращенная запись для многократных обращений к свойствам объекта без повторения ссылки на объект.

```` js
var obj = {
 a: 1,
 b: 2,
 c: 3
};
// "рутинные" повторения "obj"
obj.a = 2;
obj.b = 3;
obj.c = 4;
// "более простая" сокращенная запись
with (obj) {
 a = 3;
 b = 4;
 c = 5;
}
````

Тем не менее этот синтаксис представляет собой нечто гораздо большее, чем упрощенную запись для обращения к свойствам объектов.

```` js
function foo(obj) {
 with (obj) {
 a = 2;
 }
}

var o1 = {
 a: 3
};

var o2 = {
 b: 3
};

foo( o1 );
console.log( o1.a ); // 2

foo( o2 );
console.log( o2.a ); // undefined
console.log( a ); // 2 — ой, утечка глобального значения!
````

В этом примере создаются два объекта, `o1` и `o2`. У одного объекта есть свойство `a`, у другого его нет. Функция `foo(..)` получает ссылку на объект `obj` в аргументе и вызывает `with (obj) { .. }` для этой ссылки. В блоке `with` с переменной `a` встречается то, что выглядит как нормальная лексическая ссылка на переменную `a`, а на самом деле LHS-ссылка для присваивания ей значения `2`.
При передаче `o1` присваивание `a = 2` находит свойство `o1.a` и присваивает ему значение `2`, как показывает следующая команда `console.log(o1.a)`. Однако при передаче `o2`, поскольку у этого объекта нет свойства `a`, такое свойство не создается, и `o2.a` остается неопределенным. И тут обнаруживается странный побочный эффект: команда `a = 2` создает глобальную переменную `a`. Команда `with` получает объект (с 0 или более свойствами) и интерпретирует этот объект так, словно он образует совершенно отдельную лексическую область видимости, а следовательно,
свойства объекта интерпретируются как лексически определенные идентификаторы в этой области видимости. Несмотря на то что блок `with` интерпретирует объект как лексическую область видимости, для обычного объявления `var` внутри этого блока `with` областью видимости будет не этот блок, а область видимости внешней функции.
Если функция `eval(..)` может изменить существующую лексическую область видимости в том случае, если переданная ей строка кода содержит одно или несколько объявлений, команда `with` создает совершенно новую лексическую область видимости на основе переданного ей объекта. Если понимать происходящее таким образом, областью видимости, объявленной командой `with` при передаче `o1`, будет `o1`; в этой области видимости существует идентификатор, соответствующий свойству `o1.a`. Но когда в качестве области видимости используется `o2`, идентификатор `a` в ней не обнаруживается, поэтому вступают в действие обычные правила LHS-поиска идентификаторов. Ни в области видимости `o2`, ни в области видимости `foo(..)`, ни
даже в глобальной области видимости идентификатор `a` найти не удается, поэтому при выполнении команды `a = 2` автоматически создается глобальная переменная (так как программа не выполняется в режиме `strict`). Мало того что `eval(..)` и `with` использовать не рекомендуется, на них еще и влияет режим `strict`. Команда `with` запрещена полностью, тогда как различные косвенные или небезопасные формы `eval(..)` запрещены при сохранении базовой функциональности.

## **Быстродействие**

Движок JavaScript содержит ряд оптимизаций быстродействия, которые выполняются в фазе компиляции. Некоторые из них сводятся к тому, что движок по сути выполняет статический анализ кода в процессе лексического анализа и заранее определяет,
где находятся все переменные и объявления функций, чтобы ускорить разрешение идентификаторов в процессе выполнения. Но если движок обнаруживает в коде `eval(..)` или `with`, он вынужден предположить, что вся информация о местонахождении идентификаторов может оказаться недействительной. Ведь во время лексического анализа движок не может знать, какой код может быть передан `eval(..)` для изменения лексической области видимости или что может содержать объект, переданный `with` для создания новой лексической области видимости. Другими словами, в пессимистическом варианте многие эти оптимизации при наличии `eval(..)` или `with` становятся бессмысленными, поэтому движок вообще не выполняет никаких оптимизаций.

***

## **Функциональные и блочные области видимости**

Функция — самая распространенная структурная единица области видимости в JavaScript. Переменные и функции, объявленные внутри другой функции, по сути «скрываются» от всех внешних областей — сознательное применение принципа проектирования качественных программных продуктов. Однако функции никоим образом не являются единственной структурной единицей областей видимости. Под термином «блочная область видимости» понимается концепция принадлежности переменных и функций произвольному блоку (в общем случае любой паре {..}), а не только внешней функции.

Ключевое слово `let` присоединяет объявление переменной к области видимости того блока (обычно паре фигурных скобок {..}), в которой оно содержится. Иначе говоря, `let` неявно заимствует область видимости любого блока для объявления своей переменной.

```` js
var foo = true;

if (foo) {
 let bar = foo * 2;

 bar = something( bar );

 console.log( bar );
}

console.log( bar ); // ReferenceError
````

Использование `let` для присоединения переменной к существующему блоку происходит не совсем явно. Оно может смутить вас, если вы не будете обращать должного внимания на то, с каким блоками связывается область видимости переменных, и будете часто перемещать блоки, помещать их в другие блоки и т. д. в процессе разработки кода.
Явное создание блоков для блочной области видимости может решить некоторые из этих проблем; разработчик будет четко видеть, к какому блоку присоединяются или не присоединяются переменные. Обычно явный код предпочтительнее неявного или хитроумного. Стиль явного определения блочной области видимости легко реализуется и более естественно соответствует тому, как работают блочные области видимости в других языках:

```` js
var foo = true;

if (foo) {
 { // <-- explicit block
 let bar = foo * 2;
 bar = something( bar );
 console.log( bar );
 }
}

console.log( bar ); // ReferenceError
````

Чтобы создать произвольный блок для привязки `let`, достаточно включить пару `{..}` в любое место команды, в котором грамматика допускает размещение команды. В данном случае явный блок создается внутри команды `if`, что может упростить перемещение всего блока при последующем рефакторинге без последствий для позиции и семантики внешней команды `if`.
Однако объявления с `let` не будут подниматься на всю область видимости того блока, в котором они присутствуют. Такие объявления не будут «существовать» в блоке до команды объявления.

````js
{
 console.log( bar ); // ReferenceError!
 let bar = 2;
}
````

try/catch
Очень малоизвестный факт: в ES3 было указано, что объявление переменной в секции catch конструкции try/catch имеет блочную область видимости, ограниченную блоком catch.

```` js
try {
 undefined(); // недействительная операция, приводящая к исключению!
}
catch (err) {
 console.log( err ); // работает!
}
console.log( err ); // ReferenceError: переменная `err` не найдена
````

`err` существует только в секции `catch`, а при попытке обратиться к переменной в другом месте происходит ошибка.

# **Template && Slot**

## **Ссылки**

* [**Template**](#template)
* [**Slot**](#slot)
* [**Содержимое слота «по умолчанию»**](#содержимое-слота-«по-умолчанию»)
* [**Обновление слотов**](#обновление-слотов)
* [**API слотов**](#api-слотов)

## **Template**

Встроенный элемент `<template>` предназначен для хранения шаблона **HTML**. Браузер полностью игнорирует его содержимое, проверяя лишь синтаксис, но можно использовать этот элемент в **JavaScript**, чтобы создать другие элементы. Его содержимым может быть любой корректный HTML-код, даже такой, который обычно нуждается в специальном родителе. К примеру, можно поместить сюда строку таблицы `<tr>`:

````js
<template>
  <tr>
    <td>Содержимое</td>
  </tr>
</template>
````

Обычно, если элемент `<tr>` поместить, в `<div>`, браузер обнаружит неправильную структуру **DOM** и «исправит» её, добавив снаружи `<table>`. `<template>` же оставит разметку ровно такой, какой её туда поместили. Также внутри `<template>` можно поместить стили и скрипты:

````js
<template>
  <style>
    p { font-weight: bold; }
  </style>
  <script>
    alert("Привет");
  </script>
</template>
````

Браузер рассматривает содержимое `<template>` как находящееся «вне документа»: стили, определённые в нём, не применяются, скрипты не выполнятся и т.д. Скрипт выполнится, если поместить его в нужное место.

Использование `template`. Содержимое шаблона доступно по его свойству `content` в качестве `DocumentFragment` – особый тип DOM-узла. Можно обращаться с ним так же, как и с любыми другими DOM-узлами, за исключением одной особенности: когда мы его куда-то вставляем, то в это место вставляется не он сам, а его дети.
***

## **Slot**

Многим типам компонентов, таким как вкладки, меню, галереи изображений и другие, нужно какое-то содержимое для отображения.
Так же, как встроенный в браузер `<select>` ожидает получить контент пунктов `<option>`, компонент `<custom-tabs>` может ожидать, что будет передано фактическое содержимое вкладок. [Теневой DOM](./shadowDom.md) поддерживает элементы `<slot>`, которые автоматически наполняются контентом из обычного DOM-дерева.

Теневой DOM `<user-card>` имеет два слота, заполняемых из обычного **DOM**:

````js
<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <div>Имя:
        <slot name="username"></slot>
      </div>
      <div>Дата рождения:
        <slot name="birthday"></slot>
      </div>
    `;
  }
});
</script>

<user-card>
  <span slot="username">Иван Иванов</span>
  <span slot="birthday">01.01.2001</span>
</user-card>
````

В теневом **DOM** `<slot name="X">` определяет «точку вставки» – место, где отображаются элементы с `slot="X"`. Затем браузер выполняет «композицию»: берёт элементы из обычного DOM-дерева и отображает их в соответствующих слотах теневого DOM-дерева. В результате мы получаем компонент, который можно наполнить данными. После выполнения скрипта структура **DOM** выглядит следующим образом:

````js
<user-card>
  #shadow-root
    <div>Имя:
      <slot name="username"></slot>
    </div>
    <div>Дата рождения:
      <slot name="birthday"></slot>
    </div>
  <span slot="username">Иван Иванов</span>
  <span slot="birthday">01.01.2001</span>
</user-card>
````

Мы создали теневой **DOM**, он изображён под `#shadow-root`. Теперь у элемента есть два DOM-дерева: обычное и теневое. Чтобы отобразить содержимое, для каждого `<slot name="...">` в теневом DOM браузер ищет `slot="..."` с таким же именем в обычном **DOM**.

В результате выстраивается так называемое «развёрнутое» (flattened) DOM-дерево:

````js
<user-card>
  #shadow-root
    <div>Имя:
      <slot name="username">
        <!-- элемент слота вставляется в слот -->
        <span slot="username">Иван Иванов</span>
      </slot>
    </div>
    <div>Дата рождения:
      <slot name="birthday">
        <span slot="birthday">01.01.2001</span>
      </slot>
    </div>
</user-card>
````

Но развёрнутое DOM-дерево существует только для целей отображения и обработки событий. Оно, в некотором плане, «виртуальное». Фактически в документе расположение узлов не меняется. Это можно легко проверить, запустив `querySelectorAll`: все узлы находятся на своих местах.
`document.querySelectorAll('user-card span').length ); // 2`
Так что развёрнутый **DOM** составляется из теневого вставкой в слоты. Браузер использует его для рендеринга и при всплытии событий. Но **JavaScript** видит документ «как есть» – до построения развёрнутого DOM-дерева. Атрибут `slot="..."` работает только на непосредственных детях элемента-хозяина теневого дерева. Для вложенных элементов он игнорируется. Если в светлом **DOM** есть несколько элементов с одинаковым именем слота, они добавляются в слот один за другим.

````js
<user-card>
  <span slot="username">Иван</span>
  <span slot="username">Иванов</span>
</user-card>

<user-card>
  #shadow-root
    <div>Имя:
      <slot name="username">
        <span slot="username">Иван</span>
        <span slot="username">Иванов</span>
      </slot>
    </div>
    <div>Дата рождения:
      <slot name="birthday"></slot>
    </div>
</user-card>
````

### **Содержимое слота «по умолчанию»**

Если мы добавляем данные в `<slot>`, это становится содержимым «по умолчанию». Браузер отображает его, если в светлом DOM-дереве отсутствуют данные для заполнения слота.

````js
<div>Имя:
  <slot name="username">Аноним</slot>
</div>
````

Первый `<slot>` в теневом дереве без атрибута `name` является слотом по умолчанию. Он будет отображать данные со всех узлов светлого дерева, не добавленные в другие слоты.

````js
<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
    <div>Имя:
      <slot name="username"></slot>
    </div>
    <div>Дата рождения:
      <slot name="birthday"></slot>
    </div>
    <fieldset>
      <legend>Другая информация</legend>
      <slot></slot>
    </fieldset>
    `;
  }
});
</script>

<user-card>
  <div>Я люблю плавать.</div>
  <span slot="username">Иван Иванов</span>
  <span slot="birthday">01.01.2001</span>
  <div>...И играть в волейбол!</div>
</user-card>
````

Всё содержимое обычного дерева, не добавленное в слоты, попало в `<fieldset>` «Другая информация».

Элементы добавляются в слот по очереди, один за другим, поэтому оба элемента данных, которые не были добавлены в слоты, попадают в слот по умолчанию.

Развёрнутое DOM-дерево выглядит так:

````js
<user-card>
  #shadow-root
    <div>Имя:
      <slot name="username">
        <span slot="username">Иван Иванов</span>
      </slot>
    </div>
    <div>Дата рождения:
      <slot name="birthday">
        <span slot="birthday">01.01.2001</span>
      </slot>
    </div>
    <fieldset>
      <legend>Другая информация</legend>
      <slot>
        <div>Я люблю плавать.</div>
        <div>...И играть в волейбол!</div>
      </slot>
    </fieldset>
</user-card>
````

### **Обновление слотов**

Браузер наблюдает за слотами и обновляет отображение при добавлении и удалении элементов в слотах. Также, поскольку узлы светлого DOM-дерева не копируются, а только отображаются в слотах, изменения внутри них сразу же становятся видны. Таким образом, ничего не нужно делать для обновления отображения. Но если код компонента хочет узнать об изменениях в слотах, можно использовать событие `slotchange`. Например, здесь пункт меню вставляется динамически через 1 секунду, и заголовок меняется через 2 секунды:

````js
<custom-menu id="menu">
  <span slot="title">Сладости</span>
</custom-menu>

<script>
customElements.define('custom-menu', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<div class="menu">
      <slot name="title"></slot>
      <ul><slot name="item"></slot></ul>
    </div>`;

    // shadowRoot не может иметь обработчиков событий, поэтому используется первый потомок
    this.shadowRoot.firstElementChild.addEventListener('slotchange',
      e => alert("slotchange: " + e.target.name)
    );
  }
});

setTimeout(() => {
  menu.insertAdjacentHTML('beforeEnd', '<li slot="item">Леденцы</li>')
}, 1000);

setTimeout(() => {
  menu.querySelector('[slot="title"]').innerHTML = "Новое меню";
}, 2000);
</script>
````

Здесь есть два события `slotchange`:

* При инициализации: `slotchange: title` запускается сразу же, как только `slot="title"` из обычного дерева попадает в соответствующий слот.

* Через 1 секунду: `slotchange: item` запускается, когда добавляется новый элемент `<li slot="item">`.

Событие `slotchange` не запускается через 2 секунды, когда меняется контент `slot="title"`. Это происходит потому, что сам слот не меняется. Мы изменяем содержимое элемента, который находится в слоте, а это совсем другое. Если мы хотим отслеживать внутренние изменения обычного DOM-дерева из **JavaScript**, можно также использовать более обобщённый механизм: `MutationObserver`.
***

### **API слотов**

**JavaScript** смотрит на «реальный», а не на развёрнутый **DOM**. Но если у теневого дерева стоит `{mode: 'open'}`, то мы можем выяснить, какие элементы находятся в слоте, и, наоборот, определить слот по элементу, который в нём находится:

* `node.assignedSlot` – возвращает элемент `<slot>`, в котором находится `node`.
* `slot.assignedNodes({flatten: true/false})` – DOM-узлы, которые находятся в слоте. Опция `flatten` имеет значение по умолчанию `false`. Если явно изменить значение на `true`, она просматривает развёрнутый **DOM** глубже и возвращает вложенные слоты, если есть вложенные компоненты, и резервный контент, если в слоте нет узлов.
* `slot.assignedElements({flatten: true/false})` – DOM-элементы, которые находятся в слоте (то же самое, что выше, но только узлы-элементы).

Эти методы можно использовать не только для отображения содержимого, которое находится в слотах, но и для его отслеживания в **JavaScript**.

Например, если компонент `<custom-menu>` хочет знать, что он показывает, он может отследить событие `slotchange` и получить пункты меню из `slot.assignedElements`:

````js
<custom-menu id="menu">
  <span slot="title">Сладости</span>
  <li slot="item">Леденцы</li>
  <li slot="item">Фруктовые тосты</li>
</custom-menu>

<script>
customElements.define('custom-menu', class extends HTMLElement {
  items = []

  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<div class="menu">
      <slot name="title"></slot>
      <ul><slot name="item"></slot></ul>
    </div>`;

    // слотовый элемент добавляется/удаляется/заменяется
    this.shadowRoot.firstElementChild.addEventListener('slotchange', e => {
      let slot = e.target;
      if (slot.name == 'item') {
        this.items = slot.assignedElements().map(elem => elem.textContent);
        alert("Items: " + this.items);
      }
    });
  }
});

// пункты меню обновятся через 1 секунду
setTimeout(() => {
  menu.insertAdjacentHTML('beforeEnd', '<li slot="item">Кексы</li>')
}, 1000);
</script>
````

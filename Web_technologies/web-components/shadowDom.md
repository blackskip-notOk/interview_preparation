# **Shadow DOM**

Каждый DOM-элемент может иметь 2 типа поддеревьев DOM:

1. **Light tree** – обычное, «светлое», DOM-поддерево, состоящее из HTML-потомков.

2. **Shadow tree** – «теневое», DOM-поддерево, не отражённое в HTML, скрытое от посторонних глаз.

Если у элемента имеются оба поддерева, браузер отрисовывает только теневое дерево. Также можно задать «композицию» теневого и обычного деревьев. Теневое дерево можно использовать в пользовательских элементах, чтобы спрятать внутренности компонента и применить к ним локальные стили.

````js
<script>
customElements.define('show-hello', class extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `<p>
      Hello, ${this.getAttribute('name')}
    </p>`;
  }
});
</script>

<show-hello name="John"></show-hello>
````

А вот как получившийся DOM выглядит в инструментах разработчика в Chrome, весь контент внутри «#shadow-root»:

![Caption for the picture]('../../images/shadow-dom-say-hello.png')

Есть два ограничения:

1. Для каждого элемента можно создать только один **shadow root**.

2. В качестве **elem** может быть использован пользовательский элемент, либо один из следующих элементов: `article`, `aside`, `blockquote`, `body`, `div`, `footer`, `h1…h6`, `header`, `main`, `nav`, `p`, `section` или `span`.

Свойство `mode` задаёт уровень инкапсуляции. У него может быть только два значения:

1. **open** – корень теневого дерева («shadow root») доступен как `elem.shadowRoot`. Любой код может получить теневое дерево `elem`.

2. **closed** – `elem.shadowRoot` всегда возвращает `null`. До теневого **DOM** в таком случае мы сможем добраться только по ссылке, которую возвращает `attachShadow` (и, скорее всего, она будет спрятана внутри класса). Встроенные браузерные теневые деревья, такие как у `<input type="range">`, закрыты.

С возвращаемым методом `attachShadow` объектом корнем теневого дерева, можно работать как с обычным DOM-элементом: менять его `innerHTML` или использовать методы **DOM**, такие как `append`, чтобы заполнить его.
Элемент с корнем теневого дерева называется – «хозяин» (host) теневого дерева, и он доступен в качестве свойства `host` у shadow root:

````js
// при условии, что {mode: "open"}, иначе elem.shadowRoot равен null
alert(elem.shadowRoot.host === elem); // true
````

Элементы теневого **DOM** не видны из обычного **DOM** через `querySelector`. В частности, элементы теневого DOM могут иметь такие же идентификаторы, как у элементов в **ight DOM**. Они должны быть уникальными только внутри теневого дерева. У теневого **DOM** свои стили. Стили из внешнего **DOM** не применятся.

````js
<style>
  /* стили документа не применятся в теневом дереве внутри #elem */
  p { color: red; }
</style>

<div id="elem"></div>

<script>
  elem.attachShadow({mode: 'open'});

  // у теневого дерева свои стили
  elem.shadowRoot.innerHTML = `
    <style> p { font-weight: bold; } </style>
    <p>Hello, John!</p>
  `;

  // <p> виден только запросам внутри теневого дерева
  alert(document.querySelectorAll('p').length);
  alert(elem.shadowRoot.querySelectorAll('p').length);
</script>
````

***

# **Теневой DOM и события**

Смысл создания теневого DOM-дерева – это инкапсуляция внутренних деталей компонента. Допустим, клик произошёл внутри теневого **DOM** на компоненте `<user-card>`. Но скрипты основного документа ничего не знают о внутреннем устройстве теневой DOM-структуры, в особенности, если компонент создан сторонней библиотекой. Поэтому, чтобы не нарушать инкапсуляцию, браузер меняет у этого события целевой элемент. События, которые произошли в теневом **DOM**, но пойманы снаружи этого **DOM**, имеют элемент-хозяин в качестве целевого элемента `event.target`.

````js
<user-card></user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<p>
      <button>Нажми меня</button>
    </p>`;
    this.shadowRoot.firstElementChild.onclick =
      e => alert("Внутренний целевой элемент: " + e.target.tagName);
  }
});

document.onclick =
  e => alert("Внешний целевой элемент: " + e.target.tagName);
</script>
````

Если нажать на кнопку, то выведется следующее:

1. Внутренний целевой элемент: **BUTTON** – внутренний обработчик событий получает правильный целевой элемент – элемент, находящийся внутри теневого **DOM**.
2. Внешний целевой элемент: **USER-CARD** – обработчик событий на уровне документа получает элемент-хозяин в качестве целевого.

Браузер подменяет целевые элементы событий. Внешний документ ничего не знает о внутреннем устройстве компонента. С его (внешнего документа) точки зрения, событие происходит на `<user-card>`. Подмена целевого элемента не происходит, если событие берёт начало на элементе из слота, который фактически находится в обычном, светлом **DOM**. Например, если пользователь кликнет на `<span slot="username">` в примере ниже – целевой элемент события будет именно этот `span` для обоих обработчиков – теневого и обычного (светлого):

````js
<user-card id="userCard">
  <span slot="username">John Smith</span>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<div>
      <b>Имя:</b> <slot name="username"></slot>
    </div>`;

    this.shadowRoot.firstElementChild.onclick =
      e => alert("Внутренний целевой элемент: " + e.target.tagName);
  }
});

userCard.onclick = e => alert(`Внешний целевой элемент: ${e.target.tagName}`);
</script>
````

Если клик произойдёт на `"John Smith"`, то для обоих обработчиков – внутреннего и внешнего – целевым элементом будет `<span slot="username">`. Это элемент обычного **DOM**, так что подмены не происходит. С другой стороны, если клик произойдёт на элементе, который находится в теневом **DOM**, например, на `<b>Имя</b>`, то как только всплытие выйдет за пределы теневой DOM-структуры, его `event.target` станет `<user-card>`.
***

## **Всплытие и метод `event.composedPath()`**

Для обеспечения всплытия событий используется развёрнутый **DOM**. Таким образом, если у нас есть элемент в слоте, и событие происходит где-то внутри него, то оно всплывает до `<slot>` и выше. Полный путь к изначальному целевому элементу, со всеми теневыми элементами, можно получить, воспользовавшись методом `event.composedPath()`. Как видно из названия, этот метод возвращает путь после композиции. В примере выше развёрнутое DOM-дерево будет таким:

````js
<user-card id="userCard">
  #shadow-root
    <div>
      <b>Имя:</b>
      <slot name="username">
        <span slot="username">John Smith</span>
      </slot>
    </div>
</user-card>
````

Так что, при клике по `<span slot="username">` вызов метода `event.composedPath()` вернёт массив: `[span, slot, div, shadow-root, user-card, body, html, document, window]`. Что в точности отражает цепочку родителей от целевого элемента в развёрнутой DOM-структуре после композиции. Детали теневого DOM-дерева доступны только для деревьев с `{mode:'open'}`
Если теневое DOM-дерево было создано с `{mode: 'closed'}`, то после композиции путь будет начинаться с элемента-хозяина: `user-card` и дальше вверх по дереву. Этот метод следует тем же принципам, что и остальные. Внутреннее устройство закрытых DOM-деревьев совершенно скрыто.

## **Свойство: `event.composed`**

Большинство событий успешно всплывают сквозь границу теневого **DOM**. Но не все. Это поведение регулируется с помощью свойства `composed` объекта события. Если оно `true`, то событие пересекает границу. Иначе, оно может быть поймано лишь внутри теневого **DOM**. Если посмотреть в спецификацию UI Events, то большинство событий имеют `composed: true`: `blur, focus, focusin, focusout, click, dblclick, mousedown, mouseup mousemove, mouseout, mouseover, wheel, beforeinput, input, keydown, keyup`.
Все события курсора и сенсорные события также имеют `composed: true`.

Хотя есть и события, имеющие `composed: false`: `mouseenter, mouseleave (они вообще не всплывают), load, unload, abort, error, select, slotchange`.
Эти события могут быть пойманы только на элементах того же **DOM**, в котором находится целевой элемент события.

## **Генерация событий**

Когда мы генерируем своё событие, то, чтобы оно всплывало за пределы компонента, нужно установить оба свойства: `bubbles` и `composed` – в значение `true`. Например, здесь мы создаём элемент `div#inner` в теневом DOM-дереве элемента `div#outer` и генерируем на нём два события. Только одно с флагом `composed: true` выйдет наружу, в документ:

````js
<div id="outer"></div>

<script>
outer.attachShadow({mode: 'open'});

let inner = document.createElement('div');
outer.shadowRoot.append(inner);

/*
div(id=outer)
  #shadow-dom
    div(id=inner)
*/

document.addEventListener('test', event => alert(event.detail));

inner.dispatchEvent(new CustomEvent('test', {
  bubbles: true,
  composed: true,
  detail: "composed"
}));

inner.dispatchEvent(new CustomEvent('test', {
  bubbles: true,
  composed: false,
  detail: "not composed"
}));
</script>
````

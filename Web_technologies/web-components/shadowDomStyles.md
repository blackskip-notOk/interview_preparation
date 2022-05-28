# **Настройка стилей теневого DOM**

Теневой **DOM** может содержать теги `<style>` и `<link rel="stylesheet" href="…">`. В последнем случае таблицы стилей кешируются по протоколу **HTTP**, так что они не будут загружаться повторно при использовании одного шаблона для многих компонентов.

Как правило, локальные стили работают только внутри теневого **DOM**, а стили документа – вне его. Но есть несколько исключений.

**Селектор `:host`** позволяет выбрать элемент-хозяин (элемент, содержащий теневое дерево). Например, мы создаём элемент `<custom-dialog>` который нужно расположить по-центру. Для этого нам необходимо стилизовать сам элемент `<custom-dialog>`.

Это именно то, что делает `:host`:

````js
<template id="tmpl">
  <style>
    /* стиль будет применён изнутри к элементу <custom-dialog> */
    :host {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: inline-block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <slot></slot>
</template>

<script>
customElements.define('custom-dialog', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'}).append(tmpl.content.cloneNode(true));
  }
});
</script>

<custom-dialog>
  Hello!
</custom-dialog>
````

## **Каскадирование**

Элемент-хозяин находится в светлом **DOM**, поэтому к нему применяются CSS-стили документа. Если есть некоторое свойство, стилизованное как в `:host` локально, так и в документе, то стиль документа будет приоритетным. Например, если в документе из примера поставить:

````js
<style>
custom-dialog {
  padding: 0;
}
</style>
````

то `<custom-dialog>` будет без `padding`.

Можно задать стили «по умолчанию» в компоненте в его правиле `:host`, а затем, при желании, легко переопределить их в документе. Исключение составляет тот случай, когда локальное свойство помечено как `!important`, для таких свойств приоритет имеют локальные стили.

** `:host(selector)` То же, что и `:host`, но применяется только в случае, если элемент-хозяин подходит под селектор `selector`. Например, мы бы хотели выровнять по центру `<custom-dialog>`, только если он содержит атрибут `centered`:

````js
<template id="tmpl">
  <style>
    :host([centered]) {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-color: blue;
    }

    :host {
      display: inline-block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <slot></slot>
</template>

<script>
customElements.define('custom-dialog', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'}).append(tmpl.content.cloneNode(true));
  }
});
</script>


<custom-dialog centered>
  Centered!
</custom-dialog>

<custom-dialog>
  Not centered.
</custom-dialog>
````

Теперь дополнительные стили для выравнивания по центру применяются только к первому элементу: `<custom-dialog centered>`.

## **Применение стилей к содержимому слотов**

Элементы слотов происходят из светлого **DOM**, поэтому они используют стили документа. Локальные стили не влияют на содержимое слотов.
В примере ниже текст в `<span>` жирный в соответствии со стилями документа, но не берёт `background` из локальных стилей:

````js
<style>
  span { font-weight: bold }
</style>

<user-card>
  <div slot="username"><span>John Smith</span></div>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
      span { background: red; }
      </style>
      Имя: <slot name="username"></slot>
    `;
  }
});
</script>
````

В результате текст жирный, но не красный. Если мы хотим стилизовать слотовые элементы в нашем компоненте, то есть два варианта.

* можно стилизовать сам `<slot>` и полагаться на наследование **CSS**:

````js
<user-card>
  <div slot="username"><span>John Smith</span></div>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
      slot[name="username"] { font-weight: bold; }
      </style>
      Имя: <slot name="username"></slot>
    `;
  }
});
</script>
````

Здесь `<span>John Smith</span>` выделяется жирным шрифтом, потому что наследование **CSS** действует между `<slot>` и его содержимым. Но в **CSS** как таковом не все свойства наследуются.

* использовать псевдокласс `::slotted(селектор)`. Соответствует элементам, если выполняются два условия:

1. Это слотовый элемент, пришедший из светлого **DOM**. Имя слота не имеет значения. Просто любой элемент, вставленный в `<slot>`, но только сам элемент, а не его потомки.
2. Элемент соответствует селектору.

В нашем примере `::slotted(div)` выбирает в точности `<div slot="username">`, но не его дочерние элементы:

````js
<user-card>
  <div slot="username">
    <div>John Smith</div>
  </div>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
      ::slotted(div) { border: 1px solid red; }
      </style>
      Name: <slot name="username"></slot>
    `;
  }
});
</script>
````

Селектор `::slotted` не может спускаться дальше в слот. Эти селекторы недействительны:

````js
::slotted(div span) {
  /* наш слот <div> не соответствует этому */
}

::slotted(div) p {
  /* не может войти в светлый DOM */
}
````

Кроме того, `::slotted` можно использовать только в **CSS**. Мы не можем использовать его в `querySelector`.

## **CSS-хуки с пользовательскими свойствами**

Пользовательские свойства **CSS** существуют одновременно на всех уровнях, как светлом, так и в тёмном **DOM**. Например, в теневом **DOM** можно использовать CSS-переменную `--user-card-field-color` для стилизации полей, а документ будет её устанавливать:

````js
<style>
  .field {
    color: var(--user-card-field-color, black);
    /* если переменная --user-card-field-color не определена, будет использован цвет black */
  }
</style>
<div class="field">Имя: <slot name="username"></slot></div>
<div class="field">Дата рождения: <slot name="birthday"></slot></div>

user-card {
  --user-card-field-color: green;
}
````

Пользовательские **CSS** свойства проникают через теневой **DOM**, они видны повсюду, поэтому внутреннее правило `.field` будет использовать его.

Вот полный пример:

````js
<style>
  user-card {
    --user-card-field-color: green;
  }
</style>

<template id="tmpl">
  <style>
    .field {
      color: var(--user-card-field-color, black);
    }
  </style>
  <div class="field">Имя: <slot name="username"></slot></div>
  <div class="field">Дата рождения: <slot name="birthday"></slot></div>
</template>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.append(document.getElementById('tmpl').content.cloneNode(true));
  }
});
</script>

<user-card>
  <span slot="username">John Smith</span>
  <span slot="birthday">01.01.2001</span>
</user-card>
````

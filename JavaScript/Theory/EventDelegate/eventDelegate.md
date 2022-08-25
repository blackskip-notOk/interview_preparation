# **Делегирование событий**

это приём, заключающийся в добавлении обработчиков событий к родительскому элементу, а не к дочерним элементам. Обработчик будет срабатывать всякий раз, когда событие будет запущено на дочерних элементах благодаря всплытию событий в `DOM`.
Преимущества этого приёма:

* Экономит объем используемой памяти, т.к. для родительского элемента требуется только один обработчик.
* Не нужно привязывать или убирать обработчики при добавлении и удалении элементов.

***

````html
<ul id="parent-list">
 <li id="post-1">Item 1</li>
 <li id="post-2">Item 2</li>
 <li id="post-3">Item 3</li>
 <li id="post-4">Item 4</li>
 <li id="post-5">Item 5</li>
 <li id="post-6">Item 6</li>
</ul>
````

Let's also say that something needs to happen when each child element is clicked. You could add a separate event listener to each individual `li` element, but what if `li` elements are frequently added and removed from the list? Adding and removing event listeners would be a nightmare, especially if addition and removal code is in different places within your app. The better solution is to add an event listener to the parent `ul` element. when the event bubbles up to the `ul` element, you check the `event` object's `target` property to gain a reference to the actual clicked node:

````js
document.getElementById("parent-list").addEventListener("click", function(e) {
 if(e.target && e.target.nodeName == "li") {
  console.log("List item ", e.target.id.replace("post-", ""), " was clicked!");
 }
});
````

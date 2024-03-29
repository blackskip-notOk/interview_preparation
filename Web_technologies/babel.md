# **Babel**

## **Ссылки**

* [**Использование Babel**](#использование-babel)
* [**Преимущества и недостатки использования**](#преимущества-и-недостатки-использования)
* [**Почему можно обойтись без Babel**](#почему-можно-обойтись-без-babel)

**Babel** - это транспайлер, который переписывает код современного стандарта **Javascript** на более поздний. Он также может выполнять и другие задачи, такие как преобразование синтаксиса JSX.

**Транспайлер** - это программа, позволяющая менять исходный код одной программы на эквивалентный исходный код на другом языке.

## **Использование Babel**

**ECMA International** выпускает обновления языка **Javascript** каждый год. Соответственно, не все современные браузеры могут идти в ногу с этими изменениями. А еще, к этому прибавляем старые браузеры, которые больше никогда не обновятся. Но их все равно пока используют. Babael помогает не ждать обновлений браузеров, а сразу использовать всю мощь современных стандартов **Javascript**.
Используют **Babel** вместе с различными сборщиками проектов: **webpack** и **gulp**, устанавливая необходимый “функционал” с помощью менеджера пакетов **NPM**.

## **Преимущества и недостатки использования**

Преимущества:

* базовая установка относительно несложная.
* у **Babel** есть большое сообщество для поддержки и постоянных обновлений.

Недостатки:

* медленное время компиляции
* множество зависимостей, даже если они являются дев-зависимостями.
* 39М использованного дискового пространства
* 5728 установленных файлов

## **Почему можно обойтись без Babel**

### **Не поддерживать древние браузеры.**

Если бы пользователи просто обновили свои браузеры, мы могли бы избежать хлопот, связанных с транспилированием. Но, например, крупным корпорациям приходится поддерживать старое программное обеспечение. Классическим примером является Internet Explorer.

1. Какие браузеры в настоящее время используют Ваши клиенты?
Если у вас уже есть веб-сайт или приложение, которое обслуживает одну и ту же клиентскую базу, вы можете получить эту информацию из программы аналитики. Если у вас не установлено аналитическое программное обеспечение, вы не будете знать, какие браузеры вам нужно поддерживать. Вы должны будете сделать обоснованное предположение. Когда вы поддерживаете браузер, то принимаете на себя обязательства. Должна быть ясная финансовая причина, чтобы пойти на все эти хлопоты.

2. Какие современные функции браузера вы хотите использовать? Использование современных функций языка и API браузера делает написание кода проще, быстрее и интереснее. Если вам нравиться писать **ES5** и использовать `XMLHttpRequest()`, тогда определенно не нужен **Babel**, но может потребоваться какая-нибудь специальная процедура.

3. Какие современные функции браузера поддерживают браузеры ваших клиентов? Эти данные доступны через Can I use, но это напрасная трата времени на их поиск вручную. Если вы знаете названия браузеров, которые вы хотите поддерживать, поиск совместимых функций может быть автоматизирован с помощью приложения Browserlist.

### **eslint-plugin-compat**

Вы можете вообще избежать всего процесса переноса и вместо этого позволить вашему редактору кода предупредить вас, если вы используете какие-либо функции, которые слишком сложны для браузеров ваших клиентов. Это самый простой вариант, потому что он:

* исключает любую зависимость от транспилиров (transpilers)
* если имеется современная функция, без которой вы не можете жить, то ее можно использовать применив полифил

Для проверки совместимости API браузера используйте `eslint-plugin-compat`. Он использует ту же самую конфигурацию **Browserlist** и остальные инструменты, что и **Babel**. **Browserlist** автоматически выбирает список браузеров, основываясь на различных критериях, которые Вы ему предоставляете. Список браузеров, поддерживаемых defaults для browserlist:

* '> 0,5 процента (версии браузеров, выбранные по глобальной статистике использования)
* Последние две версии каждого браузера
* Firefox ESR (Extended Support Release)
* not dead браузеры без официальной поддержки и обновлений в течение 24 месяцев.

### **другое программное обеспечение для замены Babel**

* **Swc** — конкурент **Babel**. Он написан на языке программирования **Rust** и в 20 раз быстрее. Swc имеет гораздо меньше зависимостей (установлено 43 пакета). Но в **Swc** не все функции **Babel** поддерживаются и у **Swc** меньшая пользовательская база и количество постоянных участников.

* **Google Closure Compiler** и **TypeScript**. **Google Closure Compiler** сложен в использовании. Тем не менее, он может сделать хорошую работу по транспилированию и  полифилингу. Можно использовать **TypeScript** для переноса, но это неуклюжее решение, которое может с легкостью создать больше проблем, чем решить их.
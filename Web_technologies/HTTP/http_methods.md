# **Методы в HTTP протоколе**

Методы в **HTTP** протоколе определяет способ обращения клиента к серверу и, соответственно, какую информацию хочет получить или передать клиент серверу. **HTTP** сервер можно настроить так, чтобы он выполнял некоторые методы, а некоторые игнорировал, это сделано в целях безопасности. Такие настройки можно производить, как для сервера целиком, так и для отдельных ресурсов на **HTTP** сервере.

Методы в **HTTP** протоколе делятся на безопасные и идемпотентные.

* Безопасные методы (Safe method HTTP). На данный момент принято соглашение о том, что HTTP методы **GET** и **HEAD** никогда не должны иметь иного значения, кроме загрузки, поэтому данные **HTTP** методы нужно рассматривать, как безопасные.
* Идемпотентные HTTP методы (Idempotent Methods HTTP). При использование таких методов побочные эффекты одинаковы как в случае однократного запроса, так и в случае многократного повторения одного и того же запроса, т.е. нагрузка одинакова, но ответ от сервера может поступать каждый раз разный. К идемпотентным методам относятся следующие методы: **GET**, **HEAD**, **PUT**, **DELETE**, **OPTIONS** и **TRACE**.

1. **GET** позволяет получать информацию с сервера. Информация, получаемая от сервера может быть любой, главное, чтобы она была в форме **HTTP** объекта, доступ к информации при использовании **GET** осуществляется через **URI**. Запросы клиентов, использующие метод **GET** должны получать только данные и не должны никак влиять на эти данные.
Сервер может кэшировать ответы на запросы **GET**, но при соблюдение определенных требований. Часто бывает так, что **GET** обращается к какому-то коду, а не к конкретной страницы (все CMS генерируют контент налету), поэтому **GET** работает так, что мы получаем не исходный код, который генерирует текст, а сам текст. **GET** бывает двух видов: условный и частичный.
Когда используется условный **GET**, то к **HTTP** сообщению добавляются следующие поля заголовков: **If-Modified-Since**, **If-Unmodified-Since**, **If-Match**, **If-None-Match**, или **If-Range**. Значение таких полей является какое-либо условие и если это условие выполняется, то происходит передача объекта, который хранится по указанному **URI**, если же условие не выполняется, то и сервер не передает никаких данных. Условный **GET** предназначен для уменьшения нагрузки на сеть. Особенность частичного **GET** заключается в том, что в его заголовке присутствует поле **Range**. Когда используется частичный **GET** полезная информация, предназначенная для человека передается кусками, после чего она из этих кусков собирается.

2. Метод **HEAD** работает точно так же, как **GET**, но в ответ сервер посылает только заголовки и статусную строку без тела **HTTP** сообщения. Обычно **HEAD** используется для получения метаинформации об объекте без пересылки тела **HTTP** сообщения. **HEAD** часто используется для тестирования **HTTP** соединений и достижимости узлов и ресурсов, так как нет необходимости гонять по сети содержимое, тестирование **HTTP** **HEAD** производится гораздо быстрее. Сервер может кэшировать свои ответы на запросы с **HEAD**. Еще одно применение **HEAD** заключается в обсуждение **HTTP** содержимого.

3. Метод **POST** нужен чтобы клиенты могли: оставлять сообщения на различных Интернет-ресурсах, передавать информацию о себе, заполняя HTML формы... То, как будет работать **POST** определяется исключительно на стороне сервера и обычно зависит от запрашиваемого **URI**. Если сравнить **URI**, которому обращается клиент и сообщение, которое он хочет отправить с файловой системой, то **URI** – это папка, а сообщение клиента – это файл, который лежит в папке. В результате выполнения **POST** сервер не обязательно в качестве ресурса выдает **URI**, код состояния сервера при использовании **POST** может быть 200 (в этом случае вы получите какой-либо ресурс), либо 204 (в этом случае вы не получите никакого содержимого). Ответы сервера на **POST** не кэшируются, но это можно сделать принудительно, если использовать поле **Cache-Control** или **Expires** в заголовке.

4. Метода **PUT** используется для загрузки содержимого запроса на указанный в этом же запросе **URI**. То есть запрос **PUT** уже заранее содержит в теле сообщения какой-то объект, который должен быть сохранен на сервере по адресу, который указан в **URI**. Но если по данному **URI** уже есть какие-либо данные, то данные, поступающие из запроса **PUT**, считаются модификацией. Если запрос **PUT** обращается к не существующему **URI**, то сервер создает новый **URI** и сообщает об этом клиенту. Если ресурс успешно создан по средствам **PUT**, то сервер возвращает ответ с кодом состояния 201, если ресурс успешно модифицирован, то сервер вернет код 200, либо 204. Если по каким-либо причинам серверу не удается создать ресурс, то в ответ клиенту он высылает описание проблемы, возможно, с кодом ошибки клиента или кодом ошибки сервера. Ответы сервера **PUT** не кэшируются. **POST** и **PUT** выполняют совершенно разные операции. **POST** обращается к ресурсу (странице или коду), которая содержит механизмы обработки сообщения **POST**, а вот **PUT** создает какой-то объект по **URI**, указанному в сообщении **PUT**.

5. Метод **DELETE** удаляет указанный в **URI** ресурс. Действие **DELETE** может быть отменено вмешательством администратора **HTTP** сервера или программным кодом. Даже в том случае, когда сервер отправит вам код 200 после обработки **DELETE**, это не будет означать, что ресурс удален, это означает, что сервер понял и обработал запрос. Ответы сервера **DELETE** не кэшируются.

6. Метод **CONNECT** преобразует существующее соединение в прозрачный **TCP/IP** туннель. **CONNECT** используется в основном для шифрования соединения.

7. Метод **OPTIONS** используется для получения параметров текущего **HTTP** соединения и другой служебной информации. **OPTIONS** не производит никаких действий с самим ресурсом. Сервер отвечает на запрос **OPTIONS** только опциями соединения, например он посылает поля заголовков **Allow**, но не пошлет **Content-Type**, ответы сервера на запросы **OPTIONS** не кэшируются. Если в качестве **URI** указана звездочка «*», то параметры соединения передаются для сервера в целом, а не для какого-то конкретного **URL**. Этот метод не самый безопасный для сервера, поэтому зачастую клиенты его не могут применять из-за настроек безопасности.

8. Метод **TRACE** создает петлю, благодаря которой клиент может увидеть, что происходит с сообщением на всех узлах передачи. У сообщений **TRACE** есть конечный получатель, конечный получатель определяется значением поля заголовка **Max-Forwards:** первый сервер, прокси-сервер или шлюз, получивший данное сообщение с значением **Max-Forwards 0** является конечным получателем. Запросы **TRACE** не должны содержать объектов. **TRACE** применяется для диагностики, он позволяет видеть клиенту, что происходит в каждом звене цепочки между компьютером клиента и конечным получателем, для этого существует специальное поле **Via**. Ответы сервера **TRACE** не кэшируются.
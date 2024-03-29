# **HTTP**

## **Ссылки**

* [Терминология HTTP](./http_termins.md)
* [Клиенты и серверы HTTP протокола](#клиенты-и-серверы-http-протокола)
* [Требования HTTP протокола](#требования-http-протокола)
* [Структура HTTP протокола](#структура-http-протокола)
* [Параметры HTTP протокола](#параметры-http-протокола)
* [Методы в HTTP протоколе](./http_methods.md)
* [Обсуждение содержимого в HTTP протоколе](#обсуждение-содержимого-в-http-протоколе)
* [Коды состояния в HTTP протоколе](./http_codes.md)
* [Кэширование HTTP протокола](#кэширование-http-протокола)
* [Безопасность HTTP протокола](#безопасность-http-протокола)
* [Кодирование содержимого в HTTP](#кодирование-содержимого-в-http)
* [Медиа типы в HTTP](#медиа-типы-в-http)
* [Проверка подлинности доступа в HTTP](#проверка-подлинности-доступа-в-http)
* [РАЗНИЦА МЕЖДУ HTTP/1.1 И HTTP/2 И HTTP/3](./http1.1_vs_http2_vs_http3.md)
* [HTTP Cookie](./http_cookie.md)

**HTTP** (HyperText Transfer Protocol) – это протокол седьмого уровня модели OSI для передачи данных, в основе которого лежит архитектура взаимодействие клиент-сервер. **HTTP** осуществляет доступ к веб-ресурсам и обмен данными между пользовательскими приложениями. По сути **HTTP** обеспечивает работу интернета. Иногда **HTTP** используется как транспорт для других протоколов: **SOAP**, **XML-RPC** и другие. Благодаря **HTTP** синтаксис и семантика, используемые программными элементами веб-архитектуры клиентов, серверов и прокси-серверов, определены таким образом, чтобы они могли взаимодействовать. Кроме того, это протокол без сохранения состояния, что означает, что он не хранит никакой информации о предыдущих подключениях. Также используется для доставки изображений и других элементов, из которых состоит веб-сайт, которые будут доступны через браузер или приложения.

Когда вы используете **HTTP(S)**, на самом деле вы используете несколько протоколов, кроме **HTTP**, и у каждого протокола в стеке свои функции и обязанности. Например, **HTTP** занимается **URL** и интерпретацией данных, **TLS** отвечает за безопасность, обеспечивая шифрование, **TCP** обеспечивает надёжную передачу данных, повторно отправляя потерянные пакеты, а **IP** направляет пакеты из одной конечной точки в другую по промежуточным устройствам.
Такая слоистая структура позволяет повторно использовать функции каждого протокола по отдельности. Протоколы на более высоком уровне (например HTTP) не должны сами реализовывать некоторые сложные функции (вроде шифрования), потому что этим занимаются протоколы ниже (например TLS).
***

## **Клиенты и серверы HTTP протокола**

Передача данных по **HTTP** осуществляется через **TCP/IP** соединение. Машина, которая выступает в роли сервера использует восьмидесятый **TCP** порт или порт **8080**. Клиентские приложения, которые используют **HTTP** обычно настроены на использование 80-го порта для соединения с сервером.

**HTTP** сервер или веб-сервер – это программа, которая понимает, что нужно клиенту и выдает ему ответы в виде **HTML** страниц, на которых может содержаться различная информация: изображения, тексты, скрипты, файлы, медиа данные (видео и аудио) и многое другое. **HTTP** сервер принимает **HTTP** запрос от клиента (клиентом может быть браузер, мобильный телефон, телевизор или электрочайник, если у него есть функция выхода в интернет) и дает ему **HTTP** ответ, в нагрузку к **HTTP** ответу не обязательно должен идти ответ в виде **HTML** страницы, данные могут быть и другими.

Самым распространенным примером клиента **HTTP** протокола является браузер.

Основные функции, которые выполняет **HTTP** сервер:

* основной функцией является поддержка взаимодействия между компьютерами в сети по **HTTP**;
* может вести свои журналы: ошибок, обращений пользователей и другие;
* шифрование данных;
* должен уметь распределять нагрузку;
* сжимать содержимое ответов;
* может быть конечным, а может быть транзитным, во втором случае его называют прокси;
* должен уметь кэшировать;
* сервера **HTTP** версии 1.1 должны поддерживать постоянные **HTTP** соединения;
* должны уметь управлять **HTTP** обсуждением;
* и многое другое.

Серверы **HTTP** протокола можно условно разделить на два вида: исходные сервера и прокси-сервера. К исходным серверам относятся те сервера, к которым непосредственно обращается клиент, прокси-сервера **HTTP** – это транзитные сервера между клиентом и тем сервером, к которому он желает обратиться. Зачастую бывает так, что **HTTP** сервер выполняет одновременно функцию и конечного сервера, и прокси-сервера, а иногда и клиента. Примеры конечных **HTTP** серверов:

* Apache HTTP Server – наиболее популярный и распространенный **HTTP** сервер, используется для **Unix** систем, но есть версии и для ОС семейства Windows. Данный HTTP сервер является свободным;
* IIS – веб-сервер от компании Microsoft, распространяется бесплатно с операционными система семейства Windows;
* Google Web Server – этот веб-сервер распространяется и поддерживается компанией Гугл, за основу они взяли HTTP сервер Apache и доработали его.
* Cherokee – свободный веб-сервер, особенность которого заключается в том, что управлять им можно только через веб-интерфейс.
* CERN httpd;
* nginx свободный **HTTP** сервер, разрабатываемый российским программистом Игорем Сысоевым, стоит отметить, что многие крупные проекты использует веб-сервер Игоря Сысоева.;
* lighthttod.

Прокси-сервера:

* Squid;
* UserGate;
* nginx.

На самом деле список гораздо шире, внутренняя реализация у серверов может быть разной, но правила **HTTP** протокола они должны выполнять в точности. Для обычного пользователя работа сервера – это его интимное дело, а вот у веб-администратора есть необходимость знать тот или иной программный продукт, чтобы сделать работу пользователя или разработчика наиболее эффективной и комфортной.
***

## **Требования HTTP протокола**

Требования в **HTTP** можно разделить на три категории:

1. необходимые - должны выполняться в любом случае, приложение должно на 100% обеспечить работу таких требований, иначе оно не будет соответствовать **HTTP** стандарту и, как следствие, разработанное приложение не сможет взаимодействовать с другими по **HTTP**;
2. рекомендуемые - должны быть соблюдены и соблюдаются в том случае, если этому требованию не противоречит что-то более серьезное;
3. возможные - такие требования реализуются в приложениях по необходимости и зависят от функционала программы..

Реализация будет несовместима со стандартом **HTTP**, если будет нарушено хотя бы одно необходимое требование протокола **HTTP**. Если приложение удовлетворяет всем необходимым **HTTP** требованиям и всем рекомендуемым требованиям **HTTP**, то оно полностью совместимо со стандартом **HTTP**, если приложение частично удовлетворяет рекомендуемым **HTTP** требованиям, то по стандарту **HTTP** оно считается условно совместимым.
***

## **Структура HTTP протокола**

Структура **HTTP** протокола – это сообщение плюс соединение. Сообщение обычно состоит из трех частей, которые передаются и клиентами, и серверами в следующем порядке:

1. Стартовая строка или строка состояния, которая определяет тип **HTTP** сообщения. Стартовая строка обязательна для любого сообщения.
2. Заголовок **HTTP** сообщения, который может включать одно поле Host или несколько полей для передачи различной служебной информации.
3. Тело **HTTP** сообщения, которое содержит **HTTP** объекты. Тело сообщения служит для передачи пользовательской информации и есть не у каждого **HTTP** сообщения.

***

## **Параметры HTTP протокола**

У **HTTP** протокола есть параметры, которые являются механизмом управления взаимодействия между клиентом и сервером. И которые определяют то, в каком виде информация будет передана по **HTTP** протоколу:

1. Версия **HTTP** протокола является его обязательным параметром и указывается в первой строке любого **HTTP** сообщения.
2. **URI** – это параметр, который позволяет однозначно идентифицировать ресурс, который хочет запросить клиент.
3. Дата и время.
4. **HTTP** протокол имеет параметры кодирования сообщений и кодирования передачи.
5. Тип данных или медиа тип.
6. Лексемы программ позволяют определить разработчика **HTTP** приложения и версию приложения.
7. Метка языка - параметры, которые позволяют определить язык сообщения.
8. Единицы измерения диапазонов, которые позволяют запросить только часть ресурса.

Основной и единственной единицей измерения в **HTTP** протоколе является байт. Основным и единственным способом общения в **HTTP** протоколе является **HTTP** сообщение. Сообщения делятся на два вида:

1. **HTTP** запрос – это сообщение, которое клиент посылает серверу
2. **HTTP** ответ – это сообщение, которое сервер посылает клиенту.

У запросов и ответов есть общие служебные заголовки, которые могут быть использованы, как при запросе, так и при ответе **HTTP** сервера. Есть группа заголовков относящихся к объектам (телу сообщения), они все могут быть использованы, как в запросах, так и в ответах, за исключением поля заголовка **Allow**, которое используется только в ответах сервера. У **HTTP** сообщения есть длина, которая измеряется в байтах, если у **HTTP** сообщения есть тело, то для определения длины сообщения действуют следующие правила по порядку:

1. Любое **HTTP** сообщение ответа сервера, которое не должно включать тело сообщения, всегда должно быть завершено пустой строкой после заголовков.
2. Если в заголовках **HTTP** сообщений присутствует поле **Transfer-Encoding** (кодирование HTTP) при этом у этого поля значение **chunked**, то длину **HTTP** сообщения следует определять методом кодирования по кускам (chunked encoding).
3. Если у заголовка **HTTP** сообщения есть поле **Content-Length**, то значение, которое записано в **Content-Length** является длиной **HTTP** сообщения, измеряется в байтах.
4. Если **HTTP** сообщение использует медиа типы **«multipart/byteranges»**, который само разграничен, то он и определяет длину.
5. Длина **HTTP** сообщения определяется закрытием соединения со стороны сервера.

Пример запроса в HTTP протоколе:

```` http
PHP
POST /cgi-bin/process.cgi HTTP/1.1

User-Agent: Mozilla/4.0 (compatible; MSIE5.01; Windows NT)

Host: www.example.com

Content-Type: application/x-www-form-urlencoded

Content-Length: length

Accept-Language: ru-ru

Accept-Encoding: gzip, deflate

Connection: Keep-Alive

licenseID=string&content=string&/paramsXML=string
````

Cначала идет статусная строка - версиz протокола HTTP и метод, который будет использован для обращения к ресурсу, а скрипт, находящийся по URL /cgi-bin/process.cgi будет использован для обработки данных. Статусная строка отделена символом CRLF в конце от заголовка, далее идет набор полей HTTP заголовка, которые отделяются друг от друга символом CRLF в конце строки. Если у одного поля есть несколько значений, то они отделяются друг от друга запятой. Тело сообщения отделено пустой строкой.

Пример ответа в протоколе HTTP:

```` http
PHP
HTTP/1.1 200 OK

Date: Mon, 27 Jul 2009 12:28:53 GMT

Server: Apache/2.2.14 (Win32)

Last-Modified: Wed, 22 Jul 2009 19:15:56 GMT

Content-Length: 88

Content-Type: text/html

Connection: Closed

<html>
<body>
<h1>Hello, World!</h1>
</body>
</html>
````

Синтаксис ответа в протоколе **HTTP** практически ничем не отличается, ключевым отличием является то, что в первой строке сервер посылает коды статуса.
***

## **Обсуждение содержимого в HTTP протоколе**

**HTTP** сервера должны отдавать максимально удобную и понятную информацию для клиента, поэтому было введено понятие или механизм обсуждения содержимого. Обсуждение в **HTTP** можно представить как переговоры между клиентской программой и **HTTP** сервером о том, в каком виде сервер должен отдавать полезную для пользователя информацию, так как не все клиенты способны одинаково визуализировать информацию. Прокол **HTTP** имеет два вида обсуждения: обсуждение, управляемое сервером и обсуждение, управляемое клиентом. Эти два вида обсуждения **HTTP** независимы друг от друга и могут использоваться вместе.
***

## **Кэширование HTTP протокола**

Одним из механизмов увеличения эффективности **HTTP** протокола является кэширование. Кэширование в HTTP протоколе позволяет снизить нагрузку на конечный сервер и транзитные сервера не только на седьмом уровне модели OSI, но и на четвертом и ниже. Кэширование в **HTTP** реализовывалось для того, чтобы избавиться от необходимости отправлять лишние запросы от клиента, а так же для того, чтобы сервер не отправлял ответы целиком так, как будто механизма кэширования нет вовсе. Кэширование управляется, как со стороны сервера, так и со стороны клиента, это необходимо для более точного и удобного восприятия содержимого конечным пользователем.

Сервер должен посылать кэшированные ответы с самой последней версией содержимого. При этом суть заключается в том, что клиент может получать данные не с конечного сервера, а с ближайшего сервера, у которого в кэше есть информация о том, что содержится в URI, который был указан в запросе, поэтому должны выполняться следующие правила:

* Проверка достоверности. Сервер, который дает ответ на запрос должен всегда быть в курсе о содержимом конечного сервера, к которому идет обращение.
* Новизна кэша. Новизна кэша определяется конечным сервером.
* Предупреждение. Транзитный сервер должен предупреждать клиента о том, что его информация из кэша не самая «свежая».

Если все эти правила будут соблюдены, можно спокойно утверждать о том, что клиент получит самую достоверную и новую информацию от транзитного сервера, при этом, не обращаясь к конечному.

Предупреждения при кэшировании отправляет сервер в поле заголовка **Warning** ответа в том случае, когда информация из кэша теряет свою актуальность. При этом клиент, получив такое сообщение может обратиться не к кэшу транзитного сервера, а к первоначальному серверу или предпринять какие-либо другие действия.

### **Механизмы управления кэшированием в HTTP**

С целью уменьшения нагрузки на сеть и повышения эффективности **HTTP** протокола был реализован механизм кэширования. Зачастую бывает так, что пользователь даже не догадывается о том, что страница, открытая в его браузере, подгрузилась не с сайта, к которому он обращался, а из кэша. **HTTP** протокол реализован так, что директивам должны следовать все участники цепочки между клиентом и конечным сервером. В версии **HTTP 1.1** в качестве механизмов управления кэшированием используется поле заголовка **Cache-Control**. Заголовок **Cache-Control** позволяет управлять кэшем, как клиенту, так и серверу при помощи директив, которые они передают вместе с ответами и запросами. При этом директивы, передаваемые в поле заголовка **Cache-Control**, отменяют значения по умолчанию для кэширования.

* Директивы поля заголовка **Cache-Control** для клиента и их описание:

1. **no-cache** - для последующего запроса ответ не должен отправляться из кэша без проверки с содержимым исходного сервера.
2. **no-store** - ни запрос клиента, ни ответ сервера не должны кэшироваться. Это сделано для безопасности.
3. **max-age** - кэш должен быть не старше времени, которое указано в секундах.
4. **max-stale** - клиент примет кэшированный ответ в том случае, если его возраст не превышает времени, указанного в секундах.
5. **min-fresh** - клиент примет кэшированный ответ в том случае, если время жизни кэша не больше указанных секунд.
6. **no-transform** - к запрашиваемому ресурсу не должно применяться никаких преобразований.
7. **only-if-cached** - клиент примет только кэшированный ответ, если подходящего ответа нет в кэше сервера, то делать ничего не надо.

* Директивы поля заголовка **Cache-Control** для сервера и их описание:

1. **Public** - ответ сервера можно сохранять в любом кэше.
2. **private** - ответ сервера нужно сохранять в закрытом кэше, который предназначен только для этого пользователя.
3. **no-cache** - кэшированный ответ не должен отправляться клиенту без его предварительной проверки.
4. **no-store** - ответ сервера нельзя сохранять в кэше.
5. **no-transform** - к ответу сервера не должно применяться никаких преобразований ни одним из узлов цепочки.
6. **must-revalidate** - если сообщение сервера устарело, то к нему должна применяться предварительная проверка.
7. **proxy-revalidate** - и предыдущая директива, но только для промежуточных серверов.
8. **max-age** - сколько живет кэш на сервере.
9. **s-maxage** - директива **max-age**, но для CDN-серверов

И клиентские, и серверные приложения должны уметь сравнивать данные из кэша, чтобы не гонять по сети лишний трафик и при этом конечный пользователь на свои запросы получал актуальную информацию. С этой целью в **HTTP** протокол было введено специальное поле **Last-Modified** и условные методы запроса с условными полям заголовка. В поле **Last-Modified** указывается дата и время создания кэшированной версии, значение этого поля может сравнивается со значением даты времени того момента, когда произошло последнее обновление оригинального ресурса и если значения совпадают, то данные клиенту поступают из кэша. Если клиент делает повторный запрос к одному и тому же ресурсу, то браузер может включить в сообщение клиента условное поле заголовка, сервер, получив такое поле, проанализирует содержимое ресурса, сравнит с тем, что он посылал ранее и если сравнение будет эквивалентным, то браузеру он вернет сообщение с кодом 304 (не модифицировано), после чего браузер выплюнит содержимое страницы из своего кэша для пользователя. **HTTP** протокол позволяет присваивать каждому **HTTP** объекту тэг в поле заголовка **ETag**, по сути, это хэш сумма самого объекта и для каждого неповторяющегося объекта она уникальная, поэтому механизм кэширования **HTTP** протокола активно использует данное поле для проверки актуальности данных, которые хранятся в кэше.
***

## **Безопасность HTTP протокола**

В **HTTP** протоколе нет механизмов шифрования и механизмов безопасности, базовая аутентификация по протоколу **HTTP** передает логин и пароль пользователя в незашифрованном виде. Но у **HTTP** протокола есть расширение **HTTPS**, которое использует **TCP** порт 433. Это расширение является связкой двух протоколов: **HTTP** и **SSL** или **HTTP** и **TLS** (По сути SSL – это более ранняя версия TLS протокола).

* Самый существенный недостаток базовой аутентификации на сервере и в то же время самая большая брешь в безопасности сервера заключается в том, что логин и пароль пользователя передается в сообщение в незашифрованном виде, поэтому стоит использовать дополнительные методы шифрования при использование базовой аутентификации.
Брешь в безопасности не ограничивается тем, что кто-то может перехватить запросы или ответы с незашифрованными данными, но и в том, что пользователь может вместо желаемого ресурса попасть на вредоносный клон, в котором он пройдет аутентификацию, тем самым оставив свои учетные данные злоумышленнику. Сервер может возвращать клиенту сообщение с кодом состояния 401 и вместе с кодом ошибки 401 сервер может отправить список методов аутентификации в том порядке, в котором настроит администратор, обычно в порядке уменьшения безопасности, для этого сервер использует поле заголовка **WWW-Authenticate**.

* Сервер обычно записывает в специальный файл все запросы пользователя и ответы на них, то есть ведет лог. На некоторых сайтах лог запросов может представлять интерес для злоумышленников. Поэтому реализации серверов должны позаботиться о безопасности лога запросов.

* **HTTP** универсальный протокол передачи данных, а это значит, то по данному протоколу можно передавать, в принципе, любую информацию. Так же у **HTTP** нет никаких средств или механизмов, которые могли бы отрегулировать содержимое сообщения. Собственно, передача содержимого и безопасность передачи содержимого лежит на клиентском и серверном программном обеспечение, поэтому к небезопасным полям заголовка **HTTP** сообщения можно отнести: **Server**, **Via**, **Referer**, **From**. Так как они могут помочь идентифицировать название и версии программ и, соответственно, воспользоваться багами этих программ, а также по этим поля можно узнать **URI**, на которые заходил пользователь, или узнать его контактные данные.

* Основной задачей **DNS** сервера является преобразование доменных имен сайта в IP-адреса и наоборот. Соответственно, **URI**, который мы пишем в **HTTP** запросе будет транслироваться в **IP** адрес для успешной связи с сервером на третьем уровне модели **OSI**. Аспект безопасность соединения по **HTTP** протоколу, связанному с подменой **DNS**, целиком и полностью лежит на бразуерах. Каждый браузер имеет собственные механизмы и реализации.

***

## **Кодирование содержимого в HTTP**

**HTTP** имеет параметр кодирования содержимого, который определяет какая таблица или какой метод кодирования будет применен к содержимому. Кодирование содержимого используется  обычно для сжатия информации и обычно без потерь полезного содержимого этой информации. Иногда бывает так, что информация хранится на сервере уже в закодированной форме, а когда она поступает к клиенту, то происходит декодирование.

Accept-encoding: gzip или Accept-encoding: compress или Accept-encoding: deflate

Все значения кодирования содержимого (content-coding) не чувствительны к регистру. **HTTP** версии 1.1 использует значения кодирования содержимого (content-coding) в полях заголовка **AcceptEncoding** и **Content-Encoding**. Хотя значение описывает кодирование содержимого, но, что более важно — оно указывает, какой механизм декодирования потребуется для обратного процесса.

* gzip. Формат кодирования, производящий сжатие файла программой «gzip» (GNU zip).
* compress. Формат кодирования, производимый общей программой «compress» для сжатия UNIX файлов.
* deflate. Формат zlib, в комбинации с механизмом сжатия «deflate», описанным в RFC 1951.

Кодирование передачи влияет на способ кодирования тела объекта. Кодирования передачи в **HTTP** отличается от кодирования содержимого тем, что первое – это свойство **HTTP** сообщения, а не содержимого. Кодирования передачи в **HTTP** — это аналоги значений **Content-Transfer-Encoding MIME**, которые были разработаны для обеспечения безопасной передачи двоичных данных при использовании 7-битного обслуживания передачи. В **HTTP** единственная опасная характеристика тела сообщения вызвана сложностью определения точной длины тела сообщения, или желанием шифровать данные при пользовании общедоступным транспортом. Кодирование по кускам (chunked encoding) изменяет тело сообщения для передачи его последовательностью кусков, каждый из которых имеет собственный индикатор размера, сопровождаемым опциональным завершителем, содержащим поля заголовка объекта. Это позволяет динамически создаваемому содержимому передаваться вместе с информацией, необходимой получателю для проверки полноты получения сообщения.Кодирование по кускам (chunked encoding) оканчивается куском нулевого размера, следующим за завершителем, оканчивающимся пустой строкой. Цель завершителя состоит в эффективном методе обеспечения информации об объекте, который сгенерирован динамически; **HTTP** приложения не должны посылать в завершителе поля заголовка, которые явно не предназначены для использования в завершителе, такие как **Content-MD5** или будущие расширения **HTTP** для цифровых подписей и других возможностей. Все **HTTP/1.1** приложения должны быть в состоянии получать и декодировать кодирование передачи «по кускам» («chunked» transfer coding), и должны игнорировать расширения кодирования передачи, которые они не понимают. Серверу, который получил тело объекта со значением кодирования передачи, которое он не понимает, следует возвратить ответ с кодом состояния 501 и разорвать **HTTP** соединение. Сервер не должен посылать поля кодирования передачи (transfer-coding) **HTTP/1.0** клиентам.
***

## **Медиа типы в HTTP**

**HTTP** использует медиа типы интернета в полях заголовка **Content-Type** и **Accept** с целью поддержания расширяемой типизации данных. Общий синтаксис медиа типов в HTTP выглядит так:

```` http
media-type = type "/" subtype *( ";" parameter )
type = token
subtype = token
Параметры могут следовать за type/subtype в форме пар атрибут/значение (attribute/value):
parameter = attribute "=" value
attribute = token
value = token | quoted-string
Accept: image/gif
````

Тип, подтип, и имена атрибутов и параметров не чувствительны к регистру. Значения параметров могут быть чувствительными к регистру, но могут быть и не чувствительны, в зависимости от семантики имени параметра. Линейный пробел (LWS) не должен использоваться между типом и подтипом, между атрибутом и значением. Агенты пользователей, распознающие медиа типы, должны обрабатывать (или подготавливать для обработки любыми внешними приложениями) параметры для тех типов **MIME**, которые описаны, и сообщать пользователю о обнаруженных проблемах. Некоторые старые приложения не распознают параметры медиа типов. При посылке данных к таким приложениям реализации должны использовать параметры медиа типов только когда это требуется по определению типа/подтипа.

* Медиа подтип **text**. В канонической форме медиа подтипы типа «text» используют CRLF в качестве метки конца строки. **HTTP** ослабляет это требование и позволяет передавать текст размеченный таким образом, что единичные CR или LF могут быть метками конца строки, правда это правило должно быть выполнено для всего тела объекта (entity-body). **HTTP** приложения должны воспринимать CRLF, просто CR, и просто LF как представление конца строки в текстовых типах, переданных по **HTTP**. Кроме того, если текст представляется в кодовой таблице, которая не использует октеты 13 и 10 для CR и LF соответственно, что имеет место в некоторых многобайтовых кодовых таблицах, то **HTTP** позволяет использовать любые последовательности байтов, определенные этим набором символов для представления эквивалентов CR и LF в качестве кода конца строки. Эта гибкость в отношении концов строк применима только к текстовым типам в теле объекта; просто CR или просто LF не должны заменять CRLF внутри любой управляющей структуры **HTTP** (типа поля заголовка и разделителей типа multipart). Параметр «charset» используется с некоторыми медиа типами для указания кодовой таблицы, используемой для представления данных. Если параметр «charset» не указан отправителем, то при получении **HTTP** сообщения медиа подтипы типа «text» имеют значение «charset», по умолчанию равное «ISO-8859-1». Данные в кодовых таблицах или их подмножествах, отличных от «ISO-8859-1» должны быть помечены соответствующим значением «charset».

**MIME** предусматривает ряд типов **«multipart»** — формирующих пакет из одного или нескольких объектов внутри тела одного сообщения. Все типы **mulptipart** используют общий синтаксис, определенный в **MIME**, и должны содержать разделительный параметр частью значения медиа типа. Тело сообщения — самостоятельный элемент протокола и, следовательно, должно использовать только СRLF для представления концов строк между частями тела (body-parts). В отличие от **MIME**, окончание любого **multipart** сообщения должно быть пустым; **HTTP** приложения не должны передавать окончание (даже если первоначальный multipart содержит заключение).

***

## **Проверка подлинности доступа в HTTP**

Аутентификация в **HTTP** довольно простая: для проверки подлинности используются, запросы от клиента и ответы от сервера, но со специальными полями заголовка. Для проверки подлинности у сервера есть специальный механизм challenge-response. Сервер может применить этот механизм чтобы вызвать (получить) от клиента **HTTP** сообщение, в котором будут содержаться данные для аутентификации клиента. Это набор полей **HTTP** заголовка и, как и любое другое поле, поля установления подлинности в **HTTP** имеют атрибуты и значения, одно поле может иметь несколько значений, которые разделяются запятой и не чувствительны к регистру символов. Атрибут **realm** не чувствительный к регистру и необходим для установления подлинности в **HTTP** при всех вызовах. А вот значение данного атрибута к регистру чувствительно и вместе с **URL** сервера, на который был направлен запрос клиента, определяет область или пространство защиты. Таким образом сервер может создавать пространства защиты, к каждому из которых, могут быть применены различные способы установления подлинности клиента. Обычно для установления подлинности клиент использует поля заголовка **Authorization**, которое включает в запрос после того, как он получил код состояния 401. Значения поля **Authorization** состоят из так называемых рекомендаций (credentials), в этих самых рекомендациях содержится информация для аутентификации клиента. Домен, для которого применяются рекомендации для аутентификации со стороны клиента, определяется областью защиты, а если клиент подтвердил свою подлинность в предыдущем запросе, то рекомендации, которые он передал серверному приложению используются многократно в рамках домена. Если серверу «не понравятся» рекомендации клиента, то он возвращает код состояния 401. Однако стоит заметить, что стандарт **HTTP** никак не ограничивает **HTTP** приложения: то есть приложениям не обязательно для аутентификации использовать механизм запрос-ответ для подтверждения подлинности.

***

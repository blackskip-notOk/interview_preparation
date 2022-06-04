# **HTTP-куки**

## **Ссылки:**

* [Создание куки](#создание-куки)
* [Свойства HTTP Cookie](#свойства-http-cookie-куки)
* [Типы файлов cookie](#типы-файлов-cookie)
* [Способы предотвращения атак, использующих куки](#способы-предотвращения-атак-использующих-куки)

**HTTP cookie** (web cookie, куки браузера) - это небольшой фрагмент данных, который сервер отправляет браузеру пользователя. Браузер может сохранить этот фрагмент у себя и отправлять на сервер с каждым последующим запросом. Это, в частности, позволяет узнать, с одного ли браузера пришли несколько запросов (например, для аутентификации пользователя). С помощью кук можно сохранить любую информацию о состоянии, **HTTP** сам по себе этого делать не умеет.

Спецификации указывают минимальные объёмы, которые должны предоставляться браузерами для хранения cookie. Так, браузер должен хранить по меньшей мере 300 cookie по 4096 байт каждая, и по меньшей мере 20 cookie для одного сервера или домена.

Куки часто ипользуются для:

* Управления сеансом (логины, корзины для виртуальных покупок). Управление сеансом облегчает безопасное взаимодействие между пользователем и некоторой службой или приложением. По мере того как пользователь продолжает взаимодействовать с веб-приложением, он отправляет запросы, которые помогают отслеживать статус пользователя во время сеанса.

* Персонализации (пользовательские предпочтения). Персонализация пользователя сохраняет пользовательские предпочтения и настройки для повторного применения при входе пользователя в систему или запуске приложения. Настройки сохраняются и синхронизируются с центральной базой данных, чтобы помочь пользователям вернуться к предпочтительным настройкам, используемым во время их первого взаимодействия с приложением.

* Трекинга (отслеживания поведения пользователей). Отслеживание записывает и анализирует привычки пользователей к просмотру веб-страниц и находит количество и типы страниц, которые он посещает. Подробности включают время, потраченное на страницу, и последовательность страниц в сеансах пользователя. Из-за конфиденциальной информации, стоящей за отслеживанием, пользователи должны знать об уязвимостях при посещении небезопасных веб-страниц.

* До недавнего времени куки использовались в качестве хранилища информации на стороне пользователя. Это могло иметь смысл в отсутствии вариантов, но теперь, когда в распоряжении браузеров появились различные API для хранения данных, это уже не так. Из-за того что куки пересылаются с каждым запросом, они могут ухудшать производительность (особенно при использовании мобильных сетей). В качестве хранилищ данных на стороне пользователя вместо них можно использовать Web storage API (localStorage и sessionStorage) и IndexedDB.

Чтобы посмотреть сохранённые куки и другие хранилища данных, которые использует веб-страница, можно использовать Storage Inspector (Инспектор хранилища) в инструментах разработчика.

## **Создание куки**

Получив **HTTP** запрос, вместе с ответом сервер может отправить заголовок **Set-Cookie**. Куки обычно запоминаются браузером и посылаются в **HTTP** заголовке **Cookie** с каждым новым запросом к одному и тому же серверу. Можно задать срок действия кук, а также срок их жизни, после которого куки не будут отправляться. Также можно указать ограничения на путь и домен, то есть указать, в течении какого времени и к какому сайту они будут отсылаться.

* Постоянные cookie ( permanent cookies) удаляются не с закрытием клиента, а при наступлении определённой даты (атрибут Expires) или после определённого интервала времени (атрибут Max-Age).

* "Безопасные" (secure) куки отсылаются на сервер только тогда, когда запрос отправляется по протоколу **SSL** и **HTTPS**. Однако важные данные никогда не следует передавать или хранить в куках, поскольку сам их механизм весьма уязвим в отношении безопасности, а флаг secure никакого дополнительного шифрования или средств защиты не обеспечивает. Начиная с Chrome 52 и Firefox 52, незащищённые сайты (http:) не могут создавать куки с флагом Secure.

* Куки **HTTPonly** не доступны из **JavaScript** через свойства **Document.cookie** API, что помогает избежать межсайтового скриптинга. Устанавливайте этот флаг для тех кук, к которым не требуется обращаться через **JavaScript**. В частности, если куки используются только для поддержки сеанса, то в **JavaScript** они не нужны, так что в этом случае следует устанавливать флаг **HttpOnly**.

* Директивы **Domain** и **Path** определяют область видимости куки, то есть те URL-адреса, к которым куки будут отсылаться. Атрибут **Domain** указывает хосты, на которые отсылаются куки. Если он не задан, то по умолчанию берётся доменная часть адреса документа (но без поддоменов). Если домен указан явно, то поддомены всегда включены. Атрибут **Path** указывает **URL**, который должен быть в запрашиваемом ресурсе на момент отправки заголовка **Cookie**. Символ %x2F ("/") интерпретируется как разделитель в URL-пути, подпути также будут учитываться.

* Куки **SameSite**. Куки отправляются на сервер при любых запросах, даже если запрашивается статический ресурс с чужого сервера, то есть если происходит межсайтовый запрос. C помощью атрибута **SameSite** можно указать, когда и как отправлять куки с межсайтовыми запросами. В некоторой степени этот атрибут защищает от межсайтовой подделки запроса (CSRF). **SameSite** может принимать три возможных значения: **Strict**, **Lax** и **None**. С атрибутом **Strict** куки будут отправляться только тому сайту, которому эти куки принадлежат. Атрибут **Lax** работает похоже, но куки будут отправляться также при навигации на тот сайт, которому принадлежат куки. Например, при переходе по ссылке с внешнего сайта. Атрибут **None** отключает ограничение на отправку кук для межсайтовых запросов, но только в безопасном контексте. Если атрибут **SameSite** не установлен, куки будут восприниматься как **Lax**.

* Куки с префиксами. Из-за дизайна механизма кук сервер не может подтвердить, что куки были отправлены с защищённого источника (secure origin), или быть уверенным в том, где именно они были установлены. Уязвимое приложение поддомена может установить куку с атрибутом **Domain**, тем самым открывая к ней доступ на всех других поддоменнах. Этот механизм может быть проэксплуатирован с атакой фиксация сессии. Тем не менее в соответствии с принципом защита в глубину вы можете использовать куки с префиксами, чтобы гарантировать специфические факты о куках. Доступны два префикса:

* __Host- Если в куке содержится этот префикс, она будет установлена заголовком **Set-Cookie** только в том случае, если кука будет содержать атрибут **Secure** и если запрос будет отправляться из защищённого источника. Также кука не должна включать атрибут **Domain** и должна содержать атрибут **Path** со значением **/**.

* __Host- Если в куке содержится этот префикс, она будет установлена заголовком **Set-Cookie** только в том случае, если кука будет содержать атрибут **Secure** и если запрос будет отправляться из защищённого источника. Защита с помощью этого префикса слабее по сравнению с префиксом__Host-.
Браузеры будут откланять установку этих кук, если они не будут удовлетворять всем ограничениям. Заметьте, что куки с префиксами, созданные в рамках поддомена, будут ограничиваться только им или будут полностью игнорироваться. Так как бэкенд проверяет только куки с заранее известными именами при авторизации пользователя или валидации CSRF-токена, куки с префиксами фактически работают как защитный механизм от фиксации сессии.

* Куки можно создавать с помощью **JavaScript**, используя DOM-свойство **Document.cookie**. Также можно читать куки из **JavaScript**, если не был установлен атрибут **HttpOnly**.

```` js
document.cookie = "yummy_cookie=choco";
document.cookie = "tasty_cookie=strawberry";
console.log(document.cookie);
// выведет "yummy_cookie=choco; tasty_cookie=strawberry"
````

Куки, созданные с помощью **JavaScript**, не могут содержать атрибут **HttpOnly**.

* При сохранении информации в куках у всех пользователей есть возможность просматривать и изменять их значения. В зависимости от типа приложения вы можете использовать ни о чём не говорящее имя для идентификатора кук, смысл которого будет понятен только бэкенду. Также вы можете рассмотреть возможность использования альтернативных механизмов аутентификации и конфиденциальности, например, **JSON Web Tokens**

На стороне веб-сервера. В случае, если вы хотите создать свой собственный веб-сайт, вы можете создать сценарий **HTML**, в котором кнопка создает файл **cookie**.

```` html
<<!DOCTYPE html>
<html lang=»en»>
<head>
    <meta charset=»UTF-8″>
    <meta name=»viewport» content=»width=device-width, initial-scale=1.0″>
    <meta http-equiv=»X-UA-compatible» content =»ie=edge»>
    <title>Document</title>
</head>
<body>
    <button id = ‘btnCreateCookie’>Create Cookie </button>
    <script>
      const btnCreateCookie = document.getElementbyID(«btnCreateCookie»)
      btnCreateCookie.addEventLister(«click», e=> document.cookie = «example-3»)
    </script>
</body>
</html>
````

Когда у вас будет готов HTML-файл, вы можете создать приложение **index.js**, которое будет возвращать HTML-файл с помощью приложения **Express** для **Node.js**.

````js
const app = require(«express»)()
app.get(«/», (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})
app.listen(8080, ()=>console.log(«listening on port8080»))
````

В случае, если вы хотите, чтобы ваш сервер устанавливал куки без ручного написания **JavaScript**, вы можете передать массив куки.

````js
const app = require(«express»)()
app.get(«/», (req, res) => {
    res.setHeader(«set-cookie», [«setfromserver=1»])
    res.sendFile(`${__dirname}/index.html`)
})
app.listen(8080, ()=>console.log(«listening on port8080»))
````

Если браузер установил **cookie**, вам не придется вручную вводить **JavaScript**, чтобы создать **cookie** для каждого посетителя.
***

## **Свойства HTTP Cookie**

Независимо от типа файла **cookie**, свойства остаются неизменными для всех типов файлов:

1. Объем файлов **cookie** - определяет, на какие URL-адреса следует отправлять файлы **cookie**. Объем файла **cookie** делится на два разных атрибута:

1.1 Домен - Проще говоря, атрибуты доменов — это «корзины», в которые помещаются файлы **cookie**. Каждый файл **cookie** присваивается уникальному доменному имени, что помогает сохранять файлы **cookie** организованными и специфичными для страниц, на которые пользователи заходят.

1.2 Path - указывает конкретный URL-путь для отправки заголовка **cookie**.

2. Expires and Max-age​. Еще одно свойство, которое следует учитывать, — это время жизни файла **cookie** или, проще говоря, срок его действия. Несмотря на название «постоянный файл cookie», Expires атрибут удалит файл **cookie** в указанную дату. Напротив, Max-Ageатрибут удалит **cookie** через определенный период времени. С другой стороны, файлы **cookie** сеанса удаляются по окончании текущего сеанса. Имейте в виду, что некоторые браузеры определяют, когда этот текущий сеанс заканчивается, что может длиться неопределенное время.

3. SameSite. Ранее мы рассмотрели, как файлы **cookie HTTP** устанавливаются для прямых URL-адресов, но как насчет того, чтобы щелкнуть ссылку в этом прямом URL-адресе? При нажатии на ссылку на странице ваши файлы **cookie** могут быть отправлены с новой страницы, на которую вы перенаправлены. Проще говоря, Samesite указывает, отправляются ли файлы **cookie** с межсайтовыми запросами или всякий раз, когда вы нажимаете ссылку на любой заданной странице. SameSite атрибут посылается с тремя значениями:

3.1 Strict - файлы **cookie** будут отправляться только через контекст основных файлов **cookie**, а не через сторонние файлы **cookie**.

3.2 Lax - файлы **cookie** будут отправляться только в том случае, если пользователи активно переходят по ссылке на сторонний веб-сайт. Если SameSite атрибут не установлен напрямую, lax становится значением по умолчанию.

3.3 None - **cookie** будут отправляться во всех контекстах.

***

## **Типы файлов cookie**

* Session cookies - Также известные как временные файлы cookie, сеансовые файлы cookie истекают после закрытия или выхода из браузера. Вы заметите, что веб-сайт использует файлы cookie сеанса, когда вам нужно вводить учетные данные для входа каждый раз, когда вы открываете страницу.

* First-Party cookies - Основные файлы cookie хранятся непосредственно на вашем компьютере посещаемым вами веб-сайтом. Веб-сайт собирает аналитические данные и полезную информацию для улучшения вашего пользовательского опыта.

* Third-Party cookies - Сторонние файлы cookie создаются доменами, отличными от того, к которому вы напрямую обращаетесь. Сторонние файлы cookie, обычно используемые для отслеживания, сохраняются даже после закрытия браузера.

* Secure cookies - Безопасные файлы cookie не позволяют неавторизованным сторонам наблюдать файлы cookie, отправленные новому пользователю в ответе HTTP. С атрибутом Secure HTTP-запросы будут включать cookie только в том случае, если они передаются по безопасному каналу.

* Zombie cookies - файлы cookie, которые оживают даже при удалении или закрытии браузера. Файлы cookie зомби хранятся в местах за пределами специального хранилища файлов cookie веб-браузера. Когда пользователь уничтожает куки-файл, зомби-куки может взять реплику, хранящуюся в другом месте, и снова прикрепить ее к хранилищу куки-файлов пользователя.

***

## **Способы предотвращения атак, использующих куки:**

* Используйте атрибут **HttpOnly** для предотвращения доступа к кукам из **JavaScript**. Куки, которые используются для хранения чувствительной информации, такой как аутентификационный токен, должны иметь короткое время жизни и атрибут **SameSite**, установленный в **Strict** или **Lax**.

* Захват сессии (session hijacking) и XSS. Куки часто используются в веб-приложениях для идентификации аутентифицированного пользователя и сеанса работы. Соответственно, похищение кук из приложения может привести к захвату авторизованного сеанса пользователя. Кража кук часто осуществляется посредством социальной инженерии (Social Engineering) и использования уязвимости XSS.

* Межсайтовая подделка запроса (CSRF - Cross-site request forgery). Если вы аутентифицированны в своём банковском аккаунте, а куки по-прежнему действительны (и никакой дополнительной проверки не требуется), то при загрузке HTML-документа форума или чата с этим изображением деньги будут переведены с вашего счета. Для защиты от этого используется ряд методов:

Как и при XSS, важна фильтрация входящей информации. Для любой чувствительной операции должно запрашиваться подтверждение. Куки, используемые для чувствительных операций, должны иметь короткий срок действия.

* Сторонние (Third-party) куки. Куки ассоциируются с определённым доменом и схемой (такой как http: или https:). Также они могут быть ассоциированы с поддоменом с помощью атрибута Domain. Если домен и схема кук совпадает с доменом и схемой текущей страницы, на которой вы находитесь, то их называют собственными куками (first-party cookies). Если домен и схема кук отличается от домена и схемы текущей стрницы, то такие куки называют сторонними куками (third-party cookies). Сервер, хосятщий страницу, устанавливает собственные куки, но на странице могут находиться изображения и другие компоненты с других доменов (например, баннерная реклама), они в свою очередь могут устанавливать сторонние куки. Сторонние куки часто используются для рекламы и трекинга пользователей в сети. Как пример, можете посмотреть куки, которые устанавливает Google. Третья сторона, контролирующая внедрение сторонних кук, может создать профиль пользователя на основе истории его посещений разных сайтов с помощью кук, отправляемых одним и тем же браузером с разных сайтов. Firefox по умолчанию блокирует сторонние куки, про которые известно, что они используются для трекинга пользователей. Сторонние куки (или просто куки для трекинга) могут также быть заблокированы другими настройками браузера или расширениями. Блокировка кук в некоторых ситуациях может стать причиной некорректного поведения сторонних компонентов, например, виджетов социальных сетей.
# **Увеличение скорости загрузки страницы**

## **Как агружаются сайты**

В [**материале**](https://github.com/alex/what-happens-when) описаны все процессы, связанные с посещением сайта. Если говорить кратко, то между тем, как посетитель сайта вобьет в адресную строку его **URL** и получит ответ, в общем виде проходит несколько этапов:

* Браузер осуществляет DNS-запрос по имени сайта.
* Инициируется TCP-подключение к серверу, на котором этот сайт расположен.
* Устанавливается соединения **http** или **https**.
Потом запрашивается нужная страницы и загружается ее HTML-код.
* Стартует парсинг **HTML**.
* После этого браузер начинает подгружать внешние ресурсы, связанные со страницей (стили, изображения, скрипты и так далее). В итоге рендерится финальная версия страницы со всем контентом.
* Затем исполняется **JS**-код — скрипты могут потребовать обработки дополнительных сетевых запросов, изменять страницу или её шаблон, так что возможен и новый круг рендеринга.

Часть из этих шагов можно оптимизировать на стороне клиента, другую часть — на стороне сервера.
***

## **Выявление проблемы со скоростью на сайте**

Существует несколько важных метрик быстродействия сайта. Одна из них — это время до первого байта (TTFB — time to first byte), которая показывает, как быстро браузер начинает получать данные от сервера после отправки запроса. Также важно замерять начало рендеринга страницы и время загрузки (load time). По показателям **LCP** (Largest Contentful Paint) и **FID** (First Input Delay) поисковик оценивает эффективность сайта. **LCP** говорит о времени отрисовки страницы на экране, а **FID** — насколько быстро браузер реагирует на взаимодействие посетителя с элементами интерфейса. Один из способов узнать **Core Web Vitals** страниц — сервис [**Google Search Console**](https://search.google.com/search-console/about). Статистика находится в разделе «Основные интернет-показатели» и доступна после подтверждения прав на сайт. Используя онлайн-инструмент [**PageSpeed Insights**](https://search.google.com/search-console/about), можно проверить скорость определенной страницы, узнать, какие факторы негативно влияют на ее производительность, а также получить рекомендации относительно оптимизации загрузки сайта. Еще один вариант, подходящий для комплексного анализа скорости страниц, — аудит сайта с помощью платформы. Например, в отчете сервиса [**SE Ranking**](https://seranking.com/ru/analiz-sajta.html) можно увидеть **Core Web Vitals** любого ресурса, данные по объему **HTML**-кода, размерам изображений, файлам **CSS** и **JS** и другие показатели, влияющие на время отображения контента.
***

## **Расширение ресурсов сервера**

Если медленно работает сам сервер, то нет никакого смысла тратить время и силы на клиентскую оптимизацию. В случае небольших проектов при росте нагрузки сайт часто начинает тормозить именно из-за того, что ему перестает хватать ресурсов хостинга — например, CPU и дисков.

В качестве первого шага логично рассмотреть покупку дополнительных ресурсов. Однако этот метод работает до определенного момента, а затем затраты на оплату услуг хостинга могут вырасти так сильно, что проще и выгоднее будет использовать другие способы оптимизации загрузки.

## **Уменьшение количество HTTP-запросов**

### **Использование CSS-спрайтов**

CSS-спрайт — это комбинированное изображение, которое содержит в себе несколько маленьких изображений, которые в нужный момент для нужного элемента страницы вырезаются используя свойства: `background-image` и `background-position`.

### **Использование Inline-картинок**

Inline-картинки используют **URL-схему data**: для встраивания картинки в саму страницу. Это, однако, увеличит размер HTML-документа. Встраивая inline-картинки в ваши таблицы стилей вы добьетесь уменьшения запросов к серверу, а размер **HTML** останется прежним.

### **Объединение нескольких файлов в один**

Если на странице подключается больше одного css- или js-файла, то можно объединить их в один. Это очень простой, но действенный способ уменьшения количества http-запросов на сервер.
***

## **Поместить CSS файлы в начале страницы**

Помещая подключение к **CSS** файлам в хедере страницы мы получаем постепенный рендеринг страницы, т.е. страница будет загружаться постепенно — сначала заголовок, потом лого наверху, навигация и т.д. — а это в свою очередь служит отличным индикатором загрузки страницы для пользователя и улучшает общее впечатление от сайта.

Если размещать **CSS** файлы внизу страницы, то это не позволяет многим браузерам рендерить страницу постепенно. Это объясняется тем, что браузер «не хочет» перерисовывать элементы, у которых после загрузки страницы может измениться стиль. Так что все свои **CSS** файлы всегда подключайте в верхней части страницы в секции **HEAD**.
***

## **Поместить javascript в конец страницы**

Помещая javascript-файлы вниз страницы мы позволяем браузеру загрузить страницу с контентом в первую очередь, а уже потом начать загрузку javascript-файлов. Кроме того, внешние js-файлы блокируют параллельную загрузку. Спецификация **HTTP/1.1** советует, чтобы браузеры параллельно загружали не более 2-х компонентов веб-страницы с одного хоста. Таким образом, если картинки для вашего сайта располагаются на разных хостах, вы получите более 2-х параллельных загрузок. А когда загружается скрипт, браузер не будет начинать никаких других загрузок, даже с других хостов.
***

## **Использовать асинхронную загрузку для файлов CSS и JavaScript**

Скрипты, такие как **CSS** и **JavaScript** можно загружать двумя способами: синхронно или асинхронно. Если скрипты загружаются синхронно, они загружаются по одному в том порядке, в котором они отображаются на странице. С другой стороны, если скрипты загружаются асинхронно, некоторые из них будут загружаться одновременно. Асинхронная загрузка файлов поможет решить вопрос, как ускорить работу сайта, так как при загрузке страницы робот браузера двигается сверху вниз.

## **Минимизировать css и javascript**

Минимизация файла — это удаление из кода всех несущественных символов с целью уменьшения объема файла и ускорения его загрузки. В минимизированном файле удаляются все комментарии и незначащие пробелы, переносы строк, символы табуляции. Чем меньше объем файла, тем меньше времени понадобится браузеру на его загрузку.
***

## **Использовать поддомены для параллельного скачивания**

Если на сайте много графики, то ее лучше вынести на отдельный поддомен или поддомены. Для нас это будет один и тот же сервер, а для браузера — разные. Чем больше поддоменов создадим, тем больше файлов браузер сможет одновременно загрузить и тем быстрее загрузится вся страница сайта.
***

## **Минимизировать время до первого байта**

В дополнение к количеству времени, которое требуется для полной загрузки страницы, также нужно взглянуть на количество времени, необходимое для начала загрузки. Время до первого байта или **TTFB** — то время, которое браузер тратит, прежде чем получить свой первый байт данных с сервера. Google рекомендует **TTFB** менее 200 мс. В отличие от многих интерфейсных факторов производительности, это проблема стоит на стороне сервера. Как правило, большинство из проблем производительности вызваны сетевыми проблемами, динамическим созданием контента, конфигурацией веб-сервера и трафиком. Из этих четырех факторов вы можете управлять двумя: динамическим созданием контента и конфигурацией сервера.
***

## **Использовать кэш браузера**

Кеширование становится крайне важным для современных веб-сайтов, которые используют обширное подключение **JavaScript** и **CSS**. Когда посетитель зашел на сайт в первый раз, то браузер выполнит загрузку всех **javascript** и **css**-файлов, также загрузит всю графику и флэш, однако правильно выставив **HTTP**-заголовок **Expires**, можно сделать компоненты страницы кешируемыми. Таким образом, когда посетитель зайдет на сайт снова или перейдет на следующую страницу сайта, в кэше его браузера уже будут находится некоторые нужные файлы и браузеру не потребуется загружать их снова. Отсюда и выигрыш в скорости загрузки сайта. При всех плюсах — это не единственный стоящий метод оптимизации. Во-первых, закешировать можно не все, во-вторых, думать нужно и том, как в будущем сбрасывать кэш, в третьих, этот метод помогает ускорить сайт для тех пользователей, которые на нем уже были, и ничем не помогает новым посетителям.
***

## **Использовать CDN для загрузки популярных JavaScript библиотек**

Если на сайте используется популярный **javascript** фреймворк, например **jQuery**, то для его подключения лучше использовать **CDN** (Content Delivery Network) — это множество веб-серверов, разнесенных географически для достижения максимальной скорости отдачи контента клиенту. Сервер, который непосредственно будет отдавать контент пользователю, выбирается на основании некоторых показателей. Например, выбирается сервер с наименьшим числом промежуточных хопов до него либо с наименьшим временем отклика.
***

## **Оптимизировать изображения**

Необходимо определять подходящий формат для изображений. Выбор неверного формата изображения, может существенно увеличить размер файла.

* **GIF** — идеально подходят для изображений с несколькими цветами, например логотип.
* **JPEG** — отлично подходят для детализированых изображений с большим количеством цветов, такие как фотографии.
* **PNG** — ваш выбор, когда вам нужно высококачественное изображение с прозрачностью.

Оптимизировать изображение можно двумя способами: используя программы или онлайн сервисы в Интеренете для сжатия изображений. Кроме того, имеет смысл попробовать включить конвертацию изображений в формат **WebP**. Он был разработан Google, и по данным компании такие изображения на 26% легче **PNG**-файлов и на 25-34% меньше **JPEG**-картинок. К сожалению, на данный момент (январь 2018) формат **WebP** поддерживается далеко не всеми браузерами — пока среди них только Chrome и Opera.
***

## **Не масштабировать изображения**

Не изменяйте размер изображения при помощи `width` и `height`. Это негативно влияет на скорость загрузки страницы. Если изображение размером **500x500px**, а вставить на сайт нужно изображение с размером **100x100px**, то лучше изменить размер оригинальной картинки при помощи графического редактора. Чем меньший вес картинки, тем меньше времени потребуется для её загрузки.
***

## **Использовать Gzip- сжатие**

**Gzip** — простой метод компрессии файлов сайта для экономии ресурсов канала и ускорения загрузки. С помощью **Gzip** файлы сжимаются в архив, который браузер может загрузить быстрее, а уже затем распаковать и отобразить контент. **Gzip**-сжатие текстового файла «на лету» в 95–98% случаев позволяет сократить время на передачу файла браузеру. Если хранить архивированные копии файлов на сервере (в памяти proxy-сервера или просто на диске), то соединение в общем случае удается освободить в 3–4 раза быстрее. Начиная с версии протокола **HTTP/1.1**, веб-клиенты указывают, какие типы сжатия они поддерживают, устанавливая заголовок ёAccept-Encodingё в HTTP-запросе. (ёAccept-Encoding: gzip, deflate). При выдаче ответа посредством заголовка `Content-Encoding` сервер уведомляет клиента о том, каким методом сжимался ответ. `Content-Encoding: gzip`. Переданные таким образом данные меньше первоначальных примерно в 5 раз, и это существенно ускоряет их доставку. Однако здесь есть один недостаток: увеличивается нагрузка на веб-сервер.
***

## **Использование связки Nginx+Apache**

Для увеличения скорости загрузки страниц можно использовать связку **Apache** и **Nginx**. Это два самых распространённых веб-сервера в мире, популярность объясняется мощью **Apache** и скоростью **Nginx**. Помимо плюсов, у каждого инструмента есть и свои недостатки: например, в **Apache** есть ограничения памяти сервера, в то время как **Nginx**, эффективный для статических файлов, нуждается в помощи **php-fhm** или аналогичных модулей для загрузки динамического контента. Тем не менее можно и даже нужно объединить два веб-сервера для большей эффективности, используя **Nginx**, как статический фронтенд и **Apache** — как бэкенд.
***

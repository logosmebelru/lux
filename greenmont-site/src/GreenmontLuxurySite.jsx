import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  APARTMENT_ASSETS as APARTMENT_MEDIA,
  GALLERY_ASSETS,
  HERO_ASSETS as HERO_MEDIA,
  HERO_FEATURE_ASSETS,
  STORY_ASSETS as STORY_MEDIA,
  VIDEO_ASSETS
} from "./data/assets";
import { buildAssetCandidateChain } from "./utils/mediaFallbacks";

const makeSection = (id, kind, label, eyebrow, title, text, accent, mediaTitle, gradient) => ({
  id,
  kind,
  label,
  eyebrow,
  title,
  text,
  accent,
  mediaTitle,
  gradient
});

const makeApartment = (
  id,
  number,
  title,
  area,
  floor,
  view,
  terrace,
  format,
  text,
  accent,
  gradient
) => ({
  id,
  number,
  title,
  area,
  floor,
  view,
  terrace,
  status: "в продаже",
  format,
  text,
  accent,
  gradient
});

const STORY_SECTIONS = [
  makeSection("hero", "hero", "01", "Резиденции премиум-класса у моря", "Премиальные аппартаменты у моря в Сочи", "Пространство для жизни, инвестиций и отдыха у побережья, собранное как единая luxury-история через фотографии, видео, архитектуру и ощущение private resort.", "Единая история проекта", "Фасад, море, вечерний свет и ощущение частной курортной резиденции", "linear-gradient(135deg, #4d6671 0%, #b89b6b 48%, #141516 100%)"),
  makeSection("metrics", "stats", "02", "Ключевые масштабы проекта", "Всё главное о проекте — в цифрах", "В основе истории — масштаб: 26 000 м² благоустройства, 1,3 га парящих променадов, 4,5 га закрытой территории, 2 175 м² собственного пляжа и высокий процент видовых резиденций.", "26 000 м² благоустройства", "Масштаб проекта раскрывается через ландшафт, воздух и протяженные маршруты к морю", "linear-gradient(135deg, #536975 0%, #c0a16e 52%, #151617 100%)"),
  makeSection("concept", "story", "03", "О проекте", "Флагманский курортный продукт с акцентом на приватность премиум-класса", "GREENMONT объединяет частные резиденции и гостиничный формат в одном проекте — для отдыха, жизни и инвестиций. Первая очередь «Горы» включает 8 секций и 1 209 номеров, вторая — «Море» — 4 секции и 564 номера под управлением профессионального оператора. Такой формат обеспечивает высокий спрос, стабильный арендный доход и потенциал роста стоимости.", "private resort с гостиничным управлением", "Архитектурный код, приватность и курортная часть Сочи", "linear-gradient(135deg, #556a75 0%, #b79765 52%, #161718 100%)"),
  makeSection("private-resort", "story", "04", "Формат проекта", "Курортный формат с сервисом и профессиональным управлением", "GREENMONT — это не просто апартаменты, а современный курортный комплекс с профессиональным управлением, высоким уровнем сервиса и инфраструктурой, соответствующей стандартам ведущих мировых курортов.", "5* гостиничный комплекс с резиденциями", "Жизнь у моря как сервисный и архитектурный сценарий", "linear-gradient(135deg, #425964 0%, #b89663 54%, #161718 100%)"),
  makeSection("promenade", "feature", "05", "Панорамные маршруты", "Панорамный маршрут к морю", "Комплекс находится в спокойной курортной части Сочи, на улице Ленина, всего в 450 метрах от Черного моря. Аллеи и панорамные мосты формируют живописный маршрут, гармонично встроенный в природный ландшафт и удобный для прогулок резидентов.", "1,3 га парящих променадов", "Путь к воде как эмоциональная ось всей истории", "linear-gradient(135deg, #45606b 0%, #c0a57b 52%, #151617 100%)"),
  makeSection("beach", "feature", "06", "Собственный пляж", "Приватный пляж для резидентов", "У комплекса — собственный благоустроенный пляж, предназначенный исключительно для резидентов. Здесь всё продумано для комфортного отдыха у моря: камерная атмосфера, приватность и ощущение закрытого курорта.", "2 175 м² собственного пляжа", "Пляж не как функция, а как личный морской сценарий", "linear-gradient(135deg, #476574 0%, #c5ab83 52%, #121314 100%)"),
  makeSection("bridges", "feature", "07", "Связанные маршруты", "Парящий променад и прогулочные маршруты", "Панорамные аллеи и мосты создают цельную систему передвижения по территории комплекса. Пространство раскрывается через комфортные маршруты, органично интегрированные в природный рельеф и живописное окружение.", "Единая прогулочная система", "Маршруты, которые делают ландшафт частью архитектуры", "linear-gradient(135deg, #4b6771 0%, #b99a6b 50%, #171819 100%)"),
  makeSection("five-senses", "feature", "08", "Сады пяти чувств", "Пространство, где природа раскрывается через все пять чувств", "Это пространство, где зрение наполняют яркие природные оттенки, слух — тишина и мягкие звуки сада, обоняние — цветочные ароматы, осязание — разнообразие природных фактур, а вкус — свежесть морского воздуха. Такое ландшафтное решение создает ощущение близости к первозданной природе и настраивает на отдых, созерцание и восстановление.", "Сад как experience", "Ландшафт, который воспринимается телом и памятью", "linear-gradient(135deg, #50666f 0%, #bca174 50%, #18191a 100%)"),
  makeSection("art-park", "feature", "09", "Авторский парк", "Авторский парк с бионическими арт-объектами", "Центральным элементом благоустройства становится авторский парк с 99 бионическими арт-объектами, интегрированными в природный ландшафт. Сочетание искусства, оригинальных ландшафтных решений и комфортной инфраструктуры формирует особую атмосферу для отдыха, прогулок и единения с природой.", "Ландшафт и искусство", "Среда, где парк становится продолжением архитектуры", "linear-gradient(135deg, #546972 0%, #b69364 48%, #171819 100%)"),
  makeSection("evening-light", "feature", "10", "Вечерний сценарий", "Продуманное освещение как часть атмосферы", "Световые решения подчеркивают архитектурный характер проекта, создают спокойную вечернюю атмосферу и обеспечивают комфортное передвижение по территории. Подсветка фасадов, теплый свет в лобби и освещенные пешеходные маршруты формируют цельное и эстетичное пространство.", "Вечер как отдельный режим проекта", "Свет, который делает пространство дороже и спокойнее", "linear-gradient(135deg, #3e5360 0%, #b2875a 54%, #131415 100%)"),
  makeSection("gazebos", "feature", "11", "Атмосферные пространства", "Беседки с адиабатическим охлаждением и комфортом в течение всего дня", "Это пространство для спокойного отдыха на открытом воздухе, где тень, приватная атмосфера и естественная прохлада создают особое ощущение курортного комфорта. Система туманообразования помогает поддерживать приятный микроклимат в течение дня.", "Outdoor comfort", "Пространства, где хочется задерживаться, а не проходить мимо", "linear-gradient(135deg, #4a5f68 0%, #b89368 52%, #141516 100%)"),
  makeSection("amphitheater", "feature", "12", "События под открытым небом", "Амфитеатр и кинотеатр под открытым небом", "На территории предусмотрены амфитеатр и open-air кинотеатр — пространства для событий, вечернего отдыха и атмосферных встреч. Они дополняют курортную среду, создавая особый сценарий жизни на открытом воздухе.", "Open-air culture", "Курортная среда, в которой досуг становится частью архитектуры", "linear-gradient(135deg, #445660 0%, #bd9969 50%, #18191a 100%)"),
  makeSection("kids-concept", "story", "13", "Детство нового уровня", "Семейный отдых, продуманный до деталей", "Инфраструктура для детей становится естественной частью общего курортного сценария: игровые пространства, природный плей-хаб, кинозал, мастер-классы, студия звукозаписи и зоны активностей создают насыщенную и комфортную среду для отдыха, творчества и новых открытий. Дополняет семейный формат отдельный детский бассейн.", "Семейный сценарий без компромиссов", "Среда, где дети получают не только развлечения, но и собственный опыт проекта", "linear-gradient(135deg, #5c6d73 0%, #c3a579 50%, #171819 100%)"),
  makeSection("play-hub", "feature", "14", "Природный play-hub", "Игровое пространство, встроенное в природный ландшафт", "Детская зона на свежем воздухе органично вписана в зеленое пространство комплекса. Безопасные игровые элементы, натуральные материалы и спокойная природная палитра создают комфортную среду для активных игр, движения и новых впечатлений.", "Игра как часть ландшафта", "Природа и детская активность объединены в одну эмоциональную сцену", "linear-gradient(135deg, #63716f 0%, #c4a26e 52%, #161718 100%)"),
  makeSection("service", "story", "15", "Сервис", "Курортный сервис с профессиональным управлением", "Продуманная инфраструктура, пятизвездочный сервис и управление профессионального оператора формируют здесь формат частного курорта. Консьерж 24/7, обслуживание резиденций, клининг, удобное передвижение по территории и доступ ко всей инфраструктуре позволяют наслаждаться отдыхом, жизнью и владением без лишних забот.", "Персональный lifestyle", "Сервис, который освобождает время владельца и усиливает качество жизни", "linear-gradient(135deg, #4d6270 0%, #c2a273 48%, #151617 100%)"),
  makeSection("transport", "feature", "16", "Транспорт и передвижение", "Передвижение и сервис, продуманные до деталей", "Высокий уровень комфорта здесь ощущается во всем: от консьерж-сервиса 24/7 и организации досуга до аренды яхты, поездок по территории на электрокарах и valet parking. Всё устроено так, чтобы отдых и повседневная жизнь проходили легко, спокойно и без лишних забот.", "Mobility as luxury service", "Передвижение без трения, ожиданий и бытового шума", "linear-gradient(135deg, #4a5d68 0%, #ba905c 50%, #151617 100%)"),
  makeSection("wellness", "story", "17", "SPA мирового уровня", "Восстановление как часть образа жизни", "Здесь wellness-пространство создано для того, чтобы отдых приносил не только удовольствие, но и ощущение глубокой перезагрузки. Термальная зона, сауна, хаммам, массаж, диагностика и оздоровительные программы помогают восстановить силы, замедлиться и вернуть внутренний баланс.", "Wellness каждый день", "SPA не как услуга, а как регулярный ритм жизни в проекте", "linear-gradient(135deg, #3d5762 0%, #b58d61 52%, #151617 100%)"),
  makeSection("body-mind", "feature", "18", "Body & Mind", "Йога, пилатес и практики спокойного восстановления", "Здесь созданы условия для мягкой физической активности и бережной заботы о себе. Йога, пилатес, медитация и стретчинг помогают восстановить силы, сохранить внутренний баланс и поддерживать комфортный ритм жизни в окружении природы.", "Тихий баланс у моря", "Пространство для внутреннего ритма и восстановления", "linear-gradient(135deg, #55676d 0%, #c0a174 50%, #171819 100%)"),
  makeSection("sports", "feature", "19", "Sports & Wellness", "Фитнес и пространства для активного отдыха", "Для резидентов предусмотрены фитнес-центры и открытые спортивные площадки для тренировок и активного досуга. Work-out зона, площадки для стритбола, настольного тенниса и падл-тенниса делают движение естественной частью повседневной жизни и курортного отдыха.", "Активность как часть курортного ритма", "Энергия, движение и ежедневный уход за собой внутри одного маршрута", "linear-gradient(135deg, #415763 0%, #b98f60 52%, #151617 100%)"),
  makeSection("technology-intro", "story", "20", "Технологии", "Технологии комфорта и приватности", "Технологические решения здесь работают на главное — тишину, безопасность и ощущение личного пространства. Сейсмоустойчивость до 8 баллов, усиленная шумоизоляция, зеркальное тонирование панорамных окон, многоуровневая система доступа, круглосуточная охрана и видеонаблюдение формируют спокойную и защищенную среду для жизни. Дополняют этот сценарий просторный подземный паркинг, гостевая парковка и продуманное освещение в зонах движения.", "Технологии без демонстративности", "Функциональная основа luxury-продукта скрыта, но ощущается каждый день", "linear-gradient(135deg, #4a5f66 0%, #b38b5d 52%, #151617 100%)"),
  makeSection("parking", "feature", "21", "Паркинг", "Паркинг, продуманный для повседневного комфорта", "Подземный паркинг на 181 машино-место рассчитан на автомобили разных классов — от седанов до внедорожников. Дополняет его удобная гостевая парковка на 127 мест, а продуманное освещение в зонах движения поддерживает комфорт и безопасность каждый день.", "Просторный паркинг", "Автомобильный сценарий должен быть таким же комфортным, как и residential experience", "linear-gradient(135deg, #495d65 0%, #b88f63 52%, #151617 100%)"),
  makeSection("security", "feature", "22", "Система безопасности", "Безопасность и приватность как часть повседневного комфорта", "Закрытая территория, отдельные маршруты для резидентов и гостей, продуманная система доступа, охрана 24/7 и видеонаблюдение формируют спокойную и защищённую атмосферу. Высокий уровень шумоизоляции усиливает ощущение уединения и комфорта в каждой резиденции.", "Защищенность без стресса", "Тишина и приватность держатся не только на архитектуре, но и на инфраструктуре безопасности", "linear-gradient(135deg, #42525b 0%, #b88e60 54%, #151617 100%)"),
  makeSection("location", "story", "23", "Локация и окружение", "Престижный район с морем, воздухом и удобной доступностью", "Тихая курортная часть Сочи, близость к морю и живописное природное окружение делают эту локацию особенно привлекательной для жизни и отдыха. При этом рядом находятся главные транспортные узлы и ключевые точки города, что позволяет сохранять привычный ритм без компромиссов в комфорте.", "30 минут до центра Сочи", "Район, в котором море и город не спорят друг с другом", "linear-gradient(135deg, #4d6874 0%, #c4a87c 50%, #151617 100%)"),
  makeSection("team-interiors", "story", "24", "Команда проекта", "Авторская интерьерная концепция международного уровня", "Общественные пространства выполнены в выразительной авторской стилистике, где каждая деталь подчинена общей эстетике. Натуральные материалы, мягкий свет и выверенные акценты формируют атмосферу, сравнимую с проектами ведущих мировых дизайн-студий.", "Сильная интерьерная экспертиза", "Интерьер — это не декор, а часть инвестиционного и эмоционального восприятия проекта", "linear-gradient(135deg, #54646d 0%, #c09a6c 50%, #171819 100%)"),
  makeSection("team-landscape", "feature", "25", "Ландшафтная экспертиза", "Гармония архитектуры и ландшафта", "Территория выстроена как цельная природная среда, где рельеф, зелёные зоны и сохранённые реликтовые деревья подчеркивают спокойный характер пространства и создают ощущение уединения и комфорта.", "High-class landscape", "Ландшафт проектируется как равная часть архитектуры и сервиса", "linear-gradient(135deg, #5b6d70 0%, #c29f71 50%, #171819 100%)"),
  makeSection("team-architecture", "feature", "26", "Архитектура", "Архитектура, продуманная в масштабе места", "Архитектурная концепция строится на неоклассической эстетике, традиционном масштабе средиземноморской застройки и бережной интеграции в природный ландшафт. Малая этажность, натуральные материалы, панорамные виды и единый визуальный код формируют цельную, спокойную и выразительную среду.", "Архитектурная глубина проекта", "Форма и среда выглядят цельно, когда за ними стоит сильная проектная школа", "linear-gradient(135deg, #4a616e 0%, #be9b6f 50%, #151617 100%)"),
  makeSection("interiors-transition", "story", "27", "Переход к лотам", "Коллекция избранных апартаментов", "В следующем разделе представлены 8 апартаментов, доступных к покупке. Это лоты с лучшим расположением в проекте, выразительными видами, удачными этажами и продуманными планировками.", "8 апартаментов в продаже", "Финальная часть истории должна переводить эмоцию в выбор конкретного лота", "linear-gradient(135deg, #465f6b 0%, #c1a071 50%, #151617 100%)")
];

const APARTMENTS = [
  makeApartment("apartment-01", "Апартамент 01", "Панорамная студия с видом на горные вершины", "19,2 м²", "3 этаж", "горы и зеленый склон", "французский балкон", "студия", "Компактный входной лот для инвестиционного сценария или личного сезонного использования. Главный акцент — на ощущении воздуха, чистом визуальном образе и панорамном характере пространства.", "студия / панорамный вид", "linear-gradient(135deg, #5a7078 0%, #c2a77d 52%, #171819 100%)"),
  makeApartment("apartment-02", "Апартамент 02", "Светлая студия для отдыха и инвестиционного сценария", "24,8 м²", "4 этаж", "внутренний парк и променад", "открытый балкон", "студия", "Элегантная точка входа в продукт: аккуратная площадь, выразительный свет, удобный сценарий краткосрочного отдыха и высокая понятность для инвестиционного входа.", "вход в продукт", "linear-gradient(135deg, #546973 0%, #bc9e72 52%, #171819 100%)"),
  makeApartment("apartment-03", "Апартамент 03", "Семейная резиденция с мастер-спальней и несколькими террасами", "78,4 м²", "5 этаж", "море и курортная территория", "2 террасы", "2 спальни", "Семейный лот для более долгого проживания у моря. Здесь продается не только метраж, но и сценарий второй резиденции: приватные спальни, outdoor-пространства и полноценный ритм жизни внутри проекта.", "семейный ритм", "linear-gradient(135deg, #485f69 0%, #c09b6d 50%, #171819 100%)"),
  makeApartment("apartment-04", "Апартамент 04", "Просторный семейный апартамент для второго дома у моря", "86,9 м²", "6 этаж", "море и зеленые маршруты", "угловая терраса", "семейная резиденция", "Лот для владельца, который ищет не сезонную недвижимость, а полноценный второй дом у воды. Спокойная планировка и приватный outdoor-сценарий делают этот формат особенно сильным в долгом владении.", "второй дом у моря", "linear-gradient(135deg, #4f6671 0%, #c5a67b 50%, #171819 100%)"),
  makeApartment("apartment-05", "Апартамент 05", "Коллекционная резиденция с террасой увеличенного формата", "102,3 м²", "7 этаж", "открытая панорама моря", "31 м²", "коллекционная резиденция", "Редкий формат, где терраса становится полноценной outdoor-гостиной. Такой лот хорошо работает на высокий чек за счет масштаба, визуального эффекта и ощущения частной морской резиденции.", "коллекционный формат", "linear-gradient(135deg, #556870 0%, #c29e70 48%, #171819 100%)"),
  makeApartment("apartment-06", "Апартамент 06", "Коллекционная резиденция с расширенной outdoor-гостиной", "118,7 м²", "8 этаж", "море, закаты и линия побережья", "36 м²", "коллекционная резиденция", "Продолжение коллекционной линии: интерьер и ландшафт должны читаться как единое пространство, а открытая терраса — как центральная сцена ежедневного сценария проживания у моря.", "интерьер + ландшафт", "linear-gradient(135deg, #445c66 0%, #ba9465 50%, #171819 100%)"),
  makeApartment("apartment-07", "Апартамент 07", "Видовой пентхаус с террасой и высоким уровнем приватности", "146,5 м²", "9 этаж", "море и вечерний горизонт", "от 8 м²", "пентхаус", "Пентхаусный формат с сильным private mood: верхний уровень, тишина, открытая терраса и ощущение редкой курортной недвижимости для долгого владения или статусного сценария покупки.", "верхний уровень коллекции", "linear-gradient(135deg, #415763 0%, #b98f5f 52%, #171819 100%)"),
  makeApartment("apartment-08", "Апартамент 08", "Пентхаус с панорамной лаунж-террасой как финальная точка коллекции", "209,4 м²", "10 этаж", "панорама моря 180°", "private lounge terrace", "signature penthouse", "Финальный лот всей коллекции. Здесь продаются не только площадь и вид, а чувство завершенной luxury-истории: максимум приватности, панорамная терраса и формат редкого coastal asset высокого класса.", "финал коллекции", "linear-gradient(135deg, #49606d 0%, #c29a6a 50%, #171819 100%)")
];

const FINAL_SECTIONS = [
  makeSection("gallery", "story", "28", "Фото и видео", "Визуальная история проекта продолжается через галерею и branded reels", "Фотографии фасада, территории, интерьеров, спорта, SPA и воды должны работать как единая luxury-editorial серия. Видео дополняет ее движением, светом и атмосферой места.", "media-driven storytelling", "Hero-видео, drone shots и полноэкранные фотосерии", "linear-gradient(135deg, #4b616b 0%, #c2a87a 52%, #151617 100%)"),
  makeSection("pricing-cta", "feature", "29", "Запрос стоимости", "На каждом типе лота проект ведет к одному действию — узнать стоимость", "Логику мы сохраняем, но делаем ее тише и дороже: вместо давления на лид — ощущение private sales process и персонального подбора.", "private sales", "Стоимость, условия и подбор должны восприниматься как персональная работа", "linear-gradient(135deg, #445d69 0%, #b78f60 52%, #151617 100%)"),
  makeSection("route", "feature", "30", "Офис продаж", "Офис продаж и персональный показ становятся финальной точкой истории", "Информация об офисе продаж и маршруте должна выглядеть как естественное завершение путешествия по проекту, а не как формальная контактная зона.", "private viewing", "Переход от онлайн-истории к личному контакту должен выглядеть естественно и дорого", "linear-gradient(135deg, #4e6672 0%, #c19d70 50%, #151617 100%)"),
  makeSection("contact-story", "contact", "31", "Персональный запрос", "Запросите подбор апартаментов под ваш сценарий владения", "Финальный блок собирает все линии истории в один спокойный CTA: показать 8 апартаментов, обсудить формат, представить материалы и пригласить на персональный показ.", "персональный подбор", "Контактный блок должен завершать историю так же сильно, как hero ее открывает", "linear-gradient(135deg, #4d6570 0%, #bc9f6f 52%, #151617 100%)"),
  makeSection("footer-story", "feature", "32", "Финальный экран", "История заканчивается там, где начинается личное знакомство с проектом", "Такой one-page сайт должен ощущаться как длинный cinematic scroll: сначала масштаб и образ жизни, затем доверие и технологии, затем 8 апартаментов и спокойный private request в финале.", "cinematic one-page story", "Последний экран фиксирует статус бренда и переводит интерес в действие", "linear-gradient(135deg, #465c66 0%, #b98f61 52%, #141516 100%)")
];

const METRICS = [
  { value: "26 000 м²", label: "уникальное благоустройство" },
  { value: "1,3 ГА", label: "парящие променады" },
  { value: "4,5 ГА", label: "закрытая территория" },
  { value: "2 175 м²", label: "собственный пляж" },
  { value: "80%", label: "видовые резиденции" }
];

const CHATBOT_QUICK_ACTIONS = [
  {
    id: "pricing",
    label: "Стоимость",
    kind: "prompt",
    prompt: "Хочу узнать стоимость и формат покупки."
  },
  {
    id: "lots",
    label: "Лоты и виды",
    kind: "prompt",
    prompt: "Какие есть апартаменты, виды и форматы?"
  },
  {
    id: "service",
    label: "Сервис и SPA",
    kind: "prompt",
    prompt: "Расскажите про сервис, wellness и инфраструктуру."
  },
  {
    id: "showing",
    label: "Персональный показ",
    kind: "scroll",
    target: "final-contact"
  }
];

const CHATBOT_INITIAL_MESSAGES = [
  {
    text: "Здравствуйте. Я онлайн-консьерж Greenmont и могу быстро сориентировать по проекту, лотам, инфраструктуре и следующему шагу.",
    actions: CHATBOT_QUICK_ACTIONS
  },
  {
    text: "Можно спросить про стоимость, видовые апартаменты, сервис private resort, пляж, wellness или сразу перейти к персональному запросу.",
    actions: [
      {
        id: "location",
        label: "Пляж и локация",
        kind: "prompt",
        prompt: "Что важно по локации, пляжу и promenade?"
      },
      {
        id: "apartments",
        label: "8 апартаментов",
        kind: "scroll",
        target: "apartment-01"
      }
    ]
  }
];

function createChatMessage(role, text, actions = []) {
  return {
    id: `${role}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    actions
  };
}

function normalizeChatPrompt(value) {
  return value.trim().toLowerCase().replaceAll("ё", "е");
}

function buildChatbotReply(rawText) {
  const text = normalizeChatPrompt(rawText);

  if (!text) {
    return createChatMessage(
      "assistant",
      "Напишите вопрос, и я подскажу по стоимости, форматам апартаментов, сервису или персональному показу.",
      CHATBOT_QUICK_ACTIONS
    );
  }

  if (/(стоим|цена|сколько|бюджет|прайс)/.test(text)) {
    return createChatMessage(
      "assistant",
      "Стоимость по проекту предоставляется персонально. Сейчас в продаже 8 апартаментов, и подбор лучше делать под сценарий: отдых, второй дом или инвестиция. Откройте персональный запрос, и можно сразу перейти к следующему шагу.",
      [
        { id: "contact-pricing", label: "Открыть запрос", kind: "scroll", target: "final-contact" },
        { id: "apartments-pricing", label: "Смотреть лоты", kind: "scroll", target: "apartment-01" }
      ]
    );
  }

  if (/(апартамент|лот|пентхаус|вид|видов|террас|планиров|спальн)/.test(text)) {
    return createChatMessage(
      "assistant",
      "На сайте собрана коллекция из 8 апартаментов: компактные premium-форматы, семейные резиденции и видовые пентхаусы. Сильнее всего в подаче работают вид, терраса, приватность и сценарий владения.",
      [
        { id: "apartments-scroll", label: "К 8 апартаментам", kind: "scroll", target: "apartment-01" },
        { id: "pricing-after-lots", label: "Запросить подбор", kind: "scroll", target: "final-contact" }
      ]
    );
  }

  if (/(сервис|wellness|spa|спа|медицин|йог|пилатес|спорт|body|mind)/.test(text)) {
    return createChatMessage(
      "assistant",
      "Greenmont подается как private resort: собственный пляж, promenade-маршруты, SPA и wellness, медицинский центр, Body & Mind, спорт, семейная инфраструктура и персональный сервис владения.",
      [
        { id: "service-prompt", label: "Пляж и локация", kind: "prompt", prompt: "Что важно по локации, пляжу и promenade?" },
        { id: "service-contact", label: "Персональный показ", kind: "scroll", target: "final-contact" }
      ]
    );
  }

  if (/(пляж|море|локац|сочи|район|променад|promenade)/.test(text)) {
    return createChatMessage(
      "assistant",
      "Ключевые аргументы локации: Сочи, 4,5 га закрытой территории, 1,3 га парящих променадов и 2 175 м² собственного пляжа. Это один из самых сильных продающих блоков проекта.",
      [
        { id: "location-show", label: "Смотреть лоты", kind: "scroll", target: "apartment-01" },
        { id: "location-contact", label: "Оставить запрос", kind: "scroll", target: "final-contact" }
      ]
    );
  }

  if (/(показ|связ|консультац|заявк|телефон|менеджер|презентац)/.test(text)) {
    return createChatMessage(
      "assistant",
      "Можно сразу перейти к персональному запросу: оставить имя, телефон и указать интересующий лот или сценарий владения. Этот блок уже встроен в финал страницы.",
      [
        { id: "contact-open", label: "Перейти к заявке", kind: "scroll", target: "final-contact" },
        { id: "contact-lots", label: "Сначала посмотреть лоты", kind: "scroll", target: "apartment-01" }
      ]
    );
  }

  if (/(привет|здравств|hello|hi)/.test(text)) {
    return createChatMessage(
      "assistant",
      "Здравствуйте. Могу помочь по стоимости, доступным апартаментам, инфраструктуре, пляжу, wellness и записи на персональный показ.",
      CHATBOT_QUICK_ACTIONS
    );
  }

  return createChatMessage(
    "assistant",
    "Я могу быстро помочь с пятью сценариями: стоимость, доступные апартаменты, сервис private resort, локация у моря и персональный показ. Выберите одно из направлений ниже.",
    CHATBOT_QUICK_ACTIONS
  );
}

function clampColorValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function parseColor(color) {
  if (typeof color !== "string") {
    return null;
  }

  const value = color.trim();

  if (value.startsWith("#")) {
    const normalized = value.slice(1);
    const hex = normalized.length === 3
      ? normalized
          .split("")
          .map((item) => `${item}${item}`)
          .join("")
      : normalized;

    if (hex.length !== 6) {
      return null;
    }

    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
      a: 1
    };
  }

  const rgbaMatch = value.match(/^rgba?\(([^)]+)\)$/i);

  if (!rgbaMatch) {
    return null;
  }

  const parts = rgbaMatch[1].split(",").map((item) => item.trim());

  if (parts.length < 3) {
    return null;
  }

  return {
    r: Number.parseFloat(parts[0]),
    g: Number.parseFloat(parts[1]),
    b: Number.parseFloat(parts[2]),
    a: parts[3] === undefined ? 1 : Number.parseFloat(parts[3])
  };
}

function formatRgba({ r, g, b, a = 1 }) {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${clampColorValue(a, 0, 1).toFixed(3)})`;
}

function withAlpha(color, alpha) {
  const parsed = parseColor(color);

  if (!parsed) {
    return color;
  }

  return formatRgba({ ...parsed, a: alpha });
}

function mixColors(baseColor, targetColor, weight = 0.5) {
  const base = parseColor(baseColor);
  const target = parseColor(targetColor);

  if (!base || !target) {
    return baseColor || targetColor || "transparent";
  }

  const mixWeight = clampColorValue(weight, 0, 1);

  return formatRgba({
    r: base.r + (target.r - base.r) * mixWeight,
    g: base.g + (target.g - base.g) * mixWeight,
    b: base.b + (target.b - base.b) * mixWeight,
    a: base.a + (target.a - base.a) * mixWeight
  });
}

function getRelativeLuminance(color) {
  const parsed = parseColor(color);

  if (!parsed) {
    return 0;
  }

  const toLinear = (channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  const red = toLinear(parsed.r);
  const green = toLinear(parsed.g);
  const blue = toLinear(parsed.b);

  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function createTheme(theme) {
  const isLightTheme = getRelativeLuminance(theme.background) > 0.7;
  const heroTint = mixColors(theme.background, theme.backgroundAlt, 0.52);
  const heroTintStrong = mixColors(heroTint, theme.panel, 0.42);
  const heroBackdropBase = mixColors(theme.surfaceStrong, theme.background, 0.28);
  const heroBackdropEdge = mixColors(theme.backgroundAlt, theme.panel, 0.56);

  return {
    ...theme,
    hero: {
      globalScrim: `radial-gradient(circle at top, ${withAlpha(theme.accent, isLightTheme ? 0.10 : 0.14)} 0%, transparent 24%), linear-gradient(180deg, ${withAlpha(heroTint, isLightTheme ? 0.12 : 0.14)} 0%, ${withAlpha(heroTintStrong, isLightTheme ? 0.22 : 0.24)} 48%, ${withAlpha(heroBackdropEdge, isLightTheme ? 0.52 : 0.56)} 100%)`,
      desktopScrim: `linear-gradient(90deg, ${withAlpha(heroBackdropEdge, isLightTheme ? 0.72 : 0.74)} 0%, ${withAlpha(heroTintStrong, isLightTheme ? 0.42 : 0.40)} 34%, transparent 70%)`,
      mobileScrim: `linear-gradient(180deg, ${withAlpha(heroBackdropEdge, isLightTheme ? 0.76 : 0.70)} 0%, ${withAlpha(heroTintStrong, isLightTheme ? 0.48 : 0.44)} 24%, ${withAlpha(heroTintStrong, isLightTheme ? 0.28 : 0.24)} 56%, ${withAlpha(heroBackdropEdge, isLightTheme ? 0.46 : 0.52)} 100%)`,
      textBackdrop: `linear-gradient(160deg, ${withAlpha(heroBackdropBase, isLightTheme ? 0.82 : 0.50)} 0%, ${withAlpha(heroBackdropEdge, isLightTheme ? 0.58 : 0.34)} 62%, ${withAlpha(theme.accentSoft, isLightTheme ? 0.16 : 0.12)} 100%)`,
      textBackdropBorder: withAlpha(theme.text, isLightTheme ? 0.12 : 0.10),
      textBackdropGlow: withAlpha(theme.accent, isLightTheme ? 0.10 : 0.16),
      headingShadow: `0 2px 20px ${withAlpha(theme.backgroundAlt, isLightTheme ? 0.16 : 0.54)}, 0 12px 42px ${withAlpha(theme.background, isLightTheme ? 0.08 : 0.22)}`,
      eyebrowText: withAlpha(theme.text, isLightTheme ? 0.80 : 0.82),
      copyText: withAlpha(theme.text, isLightTheme ? 0.88 : 0.89),
      chipBackground: `linear-gradient(135deg, ${withAlpha(heroBackdropBase, isLightTheme ? 0.84 : 0.56)} 0%, ${withAlpha(heroBackdropEdge, isLightTheme ? 0.60 : 0.46)} 100%)`,
      chipBorder: withAlpha(theme.text, isLightTheme ? 0.16 : 0.18),
      chipText: mixColors(theme.accent, theme.text, isLightTheme ? 0.12 : 0.08),
      secondaryCtaBackground: `linear-gradient(135deg, ${withAlpha(heroBackdropBase, isLightTheme ? 0.80 : 0.50)} 0%, ${withAlpha(heroBackdropEdge, isLightTheme ? 0.56 : 0.38)} 100%)`,
      secondaryCtaBorder: withAlpha(theme.text, isLightTheme ? 0.16 : 0.18),
      secondaryCtaText: theme.text,
      panelSurface: `linear-gradient(160deg, ${withAlpha(mixColors(theme.surfaceStrong, heroBackdropBase, 0.42), isLightTheme ? 0.92 : 0.62)} 0%, ${withAlpha(heroBackdropEdge, isLightTheme ? 0.52 : 0.36)} 100%)`,
      panelCardSurface: `linear-gradient(160deg, ${withAlpha(mixColors(theme.panel, heroBackdropBase, 0.38), isLightTheme ? 0.80 : 0.42)} 0%, ${withAlpha(heroBackdropEdge, isLightTheme ? 0.42 : 0.30)} 100%)`,
      panelBorder: withAlpha(theme.text, isLightTheme ? 0.12 : 0.11),
      panelBodyText: withAlpha(theme.text, isLightTheme ? 0.80 : 0.76),
      panelMetaText: withAlpha(theme.text, isLightTheme ? 0.64 : 0.60),
      panelPillBackground: withAlpha(heroBackdropEdge, isLightTheme ? 0.58 : 0.40),
      panelPillText: withAlpha(theme.text, isLightTheme ? 0.66 : 0.64)
    }
  };
}

const THEMES = [
  {
    id: "obsidian-gold",
    name: "Obsidian Gold",
    mood: "Тихая роскошь",
    description: "Темная классика с золотым акцентом и спокойной аристократичной типографикой.",
    background: "#09090a",
    backgroundAlt: "#0d0d0f",
    surface: "rgba(255,255,255,0.04)",
    surfaceStrong: "rgba(255,255,255,0.07)",
    panel: "rgba(0,0,0,0.24)",
    header: "rgba(9,9,10,0.82)",
    border: "rgba(255,255,255,0.10)",
    text: "#f5f1e8",
    muted: "rgba(245,241,232,0.62)",
    subtle: "rgba(245,241,232,0.42)",
    accent: "#c6a66a",
    accentSoft: "rgba(198,166,106,0.14)",
    buttonText: "#181512",
    headingFont: "\"Prata\", \"Playfair Display\", serif",
    bodyFont: "\"Onest\", \"Inter\", sans-serif",
    headingSpacing: "-0.045em",
    bodySpacing: "0.01em",
    headingStyle: "normal",
    eyebrowSpacing: "0.38em"
  },
  {
    id: "ivory-coast",
    name: "Ivory Coast",
    mood: "Светлая редакционная подача",
    description: "Светлая coastal-палитра с мягкими песочными оттенками и легкой editorial-типографикой.",
    background: "#f4efe6",
    backgroundAlt: "#efe8dc",
    surface: "rgba(255,255,255,0.72)",
    surfaceStrong: "rgba(255,255,255,0.88)",
    panel: "rgba(255,255,255,0.70)",
    header: "rgba(244,239,230,0.86)",
    border: "rgba(45,34,24,0.12)",
    text: "#2d2218",
    muted: "rgba(45,34,24,0.68)",
    subtle: "rgba(45,34,24,0.42)",
    accent: "#a87b45",
    accentSoft: "rgba(168,123,69,0.12)",
    buttonText: "#ffffff",
    headingFont: "\"Playfair Display\", \"Prata\", serif",
    bodyFont: "\"Inter\", \"Onest\", sans-serif",
    headingSpacing: "-0.03em",
    bodySpacing: "0.002em",
    headingStyle: "normal",
    eyebrowSpacing: "0.32em"
  },
  {
    id: "emerald-cliff",
    name: "Emerald Cliff",
    mood: "Ботанический премиум",
    description: "Глубокая зелень, теплое золото и более плотная статусная пластика текста.",
    background: "#08110f",
    backgroundAlt: "#0d1715",
    surface: "rgba(255,255,255,0.04)",
    surfaceStrong: "rgba(255,255,255,0.08)",
    panel: "rgba(2,12,10,0.30)",
    header: "rgba(8,17,15,0.84)",
    border: "rgba(211,230,216,0.12)",
    text: "#eef3ec",
    muted: "rgba(238,243,236,0.64)",
    subtle: "rgba(238,243,236,0.40)",
    accent: "#b9985b",
    accentSoft: "rgba(185,152,91,0.14)",
    buttonText: "#171410",
    headingFont: "\"Cormorant Garamond\", \"Prata\", serif",
    bodyFont: "\"Onest\", \"Inter\", sans-serif",
    headingSpacing: "-0.05em",
    bodySpacing: "0.01em",
    headingStyle: "normal",
    eyebrowSpacing: "0.40em"
  },
  {
    id: "sapphire-noir",
    name: "Sapphire Noir",
    mood: "Холодный high-end",
    description: "Темный сине-графитовый режим с более строгой, почти fashion-типографикой.",
    background: "#071018",
    backgroundAlt: "#0b1620",
    surface: "rgba(255,255,255,0.04)",
    surfaceStrong: "rgba(255,255,255,0.07)",
    panel: "rgba(4,10,18,0.32)",
    header: "rgba(7,16,24,0.84)",
    border: "rgba(214,225,240,0.10)",
    text: "#eef4fa",
    muted: "rgba(238,244,250,0.64)",
    subtle: "rgba(238,244,250,0.40)",
    accent: "#86a8c7",
    accentSoft: "rgba(134,168,199,0.15)",
    buttonText: "#081018",
    headingFont: "\"Marcellus\", \"Prata\", serif",
    bodyFont: "\"Montserrat\", \"Onest\", sans-serif",
    headingSpacing: "-0.03em",
    bodySpacing: "0.015em",
    headingStyle: "normal",
    eyebrowSpacing: "0.42em"
  },
  {
    id: "sunset-terracotta",
    name: "Sunset Terracotta",
    mood: "Теплая курортная редакция",
    description: "Песочно-терракотовая палитра с более эмоциональной и мягкой стилистикой текста.",
    background: "#1b130f",
    backgroundAlt: "#241914",
    surface: "rgba(255,255,255,0.04)",
    surfaceStrong: "rgba(255,255,255,0.07)",
    panel: "rgba(20,12,9,0.30)",
    header: "rgba(27,19,15,0.84)",
    border: "rgba(244,224,205,0.10)",
    text: "#f8ede1",
    muted: "rgba(248,237,225,0.64)",
    subtle: "rgba(248,237,225,0.40)",
    accent: "#d38a5c",
    accentSoft: "rgba(211,138,92,0.14)",
    buttonText: "#1b120f",
    headingFont: "\"Playfair Display\", \"Cormorant Garamond\", serif",
    bodyFont: "\"Manrope\", \"Onest\", sans-serif",
    headingSpacing: "-0.035em",
    bodySpacing: "0.006em",
    headingStyle: "normal",
    eyebrowSpacing: "0.34em"
  },
  {
    id: "pearl-mist",
    name: "Pearl Mist",
    mood: "Минималистичный coastal luxury",
    description: "Светлая графичная схема с почти журнальной чистотой и воздушным текстом.",
    background: "#f8f8f6",
    backgroundAlt: "#efefeb",
    surface: "rgba(255,255,255,0.82)",
    surfaceStrong: "rgba(255,255,255,0.92)",
    panel: "rgba(255,255,255,0.76)",
    header: "rgba(248,248,246,0.88)",
    border: "rgba(28,30,33,0.10)",
    text: "#1f2226",
    muted: "rgba(31,34,38,0.68)",
    subtle: "rgba(31,34,38,0.42)",
    accent: "#8a9bb0",
    accentSoft: "rgba(138,155,176,0.12)",
    buttonText: "#ffffff",
    headingFont: "\"Libre Baskerville\", \"Playfair Display\", serif",
    bodyFont: "\"Inter\", \"Onest\", sans-serif",
    headingSpacing: "-0.028em",
    bodySpacing: "0.002em",
    headingStyle: "normal",
    eyebrowSpacing: "0.30em"
  },
  {
    id: "graphite-platinum",
    name: "Graphite Platinum",
    mood: "Современный девелоперский режим",
    description: "Монохромная premium-система с платиновым акцентом и строгим технологичным языком.",
    background: "#101112",
    backgroundAlt: "#151617",
    surface: "rgba(255,255,255,0.035)",
    surfaceStrong: "rgba(255,255,255,0.065)",
    panel: "rgba(9,10,11,0.30)",
    header: "rgba(16,17,18,0.84)",
    border: "rgba(255,255,255,0.10)",
    text: "#f2f3f4",
    muted: "rgba(242,243,244,0.66)",
    subtle: "rgba(242,243,244,0.42)",
    accent: "#b9c0c7",
    accentSoft: "rgba(185,192,199,0.14)",
    buttonText: "#111214",
    headingFont: "\"Tenor Sans\", \"Marcellus\", serif",
    bodyFont: "\"Montserrat\", \"Inter\", sans-serif",
    headingSpacing: "-0.02em",
    bodySpacing: "0.02em",
    headingStyle: "normal",
    eyebrowSpacing: "0.44em"
  },
  {
    id: "forest-amber",
    name: "Forest Amber",
    mood: "Землистый resort premium",
    description: "Темно-оливковая схема с теплым янтарным акцентом и мягкой природной пластикой текста.",
    background: "#11120f",
    backgroundAlt: "#171914",
    surface: "rgba(255,255,255,0.04)",
    surfaceStrong: "rgba(255,255,255,0.07)",
    panel: "rgba(10,11,8,0.30)",
    header: "rgba(17,18,15,0.84)",
    border: "rgba(230,223,206,0.10)",
    text: "#f4efe5",
    muted: "rgba(244,239,229,0.64)",
    subtle: "rgba(244,239,229,0.42)",
    accent: "#c7984f",
    accentSoft: "rgba(199,152,79,0.14)",
    buttonText: "#18140f",
    headingFont: "\"Cormorant Garamond\", \"Libre Baskerville\", serif",
    bodyFont: "\"Manrope\", \"Onest\", sans-serif",
    headingSpacing: "-0.04em",
    bodySpacing: "0.008em",
    headingStyle: "italic",
    eyebrowSpacing: "0.36em"
  },
  {
    id: "midnight-rose",
    name: "Midnight Rose",
    mood: "Fashion luxury",
    description: "Глубокий винно-графитовый режим с более выразительной и утонченной стилистикой заголовков.",
    background: "#140f14",
    backgroundAlt: "#1a131a",
    surface: "rgba(255,255,255,0.04)",
    surfaceStrong: "rgba(255,255,255,0.07)",
    panel: "rgba(14,9,14,0.32)",
    header: "rgba(20,15,20,0.84)",
    border: "rgba(242,224,234,0.10)",
    text: "#f8edf3",
    muted: "rgba(248,237,243,0.64)",
    subtle: "rgba(248,237,243,0.42)",
    accent: "#c58aa6",
    accentSoft: "rgba(197,138,166,0.14)",
    buttonText: "#1a1017",
    headingFont: "\"Playfair Display\", \"Prata\", serif",
    bodyFont: "\"Onest\", \"Inter\", sans-serif",
    headingSpacing: "-0.038em",
    bodySpacing: "0.008em",
    headingStyle: "italic",
    eyebrowSpacing: "0.34em"
  },
  {
    id: "sand-stone",
    name: "Sand Stone",
    mood: "Resort minimal",
    description: "Светлая песочно-каменная схема с чистой спокойной подачей и естественной typographic balance.",
    background: "#efe8dd",
    backgroundAlt: "#e8dfd3",
    surface: "rgba(255,255,255,0.74)",
    surfaceStrong: "rgba(255,255,255,0.90)",
    panel: "rgba(255,255,255,0.74)",
    header: "rgba(239,232,221,0.88)",
    border: "rgba(63,48,35,0.12)",
    text: "#33261d",
    muted: "rgba(51,38,29,0.68)",
    subtle: "rgba(51,38,29,0.42)",
    accent: "#af8661",
    accentSoft: "rgba(175,134,97,0.12)",
    buttonText: "#ffffff",
    headingFont: "\"Marcellus\", \"Libre Baskerville\", serif",
    bodyFont: "\"Onest\", \"Inter\", sans-serif",
    headingSpacing: "-0.026em",
    bodySpacing: "0.004em",
    headingStyle: "normal",
    eyebrowSpacing: "0.32em"
  }
].map(createTheme);

const VISUAL_FORMATS = [
  {
    id: "cinematic",
    name: "Кинематографичный",
    description: "Крупные media-блоки, больше воздуха и сильный параллакс.",
    heroMinHeight: "min-h-[34rem] sm:min-h-[42rem] lg:min-h-screen",
    sectionMediaHeight: "min-h-[20rem] sm:min-h-[28rem] lg:min-h-[72vh]",
    compact: false,
    maxTextWidth: "max-w-3xl",
    storyCols: "lg:grid-cols-[0.94fr_1.06fr]",
    apartmentCols: "lg:grid-cols-[0.9fr_1.1fr]",
    parallaxBoost: 1.15,
    mediaEmphasis: 1.08
  },
  {
    id: "editorial",
    name: "Редакционный",
    description: "Больше акцента на типографике, цитатах и спокойной editorial-подаче.",
    heroMinHeight: "min-h-[32rem] sm:min-h-[40rem] lg:min-h-[92vh]",
    sectionMediaHeight: "min-h-[19rem] sm:min-h-[25rem] lg:min-h-[60vh]",
    compact: false,
    maxTextWidth: "max-w-2xl",
    storyCols: "lg:grid-cols-[1fr_1fr]",
    apartmentCols: "lg:grid-cols-[1fr_1fr]",
    parallaxBoost: 0.9,
    mediaEmphasis: 1.02
  },
  {
    id: "gallery",
    name: "Галерейный",
    description: "Фото-доминантный режим с более широкими визуальными блоками и короткими подписями.",
    heroMinHeight: "min-h-[34rem] sm:min-h-[42rem] lg:min-h-[96vh]",
    sectionMediaHeight: "min-h-[21rem] sm:min-h-[30rem] lg:min-h-[78vh]",
    compact: true,
    maxTextWidth: "max-w-xl",
    storyCols: "lg:grid-cols-[0.84fr_1.16fr]",
    apartmentCols: "lg:grid-cols-[0.82fr_1.18fr]",
    parallaxBoost: 1.25,
    mediaEmphasis: 1.12
  },
  {
    id: "catalog",
    name: "Каталожный",
    description: "Более структурированная подача со спецификациями и ровным темпом контента.",
    heroMinHeight: "min-h-[31rem] sm:min-h-[38rem] lg:min-h-[88vh]",
    sectionMediaHeight: "min-h-[18rem] sm:min-h-[24rem] lg:min-h-[54vh]",
    compact: true,
    maxTextWidth: "max-w-3xl",
    storyCols: "lg:grid-cols-[1.02fr_0.98fr]",
    apartmentCols: "lg:grid-cols-[1.02fr_0.98fr]",
    parallaxBoost: 0.78,
    mediaEmphasis: 0.98
  }
];

const STORY_SECTION_IDS = [...STORY_SECTIONS.slice(1), ...FINAL_SECTIONS].map((item) => item.id);

function pickFromList(list, index, fallback = null) {
  if (!Array.isArray(list) || list.length === 0) {
    return fallback;
  }

  return list[((index % list.length) + list.length) % list.length] ?? fallback;
}

const HERO_ASSETS = {
  cinematic: HERO_MEDIA[0],
  editorial: HERO_MEDIA[3] ?? HERO_MEDIA[1] ?? HERO_MEDIA[0],
  gallery: HERO_MEDIA[4] ?? HERO_MEDIA[2] ?? HERO_MEDIA[0],
  catalog: HERO_MEDIA[5] ?? HERO_MEDIA[1] ?? HERO_MEDIA[0]
};

const STORY_ASSET_OVERRIDES = {
  metrics: HERO_MEDIA[5] ?? pickFromList(HERO_MEDIA, 5),
  concept: HERO_MEDIA[3] ?? pickFromList(HERO_MEDIA, 3),
  "private-resort": HERO_MEDIA[1] ?? pickFromList(HERO_MEDIA, 1),
  promenade: HERO_MEDIA[0] ?? pickFromList(HERO_MEDIA, 0),
  beach: GALLERY_ASSETS[0] ?? pickFromList(GALLERY_ASSETS, 0),
  bridges: HERO_MEDIA[4] ?? pickFromList(HERO_MEDIA, 4),
  "five-senses": GALLERY_ASSETS[1] ?? pickFromList(GALLERY_ASSETS, 1),
  "art-park": HERO_MEDIA[2] ?? pickFromList(HERO_MEDIA, 2),
  "evening-light": HERO_MEDIA[0] ?? pickFromList(HERO_MEDIA, 0)
};

const STORY_ASSET_MAP = STORY_SECTION_IDS.reduce((accumulator, id, index) => {
  accumulator[id] =
    STORY_ASSET_OVERRIDES[id] ??
    pickFromList(STORY_MEDIA, index) ??
    pickFromList(GALLERY_ASSETS, index) ??
    pickFromList(HERO_MEDIA, index) ??
    null;

  return accumulator;
}, {});

const APARTMENT_ASSETS = APARTMENTS.reduce((accumulator, item, index) => {
  const main = pickFromList(APARTMENT_MEDIA, index) ?? pickFromList(HERO_MEDIA, index);

  accumulator[item.id] = {
    main,
    interior: pickFromList(STORY_MEDIA, index + 24, main),
    terrace: pickFromList(GALLERY_ASSETS, index, pickFromList(HERO_MEDIA, index + 1, main)),
    plan: null
  };

  return accumulator;
}, {});

const STORY_VIDEO_ASSETS = {
  gallery: VIDEO_ASSETS.gallery
};

const DESKTOP_CHAPTER_BREAKS = {
  "final-contact": {
    variant: "lounge",
    label: "Финал",
    title: "Последний экран должен ощущаться не формой, а входом в private dialogue",
    text: "Финальный контактный блок обязан удерживать уровень всей истории: спокойный high-end, сильный аргумент доверия и понятный следующий шаг без ощущения дешевого lead-form."
  }
};

const DESKTOP_QUOTE_MOMENTS = {
  service: {
    label: "Private service",
    quote: "Курортный сервис с профессиональным управлением",
    note: "Продуманная инфраструктура, пятизвездочный сервис и управление профессионального оператора формируют здесь формат частного курорта. Консьерж 24/7, обслуживание резиденций, клининг, удобное передвижение по территории и доступ ко всей инфраструктуре позволяют наслаждаться отдыхом, жизнью и владением без лишних забот."
  }
};

const getHeroAsset = (formatId) => HERO_ASSETS[formatId] || HERO_ASSETS.cinematic;
const getStoryAsset = (id) => STORY_ASSET_MAP[id] || pickFromList(STORY_MEDIA, 0) || pickFromList(HERO_MEDIA, 0);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getApartmentSalesProfile(item) {
  if (item.area.includes("24,8")) {
    return {
      scenario: "Инвестиционный coastal-stay формат",
      pitch: "Низкий порог входа, сильный rental-сценарий и редкий private resort context."
    };
  }

  if (item.area.includes("52,1")) {
    return {
      scenario: "Пара или второй дом у моря",
      pitch: "Компактная резиденция с ощущением большого lifestyle-продукта вокруг."
    };
  }

  if (item.area.includes("78,4") || item.area.includes("86,9")) {
    return {
      scenario: "Семейное владение на длинный сезон",
      pitch: "Сильнее всего продается через приватность, outdoor-ритм и ощущение второго дома."
    };
  }

  if (item.area.includes("102,3") || item.area.includes("118,7")) {
    return {
      scenario: "Коллекционный family-lot",
      pitch: "Здесь цена должна оправдываться террасой, шириной сценария проживания и coastal rarity."
    };
  }

  return {
    scenario: "Редкий high-end coastal asset",
    pitch: "Пентхаусная приватность, панорамный горизонт и статусный сценарий private ownership."
  };
}

function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return scrollY;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncPreference);
      return () => mediaQuery.removeEventListener("change", syncPreference);
    }

    mediaQuery.addListener(syncPreference);
    return () => mediaQuery.removeListener(syncPreference);
  }, []);

  return prefersReducedMotion;
}

function useIsPhoneViewport() {
  const [isPhoneViewport, setIsPhoneViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsPhoneViewport(mediaQuery.matches);

    syncViewport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewport);
      return () => mediaQuery.removeEventListener("change", syncViewport);
    }

    mediaQuery.addListener(syncViewport);
    return () => mediaQuery.removeListener(syncViewport);
  }, []);

  return isPhoneViewport;
}

function useIsCompactViewport() {
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const syncViewport = () => setIsCompactViewport(mediaQuery.matches);

    syncViewport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewport);
      return () => mediaQuery.removeEventListener("change", syncViewport);
    }

    mediaQuery.addListener(syncViewport);
    return () => mediaQuery.removeListener(syncViewport);
  }, []);

  return isCompactViewport;
}

function useAssetSource(src) {
  const candidates = useMemo(() => buildAssetCandidateChain(src), [src]);
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [src]);

  const handleError = useCallback(() => {
    setCandidateIndex((index) => index + 1);
  }, []);

  return {
    src: candidates[candidateIndex] ?? null,
    onError: handleError
  };
}

function MediaFill({
  imageSrc,
  videoSrc,
  posterSrc,
  gradient,
  transform,
  containerClassName = "absolute inset-0",
  mediaClassName = "h-full w-full object-cover",
  priority = false,
  preferStaticMedia = false
}) {
  const imageAsset = useAssetSource(imageSrc);
  const posterAsset = useAssetSource(posterSrc || imageSrc);
  const videoRef = useRef(null);
  const [isVideoAvailable, setIsVideoAvailable] = useState(Boolean(videoSrc));

  useEffect(() => {
    setIsVideoAvailable(Boolean(videoSrc));
  }, [videoSrc]);

  const stillImageSrc = imageAsset.src || posterAsset.src;
  const stillImageErrorHandler = imageAsset.src ? imageAsset.onError : posterAsset.onError;
  const layerStyle = {
    transform,
    willChange: transform ? "transform" : undefined
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !videoSrc || !isVideoAvailable || preferStaticMedia) {
      return undefined;
    }

    videoElement.muted = true;
    videoElement.defaultMuted = true;
    videoElement.setAttribute("muted", "");
    videoElement.setAttribute("playsinline", "");
    videoElement.setAttribute("webkit-playsinline", "true");

    const attemptPlayback = async () => {
      try {
        await videoElement.play();
      } catch {
        // Keep the poster visible if autoplay is blocked or delayed.
      }
    };

    attemptPlayback();
    videoElement.addEventListener("canplay", attemptPlayback);

    return () => {
      videoElement.removeEventListener("canplay", attemptPlayback);
    };
  }, [videoSrc, isVideoAvailable, preferStaticMedia]);

  return (
    <>
      <div className={containerClassName} style={{ background: gradient, ...layerStyle }} />
      {videoSrc && isVideoAvailable && !preferStaticMedia ? (
        <video
          ref={videoRef}
          className={`${containerClassName} ${mediaClassName}`.trim()}
          poster={posterAsset.src || undefined}
          autoPlay
          controls={false}
          defaultMuted
          disablePictureInPicture
          loop
          muted
          playsInline
          preload={priority ? "auto" : "metadata"}
          aria-hidden="true"
          style={layerStyle}
          onError={() => setIsVideoAvailable(false)}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : stillImageSrc ? (
        <img
          src={stillImageSrc}
          alt=""
          aria-hidden="true"
          className={`${containerClassName} ${mediaClassName}`.trim()}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          draggable={false}
          style={layerStyle}
          onError={stillImageErrorHandler}
        />
      ) : null}
    </>
  );
}

function ThemeChip({ theme, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="min-w-[180px] rounded-[1.4rem] border p-4 text-left transition"
      style={{
        borderColor: active ? theme.accent : theme.border,
        background: active ? theme.accentSoft : theme.surface,
        color: theme.text
      }}
    >
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: theme.accent }} />
        <span className="text-sm font-semibold">{theme.name}</span>
      </div>
      <div className="mt-2 text-xs" style={{ color: theme.muted }}>
        {theme.mood}
      </div>
    </button>
  );
}

function FormatChip({ theme, format, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-[1.2rem] border p-4 text-left transition"
      style={{
        borderColor: active ? theme.accent : theme.border,
        background: active ? theme.accentSoft : theme.surface,
        color: theme.text
      }}
    >
      <div className="text-sm font-semibold">{format.name}</div>
      <div className="mt-2 text-xs leading-6" style={{ color: theme.muted }}>
        {format.description}
      </div>
    </button>
  );
}

function SettingsDrawer({
  isOpen,
  onClose,
  theme,
  format,
  themeId,
  formatId,
  onThemeChange,
  onFormatChange
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Закрыть меню настроек"
        onClick={onClose}
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(4, 6, 8, 0.58)" }}
      />
      <aside
        id="settings-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Настройки вида сайта"
        className="absolute inset-y-0 right-0 flex h-full w-[92vw] max-w-[38rem] flex-col border-l shadow-[0_30px_120px_rgba(0,0,0,0.34)]"
        style={{
          borderColor: theme.border,
          background: `linear-gradient(180deg, ${theme.backgroundAlt} 0%, ${theme.background} 100%)`,
          color: theme.text
        }}
      >
        <div
          className="flex items-start justify-between gap-6 border-b px-5 py-5 md:px-7"
          style={{ borderColor: theme.border, background: theme.header, backdropFilter: "blur(18px)" }}
        >
          <div>
            <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
              Настройки вида
            </div>
            <div
              className="mt-2 text-[1.85rem] leading-[0.98]"
              style={{
                fontFamily: theme.headingFont,
                letterSpacing: theme.headingSpacing,
                fontStyle: theme.headingStyle,
                fontWeight: 400
              }}
            >
              Цветовая схема и визуальный формат
            </div>
            <p className="mt-3 max-w-md text-sm leading-7" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
              Переключайте подачу истории без смены narrative-scroll: палитра, ритм текста и характер визуальной композиции обновляются сразу.
            </p>
          </div>
          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="rounded-full border px-4 py-2 text-[11px] uppercase transition"
            style={{
              borderColor: theme.border,
              background: theme.surface,
              color: theme.muted,
              letterSpacing: "0.24em"
            }}
          >
            Закрыть
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-7 md:py-6">
          <section className="rounded-[2rem] border p-5" style={{ borderColor: theme.border, background: theme.surface }}>
            <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
              Выбор цветовой схемы
            </div>
            <div
              className="mt-3 text-[1.7rem] leading-[1]"
              style={{ fontFamily: theme.headingFont, letterSpacing: theme.headingSpacing, fontStyle: theme.headingStyle }}
            >
              10 цветовых схем, и у каждой — своя стилистика текста
            </div>
            <p className="mt-3 text-sm leading-7" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
              Меняются палитра, акцент, контраст, шрифтовая пара, характер заголовков, межбуквенный ритм и общая эмоциональная тональность текста.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {THEMES.map((item) => (
                <ThemeChip key={item.id} theme={item} active={item.id === themeId} onClick={() => onThemeChange(item.id)} />
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-[2rem] border p-5" style={{ borderColor: theme.border, background: theme.surface }}>
            <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
              Выбор визуального формата
            </div>
            <div
              className="mt-3 text-[1.7rem] leading-[1]"
              style={{ fontFamily: theme.headingFont, letterSpacing: theme.headingSpacing, fontStyle: theme.headingStyle }}
            >
              Несколько визуальных форматов для одной и той же истории
            </div>
            <p className="mt-3 text-sm leading-7" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
              Можно переключать способ подачи: более кинематографично, более редакционно, более галерейно или более структурно-каталожно, не ломая сам narrative-scroll и общую luxury-композицию.
            </p>
            <div className="mt-5 grid gap-3">
              {VISUAL_FORMATS.map((item) => (
                <FormatChip
                  key={item.id}
                  theme={theme}
                  format={item}
                  active={item.id === formatId}
                  onClick={() => onFormatChange(item.id)}
                />
              ))}
            </div>
            <div className="mt-5 rounded-[1.6rem] border p-4 text-sm leading-7" style={{ borderColor: theme.border, background: theme.panel, color: theme.muted }}>
              Активно сейчас: <span style={{ color: theme.text }}>{format.name}</span>.
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

function HeaderNavMenu({ isOpen, onClose, navItems, theme }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Закрыть навигацию"
        onClick={onClose}
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(4, 6, 8, 0.34)" }}
      />
      <div
        className="absolute left-4 right-4 top-20 rounded-[2rem] border p-4 shadow-[0_30px_120px_rgba(0,0,0,0.28)] sm:left-auto sm:right-6 sm:w-[24rem] lg:right-10 lg:top-24"
        style={{
          borderColor: theme.border,
          background: theme.header,
          backdropFilter: "blur(22px)"
        }}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
              Навигация
            </div>
            <div className="mt-1 text-sm" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
              Быстрый переход по ключевым разделам
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border px-4 py-2 text-[11px] uppercase transition"
            style={{
              borderColor: theme.border,
              background: theme.surface,
              color: theme.muted,
              letterSpacing: "0.24em"
            }}
          >
            Закрыть
          </button>
        </div>
        <nav className="grid gap-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={onClose}
              className="rounded-[1.2rem] border px-4 py-3 text-sm transition"
              style={{
                borderColor: theme.border,
                background: theme.surface,
                color: theme.text
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

function StoryHeader({ item, theme, format }) {
  const headingWrapClass =
    item.id === "private-resort"
      ? "[overflow-wrap:normal] [word-break:normal] [hyphens:none]"
      : "[overflow-wrap:anywhere]";
  const headingSizeClass =
    item.id === "private-resort"
      ? "text-[2.7rem] md:text-[3.5rem] xl:text-[4.15rem]"
      : item.id === "gazebos"
        ? "text-[2.6rem] md:text-[3.8rem] xl:text-[4.6rem]"
        : item.id === "wellness"
          ? "text-[2.55rem] md:text-[3.75rem] xl:text-[4.55rem]"
        : "text-[2.7rem] md:text-[4.1rem] xl:text-[5rem]";

  return (
    <div className={`${format.maxTextWidth} desktop-text-measure min-w-0 max-w-full`}>
      <div
        className="story-eyebrow flex flex-wrap items-center gap-4 text-[11px] uppercase"
        style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}
      >
        <span>{item.label}</span>
        <span className="h-px w-16" style={{ backgroundColor: theme.accent }} />
        <span>{item.eyebrow}</span>
      </div>
      <h2
        className={`story-heading desktop-heading-measure mt-5 max-w-full leading-[0.92] ${headingSizeClass} ${headingWrapClass}`}
        style={{
          fontFamily: theme.headingFont,
          letterSpacing: theme.headingSpacing,
          color: theme.text,
          fontStyle: theme.headingStyle,
          fontWeight: 400
        }}
      >
        {item.title}
      </h2>
      <div
        className="story-copy desktop-story-copy-measure mt-8 max-w-full border-l pl-6 text-base leading-8 [overflow-wrap:anywhere]"
        style={{ borderColor: theme.accent, color: theme.muted, letterSpacing: theme.bodySpacing }}
      >
        {item.text}
      </div>
      <div
        className="mobile-pill mt-7 inline-flex max-w-full flex-wrap rounded-full border px-4 py-2 text-[12px] uppercase leading-6 [overflow-wrap:anywhere]"
        style={{
          borderColor: theme.accent,
          background: theme.accentSoft,
          color: theme.accent,
          letterSpacing: "0.22em"
        }}
      >
        {item.accent} · {theme.mood}
      </div>
    </div>
  );
}

function DesktopChapterBreak({ chapter, theme }) {
  const variant = chapter.variant || "ribbon";
  const cardBackground =
    variant === "panel"
      ? `linear-gradient(135deg, ${theme.surfaceStrong} 0%, ${theme.panel} 100%)`
      : variant === "minimal"
        ? theme.backgroundAlt
        : variant === "lounge"
          ? `linear-gradient(180deg, ${theme.surfaceStrong} 0%, ${theme.surface} 100%)`
          : theme.surface;
  const cardClassName =
    variant === "minimal"
      ? "desktop-contact-card rounded-[2.8rem] border px-10 py-10 xl:px-12 xl:py-11"
      : variant === "lounge"
        ? "desktop-contact-card rounded-[2.8rem] border px-8 py-9 xl:px-11 xl:py-11"
        : "desktop-contact-card rounded-[2.4rem] border px-8 py-8 xl:px-10";
  const headingWidth = variant === "minimal" ? "max-w-[28rem]" : "max-w-[32rem]";
  const copyWidth = variant === "lounge" ? "max-w-[40rem]" : "max-w-[44rem]";

  return (
    <section className="hidden lg:block">
      <div className={`mx-auto max-w-[1600px] px-10 ${variant === "minimal" ? "pt-14" : "pt-20"}`}>
        <div className={cardClassName} style={{ borderColor: theme.border, background: cardBackground }}>
          <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
            <div>
              <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                {chapter.label}
              </div>
              <div className="mt-4 h-px w-24" style={{ backgroundColor: theme.accent }} />
            </div>
            <div>
              <div
                className={`${headingWidth} text-[2.2rem] leading-[0.96]`}
                style={{
                  fontFamily: theme.headingFont,
                  letterSpacing: theme.headingSpacing,
                  color: theme.text,
                  fontStyle: theme.headingStyle,
                  fontWeight: 400
                }}
              >
                {chapter.title}
              </div>
              <div className={`mt-4 ${copyWidth} text-[15px] leading-8`} style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
                {chapter.text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DesktopFloatingControls({ theme, isNavOpen, isSettingsOpen, onToggleNav, onOpenSettings }) {
  return (
    <div className="desktop-control-cluster hidden lg:flex">
      <button
        type="button"
        aria-label="Открыть навигацию"
        aria-expanded={isNavOpen}
        onClick={onToggleNav}
        className="desktop-floating-button rounded-full border px-5 py-3 text-[11px] uppercase"
        style={{ borderColor: theme.border, background: theme.header, color: theme.text, letterSpacing: theme.eyebrowSpacing }}
      >
        <span className="mr-3 inline-flex h-3 w-4 flex-col justify-between align-middle">
          <span className="block h-px w-full" style={{ backgroundColor: theme.text }} />
          <span className="block h-px w-full" style={{ backgroundColor: theme.text }} />
          <span className="block h-px w-full" style={{ backgroundColor: theme.text }} />
        </span>
        Меню
      </button>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isSettingsOpen}
        aria-controls="settings-drawer"
        onClick={onOpenSettings}
        className="desktop-floating-button rounded-full border px-5 py-3 text-[11px] uppercase"
        style={{ borderColor: theme.border, background: theme.surface, color: theme.text, letterSpacing: theme.eyebrowSpacing }}
      >
        Вид
      </button>
    </div>
  );
}

function HeroMetricsPanel({ theme }) {
  return (
    <div
      className="desktop-hero-panel rounded-[2.7rem] border p-6 lg:p-7 xl:p-8"
      style={{
        borderColor: theme.hero.panelBorder,
        background: theme.hero.panelSurface,
        backdropFilter: "blur(18px)"
      }}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
            Масштаб проекта
          </div>
          <div
            className="mt-3 max-w-[30rem] text-[2.7rem] leading-[0.92] md:max-w-[34rem] md:text-[4rem] xl:text-[5rem]"
            style={{
              fontFamily: theme.headingFont,
              letterSpacing: theme.headingSpacing,
              color: theme.text,
              fontStyle: theme.headingStyle,
              fontWeight: 400
            }}
          >
            Всё главное о проекте — в цифрах
          </div>
        </div>
        <div
          className="rounded-full border px-4 py-2 text-[11px] uppercase"
          style={{
            borderColor: theme.hero.panelBorder,
            color: theme.hero.panelPillText,
            background: theme.hero.panelPillBackground,
            letterSpacing: theme.eyebrowSpacing
          }}
        >
          premium asset
        </div>
      </div>
      <div className="mt-4 max-w-[32rem] text-sm leading-7" style={{ color: theme.hero.panelBodyText, letterSpacing: theme.bodySpacing }}>
        <span className="block">
          На территории 4,5 га реализована современная интерпретация традиционной гостиничной индустрии.
        </span>
        <span className="mt-4 block">
          Видовые резиденции премиум-класса в сочетании с пятизвёздочным сервисом создают уникальный формат проживания и открывают перспективы стабильной долгосрочной доходности.
        </span>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {METRICS.map((item, index) => (
          <div
            key={item.label}
            className={`desktop-metric-card rounded-[1.8rem] border p-5 ${index === METRICS.length - 1 ? "sm:col-span-2" : ""}`}
            style={{
              borderColor: theme.hero.panelBorder,
              background: theme.hero.panelCardSurface,
              backdropFilter: "blur(12px)"
            }}
          >
            <div
              className="text-[1.8rem] leading-[0.96]"
              style={{
                fontFamily: theme.headingFont,
                letterSpacing: theme.headingSpacing,
                color: theme.text,
                fontStyle: theme.headingStyle,
                fontWeight: 400
              }}
            >
              {item.value}
            </div>
            <div className="mt-2 max-w-[16rem] text-sm leading-6" style={{ color: theme.hero.panelMetaText, letterSpacing: theme.bodySpacing }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsSection({ theme }) {
  return (
    <section
      id="metrics"
      className="border-y py-16 lg:py-24"
      style={{
        borderColor: theme.border,
        background: `linear-gradient(180deg, ${theme.backgroundAlt} 0%, ${theme.background} 100%)`
      }}
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <HeroMetricsPanel theme={theme} />
      </div>
    </section>
  );
}

function DesktopQuoteStorySection({ item, index, scrollY, theme, format, preferStaticMedia }) {
  const quote = DESKTOP_QUOTE_MOMENTS[item.id];
  const isCompactViewport = useIsCompactViewport();

  return (
    <>
      <section
        id={isCompactViewport ? item.id : undefined}
        className="border-y py-14 lg:hidden"
        style={{
          background: `linear-gradient(180deg, ${theme.background} 0%, ${theme.backgroundAlt} 100%)`,
          borderColor: theme.border
        }}
      >
        <div className="mx-auto px-4">
          <div className="rounded-[2rem] border px-5 py-8 text-center" style={{ borderColor: theme.border, background: theme.panel }}>
            <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
              {item.label} · {quote.label}
            </div>
            <div
              className="mx-auto mt-6 max-w-[20rem] text-[2rem] leading-[0.94]"
              style={{
                fontFamily: theme.headingFont,
                letterSpacing: theme.headingSpacing,
                color: theme.text,
                fontStyle: theme.headingStyle,
                fontWeight: 400
              }}
            >
              {quote.quote}
            </div>
            <div className="mx-auto mt-5 max-w-[18.5rem] text-sm leading-7" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
              {quote.note}
            </div>
          </div>
        </div>
      </section>
      <section
        id={isCompactViewport ? undefined : item.id}
        className="hidden py-32 lg:block"
        style={{
          background: `linear-gradient(180deg, ${theme.background} 0%, ${theme.backgroundAlt} 100%)`,
          borderTop: `1px solid ${theme.border}`,
          borderBottom: `1px solid ${theme.border}`
        }}
      >
        <div className="mx-auto max-w-[1520px] px-10">
          <div className="rounded-[3rem] border px-12 py-16 text-center" style={{ borderColor: theme.border, background: theme.panel }}>
            <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
              {item.label} · {quote.label}
            </div>
            <div
              className="mx-auto mt-8 max-w-[62rem] text-[3.5rem] leading-[0.92] xl:text-[4.8rem]"
              style={{
                fontFamily: theme.headingFont,
                letterSpacing: theme.headingSpacing,
                color: theme.text,
                fontStyle: theme.headingStyle,
                fontWeight: 400
              }}
            >
              {quote.quote}
            </div>
            <div className="mx-auto mt-8 max-w-[36rem] text-[15px] leading-8" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
              {quote.note}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DesktopImmersiveStorySection({
  item,
  index,
  scrollY,
  theme,
  format,
  preferStaticMedia,
  imageSrc,
  videoSrc,
  posterSrc,
  mediaLabel,
  summary,
  panelAlignment = "left"
}) {
  const asset = imageSrc || getStoryAsset(item.id);
  const isCompactViewport = useIsCompactViewport();
  const isVideoMoment = Boolean(videoSrc);

  return (
    <>
      <section
        id={isCompactViewport ? item.id : undefined}
        className={isVideoMoment ? "border-y py-14 lg:hidden" : "py-0 lg:hidden"}
        style={{
          backgroundColor: theme.backgroundAlt,
          borderTop: isVideoMoment ? undefined : `1px solid ${theme.border}`,
          borderBottom: isVideoMoment ? undefined : `1px solid ${theme.border}`,
          borderColor: theme.border
        }}
      >
        {isVideoMoment ? (
          <div className="mx-auto px-4">
            <div className="rounded-[1.9rem] border p-5" style={{ borderColor: theme.border, background: theme.surface }}>
              <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                {item.label} · {mediaLabel}
              </div>
              <div
                className="mt-4 max-w-[18rem] text-[2.15rem] leading-[0.95]"
                style={{
                  fontFamily: theme.headingFont,
                  letterSpacing: theme.headingSpacing,
                  color: theme.text,
                  fontStyle: theme.headingStyle,
                  fontWeight: 400
                }}
              >
                {item.title}
              </div>
              <div className="mt-4 max-w-[17.5rem] text-sm leading-7" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
                {summary}
              </div>
            </div>
            <div className="mobile-media-layer relative mt-4 min-h-[25rem] overflow-hidden rounded-[1.8rem] border" style={{ borderColor: theme.border }}>
              <MediaFill
                imageSrc={asset}
                videoSrc={videoSrc}
                posterSrc={posterSrc || asset}
                gradient={item.gradient}
                transform="scale(1.02)"
                containerClassName="absolute inset-0"
                mediaClassName="h-full w-full object-cover object-center"
                preferStaticMedia={preferStaticMedia}
                priority
              />
            </div>
          </div>
        ) : (
          <div className="mobile-media-layer relative min-h-[82svh] overflow-hidden">
            <MediaFill
              imageSrc={asset}
              videoSrc={videoSrc}
              posterSrc={posterSrc || asset}
              gradient={item.gradient}
              transform="scale(1.02)"
              containerClassName="absolute inset-0"
              mediaClassName="h-full w-full object-cover object-center"
              preferStaticMedia={preferStaticMedia}
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.12) 38%, rgba(0,0,0,0.56) 100%)"
              }}
            />
            <div className="absolute inset-x-4 bottom-5">
              <div className="rounded-[1.7rem] border px-5 py-5 backdrop-blur-md" style={{ borderColor: theme.border, background: theme.panel }}>
                <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                  {item.label} · {mediaLabel}
                </div>
                <div
                  className="mt-4 max-w-[17rem] text-[2.1rem] leading-[0.94]"
                  style={{
                    fontFamily: theme.headingFont,
                    letterSpacing: theme.headingSpacing,
                    color: theme.text,
                    fontStyle: theme.headingStyle,
                    fontWeight: 400
                  }}
                >
                  {item.title}
                </div>
                <div className="mt-4 max-w-[17rem] text-sm leading-7" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
                  {summary}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      <section
        id={isCompactViewport ? undefined : item.id}
        className="hidden py-28 lg:block"
        style={{
          backgroundColor: theme.backgroundAlt,
          borderTop: `1px solid ${theme.border}`,
          borderBottom: `1px solid ${theme.border}`
        }}
      >
        <div className="mx-auto max-w-[1760px] px-10">
          <div className="desktop-media-layer relative min-h-[88vh] overflow-hidden rounded-[3.2rem] border" style={{ borderColor: theme.border }}>
            <MediaFill
              imageSrc={asset}
              videoSrc={videoSrc}
              posterSrc={posterSrc || asset}
              gradient={item.gradient}
              transform={`scale(${1.02 + (format.mediaEmphasis - 1) * 0.16})`}
              containerClassName="absolute inset-0"
              mediaClassName="h-full w-full object-cover object-center"
              preferStaticMedia={preferStaticMedia}
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.12) 42%, rgba(0,0,0,0.42) 100%)"
              }}
            />
            <div className={`absolute bottom-0 w-full p-10 xl:p-14 ${panelAlignment === "right" ? "flex justify-end" : ""}`}>
              <div className="max-w-[32rem] rounded-[2.1rem] border px-7 py-7 backdrop-blur-md" style={{ borderColor: theme.border, background: theme.panel }}>
                <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                  {item.label} · {mediaLabel}
                </div>
                <div
                  className="mt-4 text-[2.7rem] leading-[0.94]"
                  style={{
                    fontFamily: theme.headingFont,
                    letterSpacing: theme.headingSpacing,
                    color: theme.text,
                    fontStyle: theme.headingStyle,
                    fontWeight: 400
                  }}
                >
                  {item.title}
                </div>
                <div className="mt-5 text-[15px] leading-8" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
                  {summary}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DesktopEditorialGallerySection({ item, index, scrollY, theme, format, preferStaticMedia }) {
  const isCompactViewport = useIsCompactViewport();

  return (
    <>
      <section
        id={isCompactViewport ? item.id : undefined}
        className="border-y py-14 lg:hidden"
        style={{
          background: `linear-gradient(180deg, ${theme.backgroundAlt} 0%, ${theme.background} 100%)`,
          borderColor: theme.border
        }}
      >
        <div className="mx-auto px-4">
          <div className="rounded-[1.9rem] border p-5" style={{ borderColor: theme.border, background: theme.surface }}>
            <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
              {item.label} · premium editorial gallery
            </div>
            <div
              className="mt-4 max-w-[18rem] text-[2.15rem] leading-[0.95]"
              style={{
                fontFamily: theme.headingFont,
                letterSpacing: theme.headingSpacing,
                color: theme.text,
                fontStyle: theme.headingStyle,
                fontWeight: 400
              }}
            >
              Галерея должна быть кинематографичной и на телефоне.
            </div>
          <div className="mt-4 max-w-[18rem] text-sm leading-7" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
            Reel, крупный coastal-кадр и один спокойный photo-spread вместо обычной мелкой сетки.
          </div>
        </div>
          <div className="mt-4 rounded-[1.8rem] border p-4" style={{ borderColor: theme.border, background: theme.surface }}>
            <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
              branded reel
            </div>
            <div className="mt-3 max-w-[15rem] text-sm leading-7" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
              Движение, свет и shoreline-ритм без длинных пояснений.
            </div>
            <div className="mobile-media-layer relative mt-4 min-h-[24rem] overflow-hidden rounded-[1.4rem] border" style={{ borderColor: theme.border }}>
              <MediaFill
                imageSrc={HERO_MEDIA[0]}
                videoSrc={VIDEO_ASSETS.gallery}
                posterSrc={HERO_MEDIA[0]}
                gradient={item.gradient}
                containerClassName="absolute inset-0"
                mediaClassName="h-full w-full object-cover object-center"
                transform="scale(1.02)"
                preferStaticMedia={preferStaticMedia}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 px-4">
          {[
            {
              title: "Private shoreline mood",
              text: "Один сильный coastal-кадр вместо технической сетки.",
              image: GALLERY_ASSETS[0] || HERO_MEDIA[4]
            },
            {
              title: "Full-bleed photo",
              text: "Финальный фотокадр перед private dialogue.",
              image: GALLERY_ASSETS[1] || HERO_MEDIA[1]
            }
          ].map((block) => (
            <div key={block.title} className="mobile-media-layer relative min-h-[28rem] overflow-hidden rounded-[1.8rem] border" style={{ borderColor: theme.border }}>
              <MediaFill
                imageSrc={block.image}
                posterSrc={block.image}
                gradient={item.gradient}
                containerClassName="absolute inset-0"
                mediaClassName="h-full w-full object-cover object-center"
                transform="scale(1.02)"
                preferStaticMedia={preferStaticMedia}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.48))" }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-[11px] uppercase" style={{ color: "#fff", letterSpacing: theme.eyebrowSpacing }}>
                  {block.title}
                </div>
                <div className="mt-2 max-w-[14rem] text-sm leading-7" style={{ color: "rgba(255,255,255,0.8)", letterSpacing: theme.bodySpacing }}>
                  {block.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section
        id={isCompactViewport ? undefined : item.id}
        className="hidden py-28 lg:block"
        style={{
          background: `linear-gradient(180deg, ${theme.backgroundAlt} 0%, ${theme.background} 100%)`,
          borderTop: `1px solid ${theme.border}`,
          borderBottom: `1px solid ${theme.border}`
        }}
      >
        <div className="mx-auto max-w-[1720px] px-10">
          <div className="grid gap-10 lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
            <div>
              <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                {item.label} · premium editorial gallery
              </div>
              <div
                className="mt-5 max-w-[44rem] text-[3.1rem] leading-[0.94]"
                style={{
                  fontFamily: theme.headingFont,
                  letterSpacing: theme.headingSpacing,
                  color: theme.text,
                  fontStyle: theme.headingStyle,
                  fontWeight: 400
                }}
              >
                Галерея должна ощущаться как крупная editorial-серия, а не как обычная сетка.
              </div>
            </div>
            <div className="max-w-[30rem] lg:justify-self-end">
              <div className="text-[15px] leading-8" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
                Видео, лучший coastal-кадр и один тихий панорамный разворот работают как финальная медиа-презентация перед запросом стоимости.
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#apartment-01"
                  className="desktop-cta rounded-full px-5 py-3 text-sm font-semibold tracking-[0.05em]"
                  style={{ backgroundColor: theme.accent, color: theme.buttonText }}
                >
                  Смотреть лоты
                </a>
                <a
                  href="#final-contact"
                  className="desktop-cta rounded-full border px-5 py-3 text-sm font-semibold tracking-[0.05em]"
                  style={{ borderColor: theme.border, background: theme.surface, color: theme.text }}
                >
                  Запросить презентацию
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.22fr_0.78fr]">
            <div className="desktop-media-layer relative min-h-[42rem] overflow-hidden rounded-[3rem] border" style={{ borderColor: theme.border }}>
              <MediaFill
                imageSrc={HERO_MEDIA[0]}
                videoSrc={VIDEO_ASSETS.gallery}
                posterSrc={HERO_MEDIA[0]}
                gradient={item.gradient}
                containerClassName="absolute inset-0"
                mediaClassName="h-full w-full object-cover object-center"
                transform={`scale(${1.03 + (format.mediaEmphasis - 1) * 0.15})`}
                preferStaticMedia={preferStaticMedia}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.38))" }} />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="text-[11px] uppercase" style={{ color: "#fff", letterSpacing: theme.eyebrowSpacing }}>
                  branded reel
                </div>
                <div className="mt-3 max-w-[24rem] text-sm leading-7" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: theme.bodySpacing }}>
                  Движение, свет и shoreline-ритм без лишних пояснений.
                </div>
              </div>
            </div>
            <div className="grid gap-5">
              {[
                {
                  title: "Private shoreline mood",
                  text: "Один сильный coastal-кадр вместо технической сетки.",
                  image: GALLERY_ASSETS[0] || HERO_MEDIA[4]
                },
                {
                  title: "Архитектура и тишина",
                  text: "Фасад и вечерний свет как часть статуса продукта.",
                  image: HERO_MEDIA[5] || HERO_MEDIA[2]
                }
              ].map((block) => (
                <div key={block.title} className="desktop-media-layer relative min-h-[20rem] overflow-hidden rounded-[2.3rem] border" style={{ borderColor: theme.border }}>
                  <MediaFill
                    imageSrc={block.image}
                    posterSrc={block.image}
                    gradient={item.gradient}
                    containerClassName="absolute inset-0"
                    mediaClassName="h-full w-full object-cover object-center"
                    transform="scale(1.03)"
                    preferStaticMedia={preferStaticMedia}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.44))" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-[11px] uppercase" style={{ color: "#fff", letterSpacing: theme.eyebrowSpacing }}>
                      {block.title}
                    </div>
                    <div className="mt-2 max-w-[20rem] text-sm leading-7" style={{ color: "rgba(255,255,255,0.76)", letterSpacing: theme.bodySpacing }}>
                      {block.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="desktop-media-layer relative mt-5 min-h-[30rem] overflow-hidden rounded-[3rem] border" style={{ borderColor: theme.border }}>
            <MediaFill
              imageSrc={GALLERY_ASSETS[1] || HERO_MEDIA[1]}
              posterSrc={GALLERY_ASSETS[1] || HERO_MEDIA[1]}
              gradient={item.gradient}
              containerClassName="absolute inset-0"
              mediaClassName="h-full w-full object-cover object-center"
              transform="scale(1.03)"
              preferStaticMedia={preferStaticMedia}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.34))" }} />
            <div className="absolute bottom-0 left-0 p-8">
              <div className="text-[11px] uppercase" style={{ color: "#fff", letterSpacing: theme.eyebrowSpacing }}>
                full-bleed photo
              </div>
              <div className="mt-3 max-w-[24rem] text-sm leading-7" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: theme.bodySpacing }}>
                Финальный фотокадр перед переходом к стоимости и private dialogue.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ParallaxPanel({
  scrollY,
  speed,
  item,
  theme,
  format,
  height,
  asset,
  videoSrc,
  preferStaticMedia
}) {
  const motionTransform = `scale(${1 + (format.mediaEmphasis - 1) * 0.35})`;

  return (
    <div className={`desktop-story-panel desktop-media-layer relative overflow-hidden rounded-[2.3rem] border ${height}`} style={{ borderColor: theme.border }}>
      <MediaFill
        imageSrc={asset}
        videoSrc={videoSrc}
        posterSrc={asset}
        gradient={item.gradient}
        transform={motionTransform}
        containerClassName="absolute inset-0"
        mediaClassName="h-full w-full object-cover object-center"
        preferStaticMedia={preferStaticMedia}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 32%), linear-gradient(180deg, rgba(0,0,0,0.04), transparent 45%, rgba(0,0,0,0.16))"
        }}
      />
    </div>
  );
}

function StorySection({ item, index, scrollY, theme, format, preferStaticMedia }) {
  const reverse = index % 2 === 1;
  const storyColsClass = item.id === "private-resort" ? "lg:grid-cols-[0.82fr_1.18fr]" : format.storyCols;
  const mediaSpacingClass = item.id === "private-resort" ? "lg:ml-6 xl:ml-8" : "";
  const sectionBackground = index % 3 === 1 ? theme.backgroundAlt : theme.background;
  const height =
    format.id === "gallery"
      ? "min-h-[78vh]"
      : format.id === "catalog"
        ? "min-h-[54vh]"
        : format.sectionMediaHeight;
  const asset = getStoryAsset(item.id);

  return (
    <section
      id={item.id}
      className="py-16 lg:py-28"
      style={{
        backgroundColor: sectionBackground,
        borderTop: index % 3 === 1 ? `1px solid ${theme.border}` : "none",
        borderBottom: index % 3 === 1 ? `1px solid ${theme.border}` : "none"
      }}
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className={`grid items-start gap-10 ${storyColsClass} lg:gap-14 ${reverse ? "lg:grid-flow-col-dense" : ""}`}>
          <div className={`min-w-0 ${reverse ? "lg:order-2" : ""}`}>
            <StoryHeader item={item} theme={theme} format={format} />
            {format.id === "editorial" && (
              <div
                className="mt-8 max-w-xl rounded-[1.6rem] border p-5 text-sm leading-7"
                style={{ borderColor: theme.border, background: theme.surface, color: theme.muted }}
              >
                {theme.description}
              </div>
            )}
          </div>
          <div className={`min-w-0 ${reverse ? "lg:order-1" : ""} ${mediaSpacingClass}`}>
            <ParallaxPanel
              scrollY={scrollY}
              speed={0.05 + (index % 4) * 0.02}
              item={item}
              theme={theme}
              format={format}
              height={height}
              asset={asset}
              videoSrc={STORY_VIDEO_ASSETS[item.id]}
              preferStaticMedia={preferStaticMedia}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DesktopSpotlightStorySection({ item, index, scrollY, theme, format, preferStaticMedia }) {
  const spotlightMediaHeight = format.id === "gallery" ? "min-h-[84vh]" : "min-h-[78vh]";
  const asset = getStoryAsset(item.id);
  const isCompactViewport = useIsCompactViewport();

  return (
    <>
      <section
        id={isCompactViewport ? item.id : undefined}
        className="py-0 lg:hidden"
        style={{
          backgroundColor: theme.backgroundAlt,
          borderTop: `1px solid ${theme.border}`,
          borderBottom: `1px solid ${theme.border}`
        }}
      >
        <div className="mobile-media-layer relative min-h-[82svh] overflow-hidden">
          <MediaFill
            imageSrc={asset}
            posterSrc={asset}
            gradient={item.gradient}
            transform={`scale(${1.02 + (format.mediaEmphasis - 1) * 0.18})`}
            containerClassName="absolute inset-0"
            mediaClassName="h-full w-full object-cover object-center"
            preferStaticMedia={preferStaticMedia}
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.56))"
            }}
          />
          <div className="absolute inset-x-4 bottom-5">
            <div className="rounded-[1.7rem] border px-5 py-5 backdrop-blur-md" style={{ borderColor: theme.border, background: theme.panel }}>
              <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                {item.label} · coastline spotlight
              </div>
              <div
                className="mt-4 max-w-[16rem] text-[2.1rem] leading-[0.94]"
                style={{
                  fontFamily: theme.headingFont,
                  letterSpacing: theme.headingSpacing,
                  color: theme.text,
                  fontStyle: theme.headingStyle,
                  fontWeight: 400
                }}
              >
                {item.title}
              </div>
              <div className="mt-4 max-w-[16rem] text-sm leading-7" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
                {item.text}
              </div>
              <div className="mt-5 inline-flex rounded-full border px-4 py-2 text-[11px] uppercase" style={{ borderColor: theme.accent, background: theme.accentSoft, color: theme.accent, letterSpacing: "0.22em" }}>
                {item.accent}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id={isCompactViewport ? undefined : item.id}
        className="hidden py-28 lg:block"
        style={{
          backgroundColor: theme.backgroundAlt,
          borderTop: `1px solid ${theme.border}`,
          borderBottom: `1px solid ${theme.border}`
        }}
      >
        <div className="mx-auto max-w-[1720px] px-10">
          <div className="desktop-media-layer relative overflow-hidden rounded-[3rem] border" style={{ borderColor: theme.border }}>
            <MediaFill
              imageSrc={asset}
              posterSrc={asset}
              gradient={item.gradient}
              transform={`scale(${1.03 + (format.mediaEmphasis - 1) * 0.22})`}
              containerClassName="absolute inset-0"
              mediaClassName="h-full w-full object-cover object-center"
              preferStaticMedia={preferStaticMedia}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.18) 58%, rgba(0,0,0,0.36))"
              }}
            />
          </div>
          <div className="relative -mt-24 ml-10 max-w-[42rem] rounded-[2.3rem] border p-8 xl:ml-14 xl:p-10" style={{ borderColor: theme.border, background: theme.surfaceStrong, backdropFilter: "blur(18px)" }}>
            <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
              {item.label} · {item.eyebrow}
            </div>
            <div
              className="mt-4 text-[3rem] leading-[0.94]"
              style={{
                fontFamily: theme.headingFont,
                letterSpacing: theme.headingSpacing,
                color: theme.text,
                fontStyle: theme.headingStyle,
                fontWeight: 400
              }}
            >
              {item.title}
            </div>
            <div className="mt-5 max-w-[34rem] text-[16px] leading-8" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
              {item.text}
            </div>
            <div className="mt-6 inline-flex rounded-full border px-4 py-2 text-[11px] uppercase" style={{ borderColor: theme.accent, background: theme.accentSoft, color: theme.accent, letterSpacing: "0.22em" }}>
              {item.accent}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ApartmentSection({ item, index, scrollY, theme, format, preferStaticMedia }) {
  const offset = clamp(scrollY * (0.01 + index * 0.002), 0, 26);
  const media = APARTMENT_ASSETS[item.id] || {};
  const salesProfile = getApartmentSalesProfile(item);
  const specs = [
    { label: "Площадь", value: item.area },
    { label: "Этаж", value: item.floor },
    { label: "Вид", value: item.view },
    { label: "Терраса", value: item.terrace }
  ];

  const secondaryMediaCards = [
    { title: "Жилое пространство", text: "Свет, воздух и повседневный ритм интерьера.", image: media.interior },
    { title: "Терраса и горизонт", text: "Outdoor-сценарий, приватность и главный видовой аргумент.", image: media.terrace }
  ];

  return (
    <section
      id={item.id}
      className="py-16 lg:py-[5.5rem]"
      style={{
        backgroundColor: index % 2 === 0 ? theme.backgroundAlt : theme.background,
        borderTop: index % 2 === 0 ? `1px solid ${theme.border}` : "none",
        borderBottom: index % 2 === 0 ? `1px solid ${theme.border}` : "none"
      }}
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className={`grid items-start gap-8 ${format.apartmentCols} lg:gap-12`}>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
              <span>{item.number}</span>
              <span className="h-px w-16" style={{ backgroundColor: theme.accent }} />
              <span>{item.format}</span>
              <span className="rounded-full border px-3 py-1" style={{ borderColor: theme.accent, background: theme.accentSoft, color: theme.accent }}>
                {item.status}
              </span>
            </div>
            <h3
              className="apartment-heading mt-5 max-w-full text-[2.4rem] leading-[0.94] [overflow-wrap:anywhere] md:text-[3.5rem] xl:text-[4.2rem]"
              style={{
                fontFamily: theme.headingFont,
                letterSpacing: theme.headingSpacing,
                color: theme.text,
                fontStyle: theme.headingStyle,
                fontWeight: 400
              }}
            >
              {item.title}
            </h3>
            <div className="story-copy mt-7 max-w-full border-l pl-6 text-base leading-8 [overflow-wrap:anywhere]" style={{ borderColor: theme.accent, color: theme.muted, letterSpacing: theme.bodySpacing }}>
              {item.text}
            </div>
            <div className={`mt-7 grid gap-3 ${format.id === "catalog" ? "sm:grid-cols-2" : "grid-cols-1"}`}>
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="mobile-pill max-w-full rounded-full border px-4 py-2 text-[12px] uppercase [overflow-wrap:anywhere]"
                  style={{
                    borderColor: theme.accent,
                    background: theme.accentSoft,
                    color: theme.accent,
                    letterSpacing: "0.18em"
                  }}
                >
                  {spec.label}: {spec.value}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[1.9rem] border p-5 lg:p-6" style={{ borderColor: theme.border, background: theme.surface }}>
              <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr] xl:items-start">
                <div>
                  <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                    стоимость
                  </div>
                  <div
                    className="mt-3 text-[1.9rem] leading-[1]"
                    style={{
                      fontFamily: theme.headingFont,
                      letterSpacing: theme.headingSpacing,
                      color: theme.text,
                      fontStyle: theme.headingStyle,
                      fontWeight: 400
                    }}
                  >
                    Цена по запросу
                  </div>
                  <p className="mt-3 max-w-[19rem] text-sm leading-7" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
                    Персональная презентация, подбор сценария владения и private viewing по этому лоту — по индивидуальному запросу.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="desktop-sales-card rounded-[1.5rem] border p-4" style={{ borderColor: theme.border, background: theme.surfaceStrong }}>
                    <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                      лучший сценарий
                    </div>
                    <div className="mt-3 text-sm font-medium leading-6" style={{ color: theme.text }}>
                      {salesProfile.scenario}
                    </div>
                  </div>
                  <div className="desktop-sales-card rounded-[1.5rem] border p-4" style={{ borderColor: theme.border, background: theme.surfaceStrong }}>
                    <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                      ключевой аргумент
                    </div>
                    <div className="mt-3 text-sm leading-6" style={{ color: theme.muted }}>
                      {salesProfile.pitch}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="#final-contact"
                        className="desktop-cta rounded-full px-5 py-3 text-sm font-semibold tracking-[0.05em] transition hover:translate-y-[-1px]"
                        style={{
                          backgroundColor: theme.accent,
                          color: theme.buttonText,
                          boxShadow: `0 10px 30px ${theme.accentSoft}`
                        }}
                      >
                        Запросить этот апартамент
                      </a>
                      <a
                        href="#gallery"
                        className="desktop-cta rounded-full border px-5 py-3 text-sm font-semibold tracking-[0.05em] transition"
                        style={{ borderColor: theme.border, background: theme.surface, color: theme.text }}
                      >
                        Смотреть медиаматериалы
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="desktop-apartment-shell min-w-0 overflow-hidden rounded-[2.2rem] border shadow-[0_20px_80px_rgba(0,0,0,0.24)]"
            style={{
              borderColor: theme.border,
              background: theme.surfaceStrong,
              transform: `translate3d(0, ${offset}px, 0)`
            }}
          >
            <div className="hidden gap-4 p-5 lg:grid lg:grid-cols-[1.24fr_0.76fr] lg:items-stretch">
              <div className="desktop-media-layer relative min-h-[34rem] overflow-hidden rounded-[2rem] border" style={{ borderColor: theme.border }}>
                <MediaFill
                  imageSrc={media.main}
                  posterSrc={media.main}
                  gradient={item.gradient}
                  transform="scale(1.03)"
                  priority={index < 2}
                  preferStaticMedia={preferStaticMedia}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.36))" }} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-flex rounded-full border px-4 py-2 text-[11px] uppercase" style={{ borderColor: theme.accent, background: theme.accentSoft, color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                    {salesProfile.scenario}
                  </div>
                  <div
                    className="mt-4 max-w-[22rem] text-[1.9rem] leading-[0.98]"
                    style={{
                      fontFamily: theme.headingFont,
                      letterSpacing: theme.headingSpacing,
                      color: "#fff",
                      fontStyle: theme.headingStyle,
                      fontWeight: 400
                    }}
                  >
                    Главный видовой ракурс этого лота
                  </div>
                  <div className="mt-3 max-w-[24rem] text-sm leading-7" style={{ color: "rgba(255,255,255,0.78)", letterSpacing: theme.bodySpacing }}>
                    {salesProfile.pitch}
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                {secondaryMediaCards.map((block) => (
                  <div key={block.title} className="desktop-media-layer relative min-h-[16rem] overflow-hidden rounded-[1.8rem] border" style={{ borderColor: theme.border }}>
                    <MediaFill
                      imageSrc={block.image}
                      posterSrc={block.image}
                      gradient={item.gradient}
                      transform="scale(1.03)"
                      preferStaticMedia={preferStaticMedia}
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.42))" }} />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="text-[11px] uppercase" style={{ color: "#fff", letterSpacing: theme.eyebrowSpacing }}>
                        {block.title}
                      </div>
                      <div className="mt-2 max-w-[16rem] text-sm leading-7" style={{ color: "rgba(255,255,255,0.76)", letterSpacing: theme.bodySpacing }}>
                        {block.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 p-6 lg:hidden">
              {[
                { title: "Главный вид", text: "Ключевой продающий ракурс этого лота.", image: media.main },
                ...secondaryMediaCards
              ].map((block, blockIndex) => (
                <div key={`${block.title}-${blockIndex}`} className="rounded-[1.4rem] border p-4" style={{ borderColor: theme.border, background: theme.surface }}>
                  <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-[1rem] border" style={{ borderColor: theme.border }}>
                    <MediaFill
                      imageSrc={block.image}
                      posterSrc={block.image}
                      gradient={item.gradient}
                      transform="scale(1.03)"
                      preferStaticMedia={preferStaticMedia}
                    />
                  </div>
                  <div className="mt-3 text-sm font-medium leading-6" style={{ color: theme.text }}>
                    {block.title}
                  </div>
                  <div className="mt-2 text-sm leading-6" style={{ color: theme.muted }}>
                    {block.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteConcierge({ theme, disabled, onAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(() =>
    CHATBOT_INITIAL_MESSAGES.map((item) => createChatMessage("assistant", item.text, item.actions))
  );
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen]);

  const sendPrompt = useCallback((prompt) => {
    const normalizedPrompt = prompt.trim();

    if (!normalizedPrompt) {
      return;
    }

    const userMessage = createChatMessage("user", normalizedPrompt);
    const assistantMessage = buildChatbotReply(normalizedPrompt);

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInputValue("");
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    sendPrompt(inputValue);
  }, [inputValue, sendPrompt]);

  const handleAction = useCallback((action) => {
    if (action.kind === "prompt") {
      sendPrompt(action.prompt);
      return;
    }

    if (action.kind === "scroll" && action.target) {
      setIsOpen(false);
      onAction(action.target);
    }
  }, [onAction, sendPrompt]);

  if (!isOpen) {
    return (
      <button
        type="button"
        aria-label="Открыть онлайн-консьержа Greenmont"
        onClick={() => setIsOpen(true)}
        className="desktop-floating-button fixed bottom-4 right-4 z-[68] flex items-center gap-3 rounded-full border px-4 py-3 sm:bottom-6 sm:right-6"
        style={{
          borderColor: theme.border,
          background: theme.header,
          color: theme.text,
          boxShadow: "0 18px 54px rgba(0,0,0,0.24)"
        }}
      >
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
          style={{ backgroundColor: theme.accent, color: theme.buttonText }}
        >
          GM
        </span>
        <span className="text-left">
          <span className="block text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
            Онлайн-консьерж
          </span>
          <span className="block text-sm font-medium" style={{ color: theme.text }}>
            Задать вопрос по проекту
          </span>
        </span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[68] flex max-h-[72vh] flex-col overflow-hidden rounded-[2rem] border shadow-[0_24px_90px_rgba(0,0,0,0.28)] sm:bottom-6 sm:left-auto sm:right-6 sm:w-[25rem]"
      style={{
        borderColor: theme.border,
        background: `linear-gradient(180deg, ${theme.backgroundAlt} 0%, ${theme.background} 100%)`,
        color: theme.text
      }}
    >
      <div className="flex items-start justify-between gap-4 border-b px-5 py-4" style={{ borderColor: theme.border, background: theme.header, backdropFilter: "blur(18px)" }}>
        <div>
          <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
            Greenmont concierge
          </div>
          <div className="mt-2 text-[1.2rem] leading-[1.05]" style={{ fontFamily: theme.headingFont, letterSpacing: theme.headingSpacing, fontStyle: theme.headingStyle }}>
            Бот проекта для первых вопросов клиента
          </div>
        </div>
        <button
          type="button"
          aria-label="Закрыть чат"
          onClick={() => setIsOpen(false)}
          className="rounded-full border px-3 py-2 text-[11px] uppercase"
          style={{ borderColor: theme.border, background: theme.surface, color: theme.muted, letterSpacing: theme.eyebrowSpacing }}
        >
          Закрыть
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div key={message.id} className={message.role === "assistant" ? "pr-8" : "pl-8"}>
            <div
              className={`rounded-[1.4rem] border px-4 py-3 text-sm leading-7 ${message.role === "assistant" ? "" : "ml-auto"}`}
              style={{
                borderColor: message.role === "assistant" ? theme.border : theme.accent,
                background: message.role === "assistant" ? theme.surface : theme.accent,
                color: message.role === "assistant" ? theme.muted : theme.buttonText
              }}
            >
              {message.text}
            </div>
            {message.actions?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.actions.map((action) => (
                  <button
                    key={`${message.id}-${action.id}`}
                    type="button"
                    onClick={() => handleAction(action)}
                    className="rounded-full border px-3 py-2 text-[11px] uppercase transition"
                    style={{
                      borderColor: theme.border,
                      background: theme.surfaceStrong,
                      color: theme.text,
                      letterSpacing: "0.18em"
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t px-4 py-4" style={{ borderColor: theme.border, background: theme.surface }}>
        <div className="mb-3 flex flex-wrap gap-2">
          {CHATBOT_QUICK_ACTIONS.slice(0, 3).map((action) => (
            <button
              key={`quick-${action.id}`}
              type="button"
              onClick={() => handleAction(action)}
              className="rounded-full border px-3 py-2 text-[11px] uppercase"
              style={{ borderColor: theme.border, background: theme.backgroundAlt, color: theme.muted, letterSpacing: "0.18em" }}
            >
              {action.label}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-3">
          <textarea
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            rows={2}
            className="min-h-[76px] flex-1 rounded-[1.2rem] border px-4 py-3 outline-none transition"
            style={{ borderColor: theme.border, background: theme.backgroundAlt, color: theme.text }}
            placeholder="Спросите про стоимость, апартаменты, сервис или показ"
          />
          <button
            type="submit"
            className="desktop-cta rounded-full px-5 py-3 text-sm font-semibold"
            style={{ backgroundColor: theme.accent, color: theme.buttonText }}
          >
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
}

export default function GreenmontLuxurySite() {
  const rawScrollY = useScrollY();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isPhoneViewport = useIsPhoneViewport();
  const scrollY = prefersReducedMotion ? 0 : rawScrollY;
  const [themeId, setThemeId] = useState(THEMES[0].id);
  const [formatId, setFormatId] = useState(VISUAL_FORMATS[0].id);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const theme = useMemo(() => THEMES.find((item) => item.id === themeId) || THEMES[0], [themeId]);
  const format = useMemo(() => VISUAL_FORMATS.find((item) => item.id === formatId) || VISUAL_FORMATS[0], [formatId]);
  const heroAsset = useMemo(() => getHeroAsset(format.id), [format.id]);
  const heroPhoneAsset = HERO_FEATURE_ASSETS.mobile || heroAsset;
  const navItems = useMemo(
    () => [
      { id: "hero", label: "Главная" },
      { id: "concept", label: "О проекте" },
      { id: "promenade", label: "Ритм у моря" },
      { id: "wellness", label: "Сервис и wellness" },
      { id: "technology-intro", label: "Технологии" },
      { id: "location", label: "Локация" },
      { id: "apartment-01", label: "8 апартаментов" },
      { id: "final-contact", label: "Контакт" }
    ],
    []
  );
  const heroMediaTransform =
    prefersReducedMotion || isPhoneViewport
      ? undefined
      : `translate3d(0, ${scrollY * 0.14 * format.parallaxBoost}px, 0) scale(${1.04 * format.mediaEmphasis})`;
  const heroMediaContainerClassName = "absolute inset-0";
  const heroMediaClassName = isPhoneViewport
    ? "h-full w-full object-cover object-center"
    : "h-full w-full object-cover object-center";
  const heroMediaImageSrc = isPhoneViewport ? heroPhoneAsset : heroAsset;
  const heroMediaPosterSrc = isPhoneViewport ? heroPhoneAsset : heroAsset;
  const heroMediaVideoSrc = isPhoneViewport ? undefined : VIDEO_ASSETS.hero;
  const isChatDisabled = isNavOpen || isSettingsOpen;
  const scrollToSection = useCallback((sectionId) => {
    if (typeof document === "undefined") {
      return;
    }

    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    setIsNavOpen(false);
    setIsSettingsOpen(false);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (!isSettingsOpen && !isNavOpen) {
      return undefined;
    }

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isNavOpen, isSettingsOpen]);

  useEffect(() => {
    if (!isSettingsOpen && !isNavOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSettingsOpen(false);
        setIsNavOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isNavOpen, isSettingsOpen]);

  return (
    <div
      className="min-h-screen overflow-x-clip selection:bg-[#c6a66a] selection:text-[#111]"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily: theme.bodyFont,
        fontFeatureSettings: "\"ss01\" 1"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&family=Prata&family=Playfair+Display:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Marcellus&family=Tenor+Sans&display=swap');
        html { scroll-behavior: smooth; }
        @media (min-width: 1024px) {
          .desktop-text-measure {
            max-width: 38rem !important;
          }
          .desktop-heading-measure {
            max-width: 40rem !important;
            text-wrap: balance;
          }
          .desktop-copy-measure {
            max-width: 31rem !important;
          }
          .desktop-story-copy-measure {
            max-width: 33rem !important;
          }
          .desktop-hero-panel,
          .desktop-metric-card,
          .desktop-sales-card,
          .desktop-contact-card,
          .desktop-story-panel,
          .desktop-cta,
          .desktop-floating-button {
            transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms ease, border-color 320ms ease, background-color 320ms ease;
          }
          .desktop-control-cluster {
            position: fixed;
            top: 1.75rem;
            right: 2.5rem;
            z-index: 52;
            gap: 0.75rem;
          }
          .desktop-floating-button {
            backdrop-filter: blur(18px);
            box-shadow: 0 14px 44px rgba(0,0,0,0.16);
          }
          .desktop-floating-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 18px 56px rgba(0,0,0,0.20);
          }
          .desktop-hero-panel:hover,
          .desktop-contact-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 28px 80px rgba(0,0,0,0.22);
          }
          .desktop-metric-card:hover,
          .desktop-sales-card:hover,
          .desktop-story-panel:hover {
            transform: translateY(-8px);
            box-shadow: 0 24px 80px rgba(0,0,0,0.24);
          }
          .desktop-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 18px 44px rgba(0,0,0,0.20);
          }
          .desktop-media-layer img,
          .desktop-media-layer video {
            transition: filter 500ms ease;
          }
          .desktop-story-panel:hover img,
          .desktop-story-panel:hover video {
            filter: saturate(1.06) contrast(1.02);
          }
        }
        @media (max-width: 430px) {
          .story-heading {
            font-size: 2.2rem !important;
            line-height: 0.96 !important;
          }
          .apartment-heading {
            font-size: 2rem !important;
            line-height: 0.98 !important;
          }
          .story-copy {
            font-size: 0.95rem !important;
            line-height: 1.8 !important;
          }
          .story-eyebrow {
            gap: 0.65rem !important;
          }
          .mobile-pill {
            padding: 0.55rem 0.9rem !important;
            font-size: 0.7rem !important;
            line-height: 1.45 !important;
            letter-spacing: 0.12em !important;
          }
          .hero-chip {
            max-width: calc(100vw - 3rem);
            padding: 0.55rem 0.85rem !important;
            font-size: 0.625rem !important;
            line-height: 1.45 !important;
            letter-spacing: 0.16em !important;
          }
          .hero-eyebrow {
            margin-bottom: 1.25rem !important;
            gap: 0.75rem !important;
            letter-spacing: 0.22em !important;
          }
          .hero-heading {
            font-size: 2.55rem !important;
            line-height: 0.9 !important;
          }
          .hero-copy {
            margin-top: 1.5rem !important;
            padding-left: 1rem !important;
            font-size: 0.95rem !important;
            line-height: 1.75 !important;
          }
          .hero-cta-row {
            margin-top: 1.75rem !important;
            gap: 0.75rem !important;
          }
          .hero-cta {
            padding: 0.8rem 1rem !important;
            font-size: 0.82rem !important;
          }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 [background-image:linear-gradient(rgba(255,255,255,0.65)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.65)_1px,transparent_1px)] [background-size:120px_120px]"
        style={{ opacity: theme.id.includes("ivory") || theme.id.includes("pearl") || theme.id.includes("sand") ? 0.025 : 0.04 }}
      />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(circle at top, ${theme.accentSoft}, transparent 22%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.05), transparent 18%)`
        }}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        format={format}
        themeId={themeId}
        formatId={formatId}
        onThemeChange={setThemeId}
        onFormatChange={setFormatId}
      />
      <HeaderNavMenu
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        navItems={navItems}
        theme={theme}
      />
      <DesktopFloatingControls
        theme={theme}
        isNavOpen={isNavOpen}
        isSettingsOpen={isSettingsOpen}
        onToggleNav={() => {
          setIsSettingsOpen(false);
          setIsNavOpen((current) => !current);
        }}
        onOpenSettings={() => {
          setIsNavOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      <button
        type="button"
        aria-label="Открыть меню"
        aria-expanded={isNavOpen}
        onClick={() => {
          setIsSettingsOpen(false);
          setIsNavOpen((current) => !current);
        }}
        className="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border transition sm:right-6 sm:top-6 lg:hidden"
        style={{
          borderColor: theme.border,
          background: theme.header,
          color: theme.text,
          backdropFilter: "blur(18px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)"
        }}
      >
        <span className="flex h-4 w-4 flex-col justify-between">
          <span className="block h-px w-full" style={{ backgroundColor: theme.text }} />
          <span className="block h-px w-full" style={{ backgroundColor: theme.text }} />
          <span className="block h-px w-full" style={{ backgroundColor: theme.text }} />
        </span>
      </button>

      <main>
        <section id="hero" className="relative overflow-hidden border-b" style={{ borderColor: theme.border, backgroundColor: theme.background }}>
          <MediaFill
            imageSrc={heroMediaImageSrc}
            videoSrc={heroMediaVideoSrc}
            posterSrc={heroMediaPosterSrc}
            gradient={STORY_SECTIONS[0].gradient}
            transform={heroMediaTransform}
            containerClassName={heroMediaContainerClassName}
            mediaClassName={heroMediaClassName}
            priority
            preferStaticMedia={prefersReducedMotion}
          />
          <div className="absolute inset-0" style={{ background: theme.hero.globalScrim }} />
          <div className="absolute inset-0 hidden lg:block" style={{ background: theme.hero.desktopScrim }} />
          <div className="absolute inset-0 lg:hidden" style={{ background: theme.hero.mobileScrim }} />

          <div className={`relative z-10 mx-auto flex ${format.heroMinHeight} max-w-[1600px] flex-col justify-between px-6 pb-10 pt-24 lg:px-10 lg:pb-16 lg:pt-40 xl:pt-44`}>
            <div className="flex items-start gap-6">
              <div
                className="hero-chip rounded-full border px-4 py-2 text-[11px] uppercase backdrop-blur-md"
                style={{
                  borderColor: theme.hero.chipBorder,
                  background: theme.hero.chipBackground,
                  color: theme.hero.chipText,
                  boxShadow: `0 10px 28px ${theme.hero.textBackdropGlow}`,
                  letterSpacing: theme.eyebrowSpacing
                }}
              >
                Сочи · private resort · 8 апартаментов в продаже
              </div>
            </div>

            <div className="pb-6 pt-16 lg:pb-3 lg:pt-32 xl:pt-36">
              <div>
                <div className="relative isolate max-w-[46rem]">
                  <div
                    className="pointer-events-none absolute -inset-x-4 -inset-y-5 rounded-[2rem] sm:-inset-x-6 sm:-inset-y-7 lg:-inset-x-8 lg:-inset-y-8"
                    style={{
                      background: theme.hero.textBackdrop,
                      border: `1px solid ${theme.hero.textBackdropBorder}`,
                      boxShadow: `0 22px 72px ${theme.hero.textBackdropGlow}`,
                      backdropFilter: "blur(20px)"
                    }}
                  />
                  <div className="relative z-10">
                    <div className="hero-eyebrow mb-8 flex items-center gap-4 text-[11px] uppercase" style={{ color: theme.hero.eyebrowText, letterSpacing: "0.35em" }}>
                      <span>премиальная недвижимость у моря</span>
                      <span className="h-px w-20" style={{ backgroundColor: theme.accent }} />
                    </div>
                    <h1
                      className={`hero-heading max-w-5xl lg:max-w-[40rem] ${format.id === "catalog" ? "text-[2.9rem] md:text-[4.8rem] xl:text-[6rem]" : "text-[3.15rem] md:text-[5.4rem] xl:text-[6.4rem]"} leading-[0.88]`}
                      style={{
                        fontFamily: theme.headingFont,
                        letterSpacing: theme.headingSpacing,
                        color: theme.text,
                        fontStyle: theme.headingStyle,
                        fontWeight: 400,
                        textShadow: theme.hero.headingShadow
                      }}
                    >
                      Премиальные аппартаменты
                      <br />
                      <span style={{ color: theme.accent }}>У моря</span>
                      <br />
                      В Сочи
                    </h1>
                    <div
                      className={`hero-copy desktop-copy-measure mt-8 ${format.maxTextWidth} border-l pl-6 text-[15px] font-medium leading-8 md:text-[18px]`}
                      style={{
                        borderColor: theme.accent,
                        color: theme.hero.copyText,
                        letterSpacing: theme.bodySpacing
                      }}
                    >
                      <span className="block">
                        Полная приватность, всего 8 эксклюзивных апартаментов, премиальная инфраструктура и архитектура с безупречным стилем.
                      </span>
                      <span className="mt-4 block">
                        Это не просто недвижимость, а редкая возможность инвестировать в элитный проект на Черноморском побережье — для отдыха, статуса и удовольствия от жизни.
                      </span>
                    </div>
                    <div className="hero-cta-row mt-10 flex flex-wrap gap-4">
                      <a
                        href="#apartment-01"
                        className="desktop-cta hero-cta rounded-full px-7 py-3.5 text-sm font-semibold tracking-[0.05em] transition hover:translate-y-[-1px]"
                        style={{
                          backgroundColor: theme.accent,
                          color: theme.buttonText,
                          boxShadow: `0 10px 40px ${theme.accentSoft}`
                        }}
                      >
                        Смотреть 8 апартаментов
                      </a>
                      <a
                        href="#final-contact"
                        className="desktop-cta hero-cta rounded-full border px-7 py-3.5 text-sm font-semibold tracking-[0.05em] transition"
                        style={{
                          borderColor: theme.hero.secondaryCtaBorder,
                          background: theme.hero.secondaryCtaBackground,
                          color: theme.hero.secondaryCtaText,
                          backdropFilter: "blur(14px)"
                        }}
                      >
                        Запросить персональную презентацию
                      </a>
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        aria-expanded={isSettingsOpen}
                        aria-controls="settings-drawer"
                        onClick={() => {
                          setIsNavOpen(false);
                          setIsSettingsOpen(true);
                        }}
                        className="desktop-cta hero-cta rounded-full border px-7 py-3.5 text-sm font-semibold tracking-[0.05em] transition lg:hidden"
                        style={{
                          borderColor: theme.hero.secondaryCtaBorder,
                          background: theme.hero.secondaryCtaBackground,
                          color: theme.hero.secondaryCtaText,
                          backdropFilter: "blur(14px)"
                        }}
                      >
                        Настроить вид
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {STORY_SECTIONS.slice(1).map((item, index) => (
          <Fragment key={item.id}>
            {DESKTOP_CHAPTER_BREAKS[item.id] ? <DesktopChapterBreak chapter={DESKTOP_CHAPTER_BREAKS[item.id]} theme={theme} /> : null}
            {item.id === "metrics" ? (
              <MetricsSection theme={theme} />
            ) : item.id === "service" ? (
              <DesktopQuoteStorySection
                item={item}
                index={index}
                scrollY={scrollY}
                theme={theme}
                format={format}
                preferStaticMedia={prefersReducedMotion}
              />
            ) : item.id === "promenade" ? (
              <DesktopImmersiveStorySection
                item={item}
                index={index}
                scrollY={scrollY}
                theme={theme}
                format={format}
                preferStaticMedia={prefersReducedMotion}
                videoSrc={VIDEO_ASSETS.flow}
                posterSrc={getStoryAsset(item.id)}
                mediaLabel="full-screen video"
                summary="Комплекс находится в спокойной курортной части Сочи, на улице Ленина, всего в 450 метрах от Черного моря. Аллеи и панорамные мосты формируют живописный маршрут, гармонично встроенный в природный ландшафт и удобный для прогулок резидентов."
              />
            ) : item.id === "beach" ? (
              <DesktopSpotlightStorySection
                item={item}
                index={index}
                scrollY={scrollY}
                theme={theme}
                format={format}
                preferStaticMedia={prefersReducedMotion}
              />
            ) : item.id === "location" ? (
              <DesktopImmersiveStorySection
                item={item}
                index={index}
                scrollY={scrollY}
                theme={theme}
                format={format}
                preferStaticMedia={prefersReducedMotion}
                imageSrc={HERO_MEDIA[4] || getStoryAsset(item.id)}
                mediaLabel="ПРЕСТИЖНАЯ ЛОКАЦИЯ"
                summary="Тихая курортная часть Сочи, близость к морю и живописное природное окружение делают эту локацию особенно привлекательной для жизни и отдыха. При этом рядом находятся главные транспортные узлы и ключевые точки города, что позволяет сохранять привычный ритм без компромиссов в комфорте."
                panelAlignment="right"
              />
            ) : (
              <StorySection
                item={item}
                index={index}
                scrollY={scrollY}
                theme={theme}
                format={format}
                preferStaticMedia={prefersReducedMotion}
              />
            )}
          </Fragment>
        ))}

        {APARTMENTS.map((item, index) => (
          <ApartmentSection
            key={item.id}
            item={item}
            index={index}
            scrollY={scrollY}
            theme={theme}
            format={format}
            preferStaticMedia={prefersReducedMotion}
          />
        ))}

        {FINAL_SECTIONS.map((item, index) => (
          item.id === "gallery" ? (
            <DesktopEditorialGallerySection
              key={item.id}
              item={item}
              index={index + STORY_SECTIONS.length}
              scrollY={scrollY}
              theme={theme}
              format={format}
              preferStaticMedia={prefersReducedMotion}
            />
          ) : (
            <StorySection
              key={item.id}
              item={item}
              index={index + STORY_SECTIONS.length}
              scrollY={scrollY}
              theme={theme}
              format={format}
              preferStaticMedia={prefersReducedMotion}
            />
          )
        ))}

        <DesktopChapterBreak chapter={DESKTOP_CHAPTER_BREAKS["final-contact"]} theme={theme} />
        <section id="final-contact" className="border-t py-20 lg:py-28" style={{ borderColor: theme.border, background: `linear-gradient(180deg, ${theme.backgroundAlt} 0%, ${theme.background} 100%)` }}>
          <div className="mx-auto grid max-w-[1600px] gap-10 px-6 lg:grid-cols-[0.96fr_1.04fr] lg:px-10">
            <div>
              <StoryHeader
                item={{
                  label: "33",
                  eyebrow: "Персональный запрос",
                  title: "Запросите персональный подбор по 8 апартаментам и получите презентацию проекта",
                  text: "Финальный блок собирает в одно действие все, что пользователь увидел выше: локацию, сервис, SPA, маршруты, технологии, доверие к команде и подбор конкретного апартамента под отдых, жизнь или инвестиционный сценарий.",
                  accent: "private request"
                }}
                theme={theme}
                format={format}
              />
              <div className="mt-8 grid gap-4 xl:grid-cols-3">
                {[
                  {
                    title: "Private viewing",
                    text: "Персональный сценарий показа по тем лотам, которые соответствуют вашему типу владения."
                  },
                  {
                    title: "Презентация проекта",
                    text: "Подбор материалов, аргументов и медиаблоков под инвестиционный или lifestyle-запрос."
                  },
                  {
                    title: "Следующий шаг",
                    text: "Ответ менеджера, сценарий показа и следующий этап диалога фиксируются как private sales process."
                  }
                ].map((card) => (
                  <div key={card.title} className="desktop-contact-card rounded-[1.7rem] border p-5 text-sm leading-7" style={{ borderColor: theme.border, background: theme.surface, color: theme.muted }}>
                    <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                      {card.title}
                    </div>
                    <div className="mt-3 text-sm leading-7" style={{ color: theme.muted }}>
                      {card.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="desktop-contact-card rounded-[2.2rem] border p-6 shadow-[0_20px_80px_rgba(0,0,0,0.22)] md:p-8 lg:p-9" style={{ borderColor: theme.border, background: theme.surfaceStrong }}>
              <div className="mb-6 border-b pb-5" style={{ borderColor: theme.border }}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                    персональный запрос
                  </div>
                  <div className="rounded-full border px-4 py-2 text-[11px] uppercase" style={{ borderColor: theme.border, background: theme.surface, color: theme.subtle, letterSpacing: theme.eyebrowSpacing }}>
                    ответ в течение рабочего дня
                  </div>
                </div>
                <div className="mt-3 text-[2rem] leading-[1]" style={{ fontFamily: theme.headingFont, letterSpacing: theme.headingSpacing, color: theme.text, fontStyle: theme.headingStyle, fontWeight: 400 }}>
                  Оставьте заявку на подбор апартамента
                </div>
                <div className="mt-4 max-w-[30rem] text-sm leading-7" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
                  Вместо обычной формы здесь должен ощущаться private sales lounge: короткий запрос, персональный ответ и следующий шаг по конкретному лоту.
                </div>
              </div>
              <div className="mb-5 grid gap-3 md:grid-cols-3">
                {[
                  { label: "Формат", value: "private viewing" },
                  { label: "Материалы", value: "презентация и медиапакет" },
                  { label: "Фокус", value: "8 лотов в продаже" }
                ].map((item) => (
                  <div key={item.label} className="desktop-sales-card rounded-[1.4rem] border p-4" style={{ borderColor: theme.border, background: theme.surface }}>
                    <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                      {item.label}
                    </div>
                    <div className="mt-2 text-sm leading-6" style={{ color: theme.text }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  aria-label="Ваше имя"
                  autoComplete="name"
                  className="rounded-2xl border px-4 py-3.5 outline-none transition"
                  style={{ borderColor: theme.border, background: theme.surface, color: theme.text }}
                  placeholder="Ваше имя"
                  type="text"
                />
                <input
                  aria-label="Телефон"
                  autoComplete="tel"
                  className="rounded-2xl border px-4 py-3.5 outline-none transition"
                  style={{ borderColor: theme.border, background: theme.surface, color: theme.text }}
                  placeholder="Телефон"
                  type="tel"
                />
              </div>
              <textarea
                aria-label="Комментарий к запросу"
                className="mt-4 min-h-[130px] w-full rounded-2xl border px-4 py-3.5 outline-none transition"
                style={{ borderColor: theme.border, background: theme.surface, color: theme.text }}
                placeholder="Укажите интересующий апартамент или сценарий владения"
              />
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  className="desktop-cta rounded-full px-6 py-3 text-sm font-semibold tracking-[0.05em]"
                  style={{ backgroundColor: theme.accent, color: theme.buttonText }}
                >
                  Отправить заявку
                </button>
                <div className="text-xs leading-6" style={{ color: theme.subtle }}>
                  Персональный подбор, презентация, private viewing и следующий шаг по конкретному лоту.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteConcierge theme={theme} disabled={isChatDisabled} onAction={scrollToSection} />
    </div>
  );
}

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
  makeSection("metrics", "stats", "02", "Ключевые масштабы проекта", "Большое благоустройство, закрытая территория и высокий процент видовых резиденций", "В основе истории — масштаб: 26 000 м² благоустройства, 1,3 га парящих променадов, 4,5 га закрытой территории, 2 175 м² собственного пляжа и высокий процент видовых резиденций.", "26 000 м² благоустройства", "Масштаб проекта раскрывается через ландшафт, воздух и протяженные маршруты к морю", "linear-gradient(135deg, #536975 0%, #c0a16e 52%, #151617 100%)"),
  makeSection("concept", "story", "03", "О проекте", "Флагманский курортный продукт с акцентом на приватность премиум-класса", "Референс подает проект как инвестиционный гостиничный комплекс 5* у моря, где единый архитектурный код сочетается с курортной частью Сочи и форматами для отдыха, инвестиций и долгого владения.", "private resort с гостиничным управлением", "Архитектурный код, приватность и курортная часть Сочи", "linear-gradient(135deg, #556a75 0%, #b79765 52%, #161718 100%)"),
  makeSection("private-resort", "story", "04", "Формат проекта", "Private resort с сервисом и профессиональным управлением", "Это не просто набор апартаментов, а формат private resort с гостиничным управлением и инфраструктурой уровня ведущих мировых курортов.", "5* гостиничный комплекс с резиденциями", "Жизнь у моря как сервисный и архитектурный сценарий", "linear-gradient(135deg, #425964 0%, #b89663 54%, #161718 100%)"),
  makeSection("promenade", "feature", "05", "Панорамные маршруты", "Парящий променад с прямым визуальным контактом с водой", "Маршрут к морю в проекте подается как один из главных эмоциональных образов: путь, который ощущается как легкое движение к воде и свету.", "1,3 га парящих променадов", "Путь к воде как эмоциональная ось всей истории", "linear-gradient(135deg, #45606b 0%, #c0a57b 52%, #151617 100%)"),
  makeSection("beach", "feature", "06", "Собственный пляж", "Собственный пляж как часть private coastline lifestyle", "Собственный пляж — один из ключевых маркеров редкости продукта. Он должен продаваться через свет, воду, приватность и сервис, а не как формальная функция.", "2 175 м² собственного пляжа", "Пляж не как функция, а как личный морской сценарий", "linear-gradient(135deg, #476574 0%, #c5ab83 52%, #121314 100%)"),
  makeSection("bridges", "feature", "07", "Связанные маршруты", "Мосты и маршруты объединяют территорию в единую прогулочную систему", "Вместо разрозненных зон проект показывает связность пространства: мосты, переходы и продуманные сценарии передвижения формируют цельную среду.", "Единая прогулочная система", "Маршруты, которые делают ландшафт частью архитектуры", "linear-gradient(135deg, #4b6771 0%, #b99a6b 50%, #171819 100%)"),
  makeSection("five-senses", "feature", "08", "Сады пяти чувств", "Сады, вовлекающие зрение, слух, аромат и тактильные ощущения", "Ландшафт в проекте работает не только визуально, но и чувственно. Этот блок нужно воспринимать как редкую luxury-деталь, а не просто описание благоустройства.", "Сад как experience", "Ландшафт, который воспринимается телом и памятью", "linear-gradient(135deg, #50666f 0%, #bca174 50%, #18191a 100%)"),
  makeSection("art-park", "feature", "09", "Авторский парк", "Парк с бионическими арт-объектами как часть визуального кода проекта", "Ландшафт и искусство в проекте соединены в одну концепцию. Это блок про характер среды и ее редкость для курортной недвижимости.", "Ландшафт и искусство", "Среда, где парк становится продолжением архитектуры", "linear-gradient(135deg, #546972 0%, #b69364 48%, #171819 100%)"),
  makeSection("evening-light", "feature", "10", "Вечерний сценарий", "Продуманное вечернее освещение объединяет атмосферу, безопасность и архитектуру", "Вечерний свет — это не только безопасность, но и самостоятельная эстетика проекта: теплый свет, архитектурные линии и спокойный ритм резиденции.", "Вечер как отдельный режим проекта", "Свет, который делает пространство дороже и спокойнее", "linear-gradient(135deg, #3e5360 0%, #b2875a 54%, #131415 100%)"),
  makeSection("gazebos", "feature", "11", "Атмосферные пространства", "Беседки с адиабатическим охлаждением и комфортом в течение всего дня", "Outdoor-блок должен звучать как история о тени, медленном ритме, приватности и удовольствии проводить время на воздухе у моря.", "Outdoor comfort", "Пространства, где хочется задерживаться, а не проходить мимо", "linear-gradient(135deg, #4a5f68 0%, #b89368 52%, #141516 100%)"),
  makeSection("amphitheater", "feature", "12", "События под открытым небом", "Амфитеатр и кинотеатр как публичная сцена приватного курорта", "События, кино и вечерние встречи вплетены в архитектуру территории. Это часть lifestyle-наратива, а не второстепенная развлекательная функция.", "Open-air culture", "Курортная среда, в которой досуг становится частью архитектуры", "linear-gradient(135deg, #445660 0%, #bd9969 50%, #18191a 100%)"),
  makeSection("kids-concept", "story", "13", "Детство нового уровня", "Семейный сценарий продуман так же тщательно, как и взрослый lifestyle", "Детский блок в референсе раскрывается через игровые пространства, образовательные программы, шоу под присмотром профессионалов и инфраструктуру досуга.", "Семейный сценарий без компромиссов", "Среда, где дети получают не только развлечения, но и собственный опыт проекта", "linear-gradient(135deg, #5c6d73 0%, #c3a579 50%, #171819 100%)"),
  makeSection("play-hub", "feature", "14", "Природный play-hub", "Игровые элементы на свежем воздухе объединяют фантазию и природу", "Среда для детской активности интегрирована в ландшафт и ощущается частью общей luxury-истории проекта, а не отдельной утилитарной зоной.", "Игра как часть ландшафта", "Природа и детская активность объединены в одну эмоциональную сцену", "linear-gradient(135deg, #63716f 0%, #c4a26e 52%, #161718 100%)"),
  makeSection("game-center", "feature", "15", "Game Center", "Интерактивные игровые пространства и зоны командного досуга", "Игровые функции проекта подаются как элемент семейного курорта высокого класса с собственной динамикой и культурой отдыха.", "Современный детский досуг", "Динамика и технологии внутри приватной клубной среды", "linear-gradient(135deg, #4d616a 0%, #b89261 50%, #171819 100%)"),
  makeSection("creative-studios", "feature", "16", "Творческие студии", "Пространства для мастер-классов, музыки и творческого развития", "Творческая инфраструктура становится еще одним аргументом в пользу семейного качества среды и общего статуса проекта.", "Творческая инфраструктура", "Детский и семейный досуг как продуманный premium-service", "linear-gradient(135deg, #546770 0%, #c09a67 52%, #161718 100%)"),
  makeSection("cinema-zone", "feature", "17", "Кинозал и активити-зона", "Комфортные пространства для просмотра, занятий и динамичных игр", "Это не набор функций, а внутренний ритм досуга и восстановления для семей и гостей проекта.", "Indoor family lounge", "Внутренние пространства с ритмом досуга и восстановления", "linear-gradient(135deg, #42515a 0%, #b9925f 48%, #151617 100%)"),
  makeSection("service", "story", "18", "Сервис", "Персональный lifestyle-сервис работает как продолжение самой недвижимости", "Забота о питомцах, доставка на электрокарах, семейный досуг, бронирование ресторанов, мероприятий и экскурсий переупакованы как премиальный сервис владения.", "Персональный lifestyle", "Сервис, который освобождает время владельца и усиливает качество жизни", "linear-gradient(135deg, #4d6270 0%, #c2a273 48%, #151617 100%)"),
  makeSection("transport", "feature", "19", "Транспорт и передвижение", "Яхты, автомобили представительского класса, трансферы и персональные водители", "Передвижение здесь — продолжение дорогого морского образа жизни, в котором логистика организована так же тщательно, как и отдых.", "Mobility as luxury service", "Передвижение без трения, ожиданий и бытового шума", "linear-gradient(135deg, #4a5d68 0%, #ba905c 50%, #151617 100%)"),
  makeSection("wellness", "story", "20", "SPA мирового уровня", "Восстановление и перезагрузка как один из центральных смыслов проекта", "SPA, сауны, хаммам, термы, массажи и инновационные программы восстановления становятся главным эмоциональным слоем wellness-блока.", "Wellness каждый день", "SPA не как услуга, а как регулярный ритм жизни в проекте", "linear-gradient(135deg, #3d5762 0%, #b58d61 52%, #151617 100%)"),
  makeSection("medical-center", "feature", "21", "Медицинский центр", "Диагностика мирового уровня и персонализированные протоколы здоровья", "Забота о здоровье подается как часть премиального образа жизни и глубины продукта, а не как вторичная инфраструктура.", "Healthcare as premium value", "Комфорт и забота о здоровье встроены в саму логику резиденции", "linear-gradient(135deg, #4c6167 0%, #be9d70 52%, #151617 100%)"),
  makeSection("body-mind", "feature", "22", "Body & Mind", "Пилатес, йога, стрейчинг и тихие сценарии восстановления", "Проект рассчитан не только на активный отдых, но и на медленный, устойчивый и хорошо организованный повседневный ритм.", "Тихий баланс у моря", "Пространство для внутреннего ритма и восстановления", "linear-gradient(135deg, #55676d 0%, #c0a174 50%, #171819 100%)"),
  makeSection("sports", "feature", "23", "Sports & Wellness", "Фитнес-центры, work-out, теннисный корт и стритбол", "Спорт встроен в общую lifestyle-модель проекта и воспринимается как часть ежедневного курортного режима.", "Активность как часть курортного ритма", "Энергия, движение и ежедневный уход за собой внутри одного маршрута", "linear-gradient(135deg, #415763 0%, #b98f60 52%, #151617 100%)"),
  makeSection("technology-intro", "story", "24", "Технологии", "Технологическая часть проекта упакована как незаметный комфорт премиум-класса", "Скоростные лифты, просторный паркинг, инженерные решения, система безопасности и повышенная шумоизоляция превращены в спокойный технологический narrative.", "Технологии без демонстративности", "Функциональная основа luxury-продукта скрыта, но ощущается каждый день", "linear-gradient(135deg, #4a5f66 0%, #b38b5d 52%, #151617 100%)"),
  makeSection("lifts", "feature", "25", "Скоростные лифты", "Плавное и безопасное передвижение между этажами с продуманной эргономикой", "Лифты здесь — еще один элемент бесшовного пользовательского опыта, а не просто инженерное оборудование.", "Скорость и плавность", "Комфорт ощущается даже в деталях вертикального маршрута", "linear-gradient(135deg, #445861 0%, #bc9a6e 50%, #151617 100%)"),
  makeSection("parking", "feature", "26", "Паркинг", "Подземный и наземный паркинг с безопасной организацией движения", "Продуманная конфигурация паркинга и комфорт для автомобилей разных классов становятся частью общего residential experience.", "Просторный паркинг", "Автомобильный сценарий должен быть таким же комфортным, как и residential experience", "linear-gradient(135deg, #495d65 0%, #b88f63 52%, #151617 100%)"),
  makeSection("engineering", "feature", "27", "Инженерные решения", "Энергоэффективные системы и автоматизация уровня премиального продукта", "Устойчивость, автоматизация и высокотехнологичные коммуникации — это блок про скрытый комфорт и долгую ценность владения.", "Умная инженерная база", "Инженерия работает тихо, но делает опыт владения принципиально другим", "linear-gradient(135deg, #52666e 0%, #c09b6f 52%, #151617 100%)"),
  makeSection("security", "feature", "28", "Система безопасности", "Многоуровневый контроль, охрана и видеонаблюдение как основа спокойствия", "Безопасность здесь подается как естественное продолжение private resort-среды и ощущения защищенности владельца.", "Защищенность без стресса", "Тишина и приватность держатся не только на архитектуре, но и на инфраструктуре безопасности", "linear-gradient(135deg, #42525b 0%, #b88e60 54%, #151617 100%)"),
  makeSection("soundproofing", "feature", "29", "Повышенная шумоизоляция", "Каждая резиденция защищена от внешнего и внутреннего шума", "Тишина усиливает ощущение абсолютного уединения и становится одним из самых ценных premium-параметров.", "Тишина как luxury", "Тишина становится одним из самых недооцененных преимуществ продукта", "linear-gradient(135deg, #4f6267 0%, #b69261 52%, #151617 100%)"),
  makeSection("location", "story", "30", "Локация и окружение", "Престижный и экологически чистый район города", "Локация строится через близость к центру Сочи, Красной Поляне, Олимпийскому парку и аэропорту — это рационально-эмоциональный блок про образ жизни.", "30 минут до центра Сочи", "Район, в котором море и город не спорят друг с другом", "linear-gradient(135deg, #4d6874 0%, #c4a87c 50%, #151617 100%)"),
  makeSection("team-interiors", "story", "31", "Команда проекта", "Интерьерная концепция с участием международной студии дизайна", "Команда интерьеров и ее опыт в проектах высокой категории становятся дополнительным аргументом доверия и эстетического веса.", "Сильная интерьерная экспертиза", "Интерьер — это не декор, а часть инвестиционного и эмоционального восприятия проекта", "linear-gradient(135deg, #54646d 0%, #c09a6c 50%, #171819 100%)"),
  makeSection("team-landscape", "feature", "32", "Ландшафтная экспертиза", "Ландшафт собран как самостоятельная luxury-дисциплина", "Сильная ландшафтная школа помогает объяснить, почему территория проекта выглядит цельной, спокойной и дорогой.", "High-class landscape", "Ландшафт проектируется как равная часть архитектуры и сервиса", "linear-gradient(135deg, #5b6d70 0%, #c29f71 50%, #171819 100%)"),
  makeSection("team-hotelier", "feature", "33", "Отельер и управление", "Курортная экспертиза усиливает инвестиционный и сервисный сценарий владения", "Профессиональный гостиничный оператор, специализирующийся на управлении курортной недвижимостью, усиливает продукт и его perceived value.", "Профессиональное управление", "Управление недвижимостью должно поддерживать бренд так же сильно, как и сама архитектура", "linear-gradient(135deg, #425866 0%, #b98f5f 52%, #151617 100%)"),
  makeSection("team-architecture", "feature", "34", "Архитектура", "Архитектурное бюро с опытом комплексного проектирования и анализа территории", "Профильная экспертиза и длительная работа с масштабными проектами становятся еще одним аргументом доверия к итоговой форме и среде.", "Архитектурная глубина проекта", "Форма и среда выглядят цельно, когда за ними стоит сильная проектная школа", "linear-gradient(135deg, #4a616e 0%, #be9b6f 50%, #151617 100%)"),
  makeSection("interiors-transition", "story", "35", "Переход к лотам", "Теперь история сужается: от масштаба проекта — к коллекции конкретных апартаментов", "До этого момента сайт продает контекст, архитектуру и образ жизни. Дальше история становится персональной: пользователь знакомится с восемью апартаментами, которые можно купить сейчас.", "8 апартаментов в продаже", "Финальная часть истории должна переводить эмоцию в выбор конкретного лота", "linear-gradient(135deg, #465f6b 0%, #c1a071 50%, #151617 100%)")
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
  makeSection("gallery", "story", "36", "Фото и видео", "Визуальная история проекта продолжается через галерею и branded reels", "Фотографии фасада, территории, интерьеров, спорта, SPA и воды должны работать как единая luxury-editorial серия. Видео дополняет ее движением, светом и атмосферой места.", "media-driven storytelling", "Hero-видео, drone shots и полноэкранные фотосерии", "linear-gradient(135deg, #4b616b 0%, #c2a87a 52%, #151617 100%)"),
  makeSection("pricing-cta", "feature", "37", "Запрос стоимости", "На каждом типе лота проект ведет к одному действию — узнать стоимость", "Логику мы сохраняем, но делаем ее тише и дороже: вместо давления на лид — ощущение private sales process и персонального подбора.", "private sales", "Стоимость, условия и подбор должны восприниматься как персональная работа", "linear-gradient(135deg, #445d69 0%, #b78f60 52%, #151617 100%)"),
  makeSection("route", "feature", "38", "Офис продаж", "Офис продаж и персональный показ становятся финальной точкой истории", "Информация об офисе продаж и маршруте должна выглядеть как естественное завершение путешествия по проекту, а не как формальная контактная зона.", "private viewing", "Переход от онлайн-истории к личному контакту должен выглядеть естественно и дорого", "linear-gradient(135deg, #4e6672 0%, #c19d70 50%, #151617 100%)"),
  makeSection("contact-story", "contact", "39", "Персональный запрос", "Запросите подбор апартаментов под ваш сценарий владения", "Финальный блок собирает все линии истории в один спокойный CTA: показать 8 апартаментов, обсудить формат, представить материалы и пригласить на персональный показ.", "персональный подбор", "Контактный блок должен завершать историю так же сильно, как hero ее открывает", "linear-gradient(135deg, #4d6570 0%, #bc9f6f 52%, #151617 100%)"),
  makeSection("footer-story", "feature", "40", "Финальный экран", "История заканчивается там, где начинается личное знакомство с проектом", "Такой one-page сайт должен ощущаться как длинный cinematic scroll: сначала масштаб и образ жизни, затем доверие и технологии, затем 8 апартаментов и спокойный private request в финале.", "cinematic one-page story", "Последний экран фиксирует статус бренда и переводит интерес в действие", "linear-gradient(135deg, #465c66 0%, #b98f61 52%, #141516 100%)")
];

const METRICS = [
  { value: "26 000 м²", label: "уникальное благоустройство" },
  { value: "1,3 ГА", label: "парящие променады" },
  { value: "4,5 ГА", label: "закрытая территория" },
  { value: "2 175 м²", label: "собственный пляж" },
  { value: "80%", label: "видовые резиденции" }
];

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
];

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
  service: {
    variant: "ribbon",
    label: "Глава I",
    title: "От маршрутов и воды — к сервису private resort",
    text: "После первых экранов про масштаб и coastline сайт должен менять ритм: не просто показывать территорию, а переводить пользователя в мир сценариев владения, сервиса и lifestyle."
  },
  "technology-intro": {
    variant: "panel",
    label: "Глава II",
    title: "Дальше история становится точнее и технологичнее",
    text: "На этом этапе подача должна ощущаться уже не как вдохновение, а как подтверждение качества продукта: инженерия, шумоизоляция, безопасность и зрелость девелопера."
  },
  "apartments-intro": {
    variant: "minimal",
    label: "Глава III",
    title: "Теперь история переходит в конкретные лоты и private sales",
    text: "После narrative-части пользователь должен оказаться в более точной, коммерчески сильной зоне: выбор лота, аргументы владения и запрос персональной презентации."
  },
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
    quote: "Сервис здесь должен ощущаться не как доп. опция, а как сама форма владения.",
    note: "После первых coastline-экранов narrative делает паузу и переводит внимание от ландшафта к повседневному качеству private resort."
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
        className="story-heading desktop-heading-measure mt-5 max-w-full text-[2.7rem] leading-[0.92] [overflow-wrap:anywhere] md:text-[4.1rem] xl:text-[5rem]"
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
    <div className="desktop-hero-panel rounded-[2.7rem] border p-6 lg:p-7 xl:p-8" style={{ borderColor: theme.border, background: theme.surfaceStrong }}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-[11px] uppercase" style={{ color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
            Масштаб проекта
          </div>
          <div
            className="mt-3 max-w-[20rem] text-[1.75rem] leading-[1.02]"
            style={{
              fontFamily: theme.headingFont,
              letterSpacing: theme.headingSpacing,
              color: theme.text,
              fontStyle: theme.headingStyle,
              fontWeight: 400
            }}
          >
            Ключевые цифры собраны в один спокойный private sales module
          </div>
        </div>
        <div className="rounded-full border px-4 py-2 text-[11px] uppercase" style={{ borderColor: theme.border, color: theme.subtle, background: theme.panel, letterSpacing: theme.eyebrowSpacing }}>
          premium asset
        </div>
      </div>
      <div className="mt-4 max-w-[32rem] text-sm leading-7" style={{ color: theme.muted, letterSpacing: theme.bodySpacing }}>
        Один собранный блок вместо множества мелких карточек: территория, promenade, пляж и видовые резиденции читаются как аргументы продукта.
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {METRICS.map((item, index) => (
          <div
            key={item.label}
            className={`desktop-metric-card rounded-[1.8rem] border p-5 ${index === METRICS.length - 1 ? "sm:col-span-2" : ""}`}
            style={{
              borderColor: theme.border,
              background: theme.panel
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
            <div className="mt-2 max-w-[16rem] text-sm leading-6" style={{ color: theme.subtle, letterSpacing: theme.bodySpacing }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
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
        </div>

        <div className="mobile-media-layer relative mt-4 min-h-[74svh] overflow-hidden border-y" style={{ borderColor: theme.border }}>
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
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.52))" }} />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="text-[11px] uppercase" style={{ color: "#fff", letterSpacing: theme.eyebrowSpacing }}>
              branded reel
            </div>
            <div className="mt-3 max-w-[15rem] text-sm leading-7" style={{ color: "rgba(255,255,255,0.8)", letterSpacing: theme.bodySpacing }}>
              Движение, свет и shoreline-ритм без длинных пояснений.
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
        <div className={`grid items-start gap-10 ${format.storyCols} lg:gap-14 ${reverse ? "lg:grid-flow-col-dense" : ""}`}>
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
          <div className={`min-w-0 ${reverse ? "lg:order-1" : ""}`}>
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
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at top, rgba(255,255,255,0.16), transparent 30%), linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.1) 48%, ${theme.panel})`
            }}
          />

          <div className={`relative z-10 mx-auto flex ${format.heroMinHeight} max-w-[1600px] flex-col justify-between px-6 pb-10 pt-24 lg:px-10 lg:pb-16 lg:pt-40 xl:pt-44`}>
            <div className="flex items-start gap-6">
              <div className="hero-chip rounded-full border px-4 py-2 text-[11px] uppercase backdrop-blur-md" style={{ borderColor: theme.border, background: theme.panel, color: theme.accent, letterSpacing: theme.eyebrowSpacing }}>
                Сочи · private resort · 8 апартаментов в продаже
              </div>
            </div>

            <div className={`grid items-end gap-10 pb-6 pt-16 ${format.id === "gallery" ? "lg:grid-cols-[0.96fr_1.04fr]" : "lg:grid-cols-[1fr_1fr]"} lg:gap-16 lg:pb-3 lg:pt-32 xl:gap-20 xl:pt-36`}>
              <div>
                <div className="hero-eyebrow mb-8 flex items-center gap-4 text-[11px] uppercase" style={{ color: theme.subtle, letterSpacing: "0.35em" }}>
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
                    fontWeight: 400
                  }}
                >
                  премиальные аппартаменты
                  <br />
                  <span style={{ color: theme.accent }}>у моря</span>
                  <br />
                  в Сочи
                </h1>
                <div className={`hero-copy desktop-copy-measure mt-8 ${format.maxTextWidth} border-l pl-6 text-[15px] font-medium leading-8 md:text-[18px]`} style={{ borderColor: theme.accent, color: theme.muted, letterSpacing: theme.bodySpacing }}>
                  Сначала проект продает масштаб, тишину и ритм private resort. Затем переводит внимание к 8 конкретным лотам и спокойному private dialogue.
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
                    style={{ borderColor: theme.border, background: theme.surface, color: theme.text }}
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
                    style={{ borderColor: theme.border, background: theme.panel, color: theme.text }}
                  >
                    Настроить вид
                  </button>
                </div>
              </div>

              <HeroMetricsPanel theme={theme} />
            </div>
          </div>
        </section>

        {STORY_SECTIONS.slice(1).map((item, index) => (
          <Fragment key={item.id}>
            {DESKTOP_CHAPTER_BREAKS[item.id] ? <DesktopChapterBreak chapter={DESKTOP_CHAPTER_BREAKS[item.id]} theme={theme} /> : null}
            {item.id === "service" ? (
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
                summary="Маршрут к воде здесь работает как кинематографический момент: меньше пояснений, больше света, воздуха и ощущения движения к морю."
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
                mediaLabel="full-screen photo"
                summary="Локация продается одной сильной панорамой и коротким комментарием: престижный район, воздух, море и близость к ключевым точкам Сочи."
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

        <DesktopChapterBreak chapter={DESKTOP_CHAPTER_BREAKS["apartments-intro"]} theme={theme} />
        <section id="apartments-intro" className="border-y py-20 lg:py-28" style={{ borderColor: theme.border, backgroundColor: theme.backgroundAlt }}>
          <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
            <StoryHeader
              item={{
                label: "35A",
                eyebrow: "Коллекция в продаже",
                title: "Ниже — 8 апартаментов, вписанных в историю проекта как ее персональная кульминация",
                text: "После блоков о масштабе, сервисе, технологиях и команде пользователь приходит к конкретному выбору. Каждый апартамент должен ощущаться продолжением общей luxury-истории проекта.",
                accent: "8 апартаментов в продаже"
              }}
              theme={theme}
              format={format}
            />
          </div>
        </section>

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
                  label: "41",
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
    </div>
  );
}

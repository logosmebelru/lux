import { startTransition, useDeferredValue, useMemo, useState } from "react";
import ApartmentCard from "./components/ApartmentCard";
import MediaPanel from "./components/MediaPanel";
import ModeSwitchers from "./components/ModeSwitchers";
import SectionHeader from "./components/SectionHeader";
import SmartImage from "./components/SmartImage";
import StorySection from "./components/StorySection";
import { APARTMENT_ASSETS, GALLERY_ASSETS, HERO_ASSETS, STORY_ASSETS } from "./data/assets";
import { FORMATS } from "./data/formats";
import { APARTMENTS, GALLERY_BLOCKS, METRICS, STORY_SECTIONS } from "./data/content";
import { THEMES } from "./data/themes";

const FORMAT_CLASS_MAP = {
  cinema: "format-cinema",
  editorial: "format-editorial",
  panorama: "format-panorama",
  catalogue: "format-catalogue"
};

export default function GreenmontLuxurySite() {
  const [themeId, setThemeId] = useState(THEMES[0].id);
  const [formatId, setFormatId] = useState(FORMATS[0].id);
  const deferredThemeId = useDeferredValue(themeId);
  const deferredFormatId = useDeferredValue(formatId);

  const activeTheme = useMemo(
    () => THEMES.find((item) => item.id === deferredThemeId) || THEMES[0],
    [deferredThemeId]
  );
  const activeFormat = useMemo(
    () => FORMATS.find((item) => item.id === deferredFormatId) || FORMATS[0],
    [deferredFormatId]
  );

  const pageStyle = useMemo(() => activeTheme.vars, [activeTheme]);

  return (
    <div
      className={`greenmont-page ${FORMAT_CLASS_MAP[activeFormat.id] || "format-cinema"}`}
      style={pageStyle}
    >
      <div className="noise-layer" />

      <section className="hero">
        <div className="hero-media-wrap">
          <SmartImage
            src={HERO_ASSETS[0]}
            alt="Greenmont luxury residence"
            className="hero-media"
            fallbackLabel="Greenmont"
            loading="eager"
          />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">Greenmont Luxury Residences</p>
          <h1>
            Пространство, где статус
            <br />
            ощущается в каждой детали
          </h1>
          <p className="hero-lead">
            Одностраничная история Greenmont: 44 последовательных сюжетных блока,
            8 форматов квартир и гибкая визуальная подача для вашего private sales.
          </p>
          <div className="hero-actions">
            <a href="#apartments">Подобрать резиденцию</a>
            <a href="#contact" className="ghost">
              Запросить презентацию
            </a>
          </div>
        </div>
      </section>

      <section className="metrics">
        {METRICS.map((metric) => (
          <article key={metric.label}>
            <p>{metric.value}</p>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <ModeSwitchers
        themes={THEMES}
        formats={FORMATS}
        activeTheme={themeId}
        activeFormat={formatId}
        onThemeChange={(nextThemeId) => startTransition(() => setThemeId(nextThemeId))}
        onFormatChange={(nextFormatId) => startTransition(() => setFormatId(nextFormatId))}
      />

      <section className="story" id="story">
        <SectionHeader
          eyebrow="Нарратив проекта"
          title="44 главы о жизни в Greenmont"
          subtitle="Сквозная история района, архитектуры, сервиса и инвестиционной ценности."
        />

        <div className="story-list">
          {STORY_SECTIONS.map((section, index) => (
            <StorySection
              key={section.id}
              section={section}
              image={STORY_ASSETS[index]}
              reversed={index % 2 === 1}
            />
          ))}
        </div>
      </section>

      <section className="apartments" id="apartments">
        <SectionHeader
          eyebrow="Коллекция планировок"
          title="8 форматов резиденций под разные сценарии жизни"
          subtitle="От city-suite до signature-пентхауса: каждая планировка создана под конкретный стиль жизни."
        />
        <div className="apartments-grid">
          {APARTMENTS.map((apartment, index) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              image={APARTMENT_ASSETS[index]}
            />
          ))}
        </div>
      </section>

      <section className="gallery">
        <SectionHeader
          eyebrow="Визуальный акцент"
          title={activeFormat.name}
          subtitle={activeFormat.description}
        />
        <div className="gallery-grid">
          {GALLERY_BLOCKS.map((block, index) => (
            <article key={block.title} className="gallery-item">
              <MediaPanel
                src={GALLERY_ASSETS[index]}
                alt={block.title}
                label={`Gallery ${index + 1}`}
              />
              <h3>{block.title}</h3>
              <p>{block.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <SectionHeader
          eyebrow="Private Sales"
          title="Запросите персональную презентацию Greenmont"
          subtitle="Команда продаж подготовит подборку планировок, финансовую модель и сценарий сделки."
        />
        <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            Имя
            <input type="text" name="name" placeholder="Как к вам обращаться" required />
          </label>
          <label>
            Телефон
            <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" required />
          </label>
          <label>
            Интересующий бюджет
            <select name="budget" defaultValue="40-60">
              <option value="30-40">30–40 млн ₽</option>
              <option value="40-60">40–60 млн ₽</option>
              <option value="60-90">60–90 млн ₽</option>
              <option value="90+">90+ млн ₽</option>
            </select>
          </label>
          <label className="full">
            Комментарий
            <textarea
              name="comment"
              rows={4}
              placeholder="Например: нужна квартира с террасой и видом на парк"
            />
          </label>
          <button type="submit">Отправить запрос</button>
        </form>
      </section>
    </div>
  );
}

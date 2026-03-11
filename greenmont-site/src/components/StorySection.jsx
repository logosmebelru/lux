import MediaPanel from "./MediaPanel";

export default function StorySection({ section, image, reversed }) {
  return (
    <article className={`story-section ${reversed ? "reversed" : ""}`}>
      <div className="story-content">
        <p className="story-number">{String(section.index).padStart(2, "0")}</p>
        <h3>{section.title}</h3>
        <p>{section.lead}</p>
        <p>{section.body}</p>
        <blockquote>{section.quote}</blockquote>
      </div>
      <MediaPanel
        src={image}
        alt={`Greenmont story ${section.index}`}
        label={`Секция ${section.index}`}
      />
    </article>
  );
}

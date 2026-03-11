import { memo } from "react";
import MediaPanel from "./MediaPanel";

const StorySection = memo(function StorySection({ section, image, reversed }) {
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
        alt={`Секция истории Greenmont ${section.index}`}
        label={`Секция ${section.index}`}
      />
    </article>
  );
});

export default StorySection;

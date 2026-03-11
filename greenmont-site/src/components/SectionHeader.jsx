import { memo } from "react";

const SectionHeader = memo(function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="section-header">
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </header>
  );
});

export default SectionHeader;

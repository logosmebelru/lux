export default function ModeSwitchers({
  themes,
  formats,
  activeTheme,
  activeFormat,
  onThemeChange,
  onFormatChange
}) {
  return (
    <section className="switchers">
      <div className="switcher-group">
        <p className="switcher-label">Тема</p>
        <div className="switcher-items">
          {themes.map((theme) => (
            <button
              type="button"
              key={theme.id}
              className={activeTheme === theme.id ? "active" : ""}
              onClick={() => onThemeChange(theme.id)}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>
      <div className="switcher-group">
        <p className="switcher-label">Формат подачи</p>
        <div className="switcher-items">
          {formats.map((format) => (
            <button
              type="button"
              key={format.id}
              className={activeFormat === format.id ? "active" : ""}
              onClick={() => onFormatChange(format.id)}
            >
              {format.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

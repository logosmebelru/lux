export const MEDIA_BASE = "/media";

const heroExt = ["png", "png", "png", "jpeg", "png", "png"];
const storyExt = [
  "png", "png", "png", "png", "png", "jpeg", "jpeg", "jpeg", "png", "png",
  "png", "png", "png", "png", "png", "png", "png", "png", "png", "png",
  "png", "png", "png", "png", "png", "png", "png", "jpeg", "jpeg", "png",
  "png", "png", "png", "png", "jpeg", "png", "png", "png", "png", "jpeg",
  "png", "png", "png", "png"
];
const apartmentExt = ["png", "png", "png", "png", "png", "png", "png", "png"];
const galleryExt = ["png", "png"];

const toPath = (folder, name, ext) => `${MEDIA_BASE}/${folder}/${name}.${ext}`;

export const HERO_ASSETS = heroExt.map((ext, index) =>
  toPath("hero", `hero-${String(index + 1).padStart(2, "0")}`, ext)
);

export const STORY_ASSETS = storyExt.map((ext, index) =>
  toPath("story", `story-${String(index + 1).padStart(2, "0")}`, ext)
);

export const APARTMENT_ASSETS = apartmentExt.map((ext, index) =>
  toPath(
    "apartments/shared",
    `apartment-${String(index + 1).padStart(2, "0")}`,
    ext
  )
);

export const GALLERY_ASSETS = galleryExt.map((ext, index) =>
  toPath("gallery", `gallery-${String(index + 1).padStart(2, "0")}`, ext)
);

export const HERO_FEATURE_ASSETS = {
  mobile: toPath("hero", "______4k_delpmaspu-5", "png")
};

export const VIDEO_ASSETS = {
  hero: toPath("video", "Luxury_seaside_complex_drone_reveal_delpmaspu_", "mp4"),
  gallery: toPath("video", "gallery-loop", "mp4")
};

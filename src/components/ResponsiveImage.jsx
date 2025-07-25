import PropTypes from "prop-types";

export default function ResponsiveImage({ src, alt, className = "" }) {
  const webpSrc = src.replace("/assets/", "/webp/").replace(/\.jpg$/i, ".webp");
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} className={className} loading="lazy" />
    </picture>
  );
}

ResponsiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

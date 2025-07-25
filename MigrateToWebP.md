# Migrating from JPG to WebP Images in Your React Project


## 1. Generate WebP Images

WebP images should be generated in the same directory as the original .jpg files. Do NOT use a separate webp directory.

## 2. Update React Components to Use WebP

### A. Use the `<picture>` Element

Replace:
```jsx
<img src="/assets/gallery/photo1.jpg" alt="..." />
```
With:
```jsx
<picture>
  <source srcSet="/assets/gallery/photo1.webp" type="image/webp" />
  <img src="/assets/gallery/photo1.jpg" alt="Leírás a képről" loading="lazy" />
</picture>
```

### B. (Optional) Create a Reusable Component

Create `src/components/ResponsiveImage.jsx`:
```jsx
import PropTypes from "prop-types";

export default function ResponsiveImage({ src, alt, className = "" }) {
  const webpSrc = src.replace(/\.jpg$/i, ".webp");
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
```

Use it like:
```jsx
<ResponsiveImage src="/assets/gallery/photo1.jpg" alt="Leírás a képről" />
```

---

## 3. Update All Image Usages

- Search your project for `<img src="` and update each to use the `<picture>` pattern or the new `ResponsiveImage` component.
- Test your site to ensure images load and look good.

---

## 4. Best Practices

- Always provide descriptive `alt` text for accessibility.
- Use `loading="lazy"` for performance.
- Use Tailwind or responsive classes for styling.

---

## 5. Deploy

- After updating, build and deploy your site as usual.

---

**This process ensures your site uses modern, optimized images for best performance and compatibility.**

import mozjpeg from "imagemin-mozjpeg";
import imageminSharp from "imagemin-sharp";
import webp from "imagemin-webp";

export default {
  plugins: [
    imageminSharp({ resize: { percent: 33 } }),
    webp({ quality: 60 })
  ]
};

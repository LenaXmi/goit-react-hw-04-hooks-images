import ImageGalleryItem from "../ImageGalleryItem/ImageGalleryItem";
import s from "./ImageGallery.module.css";
function ImageGallery({ imageArray, onImgClick }) {
  return (
    <ul className={s.ImageGallery}>
      {imageArray.map((arrayEl) => (
        <li
          key={arrayEl.id}
          className={s.ImageGalleryItem}
          onClick={() => onImgClick(arrayEl)}
        >
          <ImageGalleryItem imageObj={arrayEl} />
        </li>
      ))}
    </ul>
  );
}

export default ImageGallery;

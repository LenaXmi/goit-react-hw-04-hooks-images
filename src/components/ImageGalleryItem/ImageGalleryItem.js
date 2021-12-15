import s from "./ImageGalleryItem.module.css";

function ImageGalleryItem({ imageObj }) {
  return (
    <img src={imageObj.webformatURL} alt={imageObj.tags} className={s.Image} />
  );
}

export default ImageGalleryItem;

import { Slide } from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css';
import styles from './ProductSlideshow.module.css';

interface Props {
  images: string[];
}

export const ProductSlideshow = ({ images }: Props) => {
  return (
    <Slide easing='linear' duration={7000} indicators>
      {images.map((image) => {
        return (
          <div className={styles['each-slide']} key={image}>
            <div
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
              }}
            ></div>
          </div>
        );
      })}
    </Slide>
  );
};

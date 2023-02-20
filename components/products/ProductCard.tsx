import { useMemo, useState } from 'react';
import NextLink from 'next/link';

import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Box,
  Typography,
  Link,
  Chip,
} from '@mui/material';

import { IProduct } from '@/interfaces';

interface Props {
  product: IProduct;
}

export const ProductCard = ({ product }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const productImage = useMemo(() => {
    return isHovered ? product.images[1] : product.images[0];
  }, [isHovered, product.images]);

  return (
    <Grid
      item
      xs={6}
      sm={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <NextLink
          href={`/product/${product.slug}`}
          passHref
          prefetch={false}
          legacyBehavior
        >
          <Link>
            <CardActionArea>
              {product.inStock === 0 && (
                <Chip
                  color='primary'
                  label='Not available'
                  sx={{ position: 'absolute', zIndex: 2, top: 10, left: 10 }}
                />
              )}
              <CardMedia
                className='fadeIn'
                component='img'
                image={productImage}
                alt={product.title}
                onLoad={() => setIsImageLoaded(true)}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>

      <Box
        sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }}
        className='fadeIn'
      >
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>{`$${product.price}`}</Typography>
      </Box>
    </Grid>
  );
};

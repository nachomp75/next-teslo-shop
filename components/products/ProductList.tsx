import { Grid } from '@mui/material';

import { IProduct } from '@/interfaces';
import { ProductCard } from '.';

interface Props {
  products: IProduct[];
}

export const ProductList = ({ products }: Props) => {
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </Grid>
  );
};

import { Typography } from '@mui/material';

import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { useProducts } from '@/hooks';

export default function HomePage() {
  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout
      title='Teslo Shop - Home'
      pageDescription='Find the best Teslo products here!'
    >
      <Typography variant='h1' component='h1'>
        Shop
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        All products
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}

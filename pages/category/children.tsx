import { Typography } from '@mui/material';

import { ShopLayout } from '@/components/layouts';
import { FullScreenLoading } from '@/components/ui';
import { ProductList } from '@/components/products';
import { useProducts } from '@/hooks';

const ChildrenPage = () => {
  const { products, isLoading } = useProducts('/products?gender=kid');

  return (
    <ShopLayout
      title='Teslo Shop - Children'
      pageDescription='Find the best Teslo products for children!'
    >
      <Typography variant='h1' component='h1'>
        Children
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        All products for children
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default ChildrenPage;

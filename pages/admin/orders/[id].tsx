import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';

import {
  AirplaneTicketOutlined,
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';

import { CartList, CartOrderSummary } from '@/components/cart';
import { AdminLayout } from '@/components/layouts';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { countries } from '@/utils';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { _id, isPaid, numberOfItems, shippingAddress } = order;
  const { firstName, lastName, address, address2, city, zip, country, phone } =
    shippingAddress;

  return (
    <AdminLayout
      title='Order summary'
      subtitle={`Order ${_id} summary`}
      icon={<AirplaneTicketOutlined />}
    >
      {isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label='Already paid'
          variant='outlined'
          color='success'
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label='Payment pending'
          variant='outlined'
          color='error'
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container spacing={2} className='fadeIn'>
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>
                Summary ({numberOfItems} {numberOfItems > 1 ? 'items' : 'item'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Shipping address</Typography>
                <NextLink href='/checkout/address' passHref legacyBehavior>
                  <Link underline='always'>Edit</Link>
                </NextLink>
              </Box>

              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address} {address2 ? `, ${address2}` : ''}
              </Typography>
              <Typography>
                {city}, {zip}
              </Typography>
              <Typography>
                {countries.find(({ code }) => code === country)?.name}
              </Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref legacyBehavior>
                  <Link underline='always'>Edit</Link>
                </NextLink>
              </Box>

              <CartOrderSummary
                order={{
                  numberOfItems: order.numberOfItems,
                  subTotal: order.subTotal,
                  tax: order.tax,
                  total: order.total,
                }}
              />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Box flexDirection='column' sx={{ display: 'flex', flex: 1 }}>
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label='Already paid'
                      variant='outlined'
                      color='success'
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <Chip
                      sx={{ my: 2 }}
                      label='Payment pending'
                      variant='outlined'
                      color='error'
                      icon={<CreditCardOffOutlined />}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id = '' } = query;

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: '/admin/orders',
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;

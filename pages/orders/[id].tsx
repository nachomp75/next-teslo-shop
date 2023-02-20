import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { getSession } from 'next-auth/react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from '@mui/icons-material';

import { ShopLayout } from '@/components/layouts';
import { CartList, CartOrderSummary } from '@/components/cart';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { countries } from '@/utils';
import { tesloApi } from '@/api';

export type OrderResponseBody = {
  id: string;
  status:
    | 'COMPLETED'
    | 'SAVED'
    | 'APPROVED'
    | 'VOIDED'
    | 'PAYER_ACTION_REQUIRED';
};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

  const { _id, isPaid, numberOfItems, shippingAddress } = order;
  const { firstName, lastName, address, address2, city, zip, country, phone } =
    shippingAddress;

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') {
      return alert('There is no PayPal payment');
    }

    setIsPaying(true);

    try {
      await tesloApi.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: order._id,
      });

      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
      alert('Error');
    }
  };

  return (
    <ShopLayout title={`Order ${_id} summary`} pageDescription='Order summary'>
      <Typography variant='h1' component='h1'>
        Order: {_id}
      </Typography>

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
                <Box
                  display='flex'
                  justifyContent='center'
                  className='fadeIn'
                  sx={{ display: isPaying ? 'flex' : 'none' }}
                >
                  <CircularProgress />
                </Box>

                <Box
                  flexDirection='column'
                  sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label='Already paid'
                      variant='outlined'
                      color='success'
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(_data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: String(order.total),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(_data, actions) => {
                        return actions
                          .order!.capture()
                          .then((details) => onOrderCompleted(details));
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = '' } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order || order.user !== session.user.id) {
    return {
      redirect: {
        destination: '/orders/history',
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

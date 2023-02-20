import { FC, useContext } from 'react';

import { Grid, Typography } from '@mui/material';

import { CartContext } from '@/context';
import { currency } from '@/utils';

interface Props {
  order?: {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
  };
}

export const CartOrderSummary: FC<Props> = ({ order }) => {
  const { numberOfItems, subTotal, tax, total } = useContext(CartContext);

  const orderToShow = order || { numberOfItems, subTotal, tax, total };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. products</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>
          {orderToShow.numberOfItems}{' '}
          {orderToShow.numberOfItems > 1 ? 'items' : 'item'}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{currency.format(orderToShow.subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>
          Taxes ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)
        </Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{currency.format(orderToShow.tax)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>Total:</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end' sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>
          {currency.format(orderToShow.total)}
        </Typography>
      </Grid>
    </Grid>
  );
};

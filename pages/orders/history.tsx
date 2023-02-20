import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';

import { getSession } from 'next-auth/react';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { ShopLayout } from '@/components/layouts';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullName', headerName: 'Full name', width: 300 },
  {
    field: 'paid',
    headerName: 'Paid',
    description: 'Show if order is paid',
    width: 200,
    renderCell: ({ row }: GridRenderCellParams) => {
      return row.paid ? (
        <Chip color='success' label='Paid' variant='outlined' />
      ) : (
        <Chip color='error' label='Not paid' variant='outlined' />
      );
    },
  },
  {
    field: 'order',
    headerName: 'View order',
    width: 200,
    sortable: false,
    renderCell: ({ row }: GridRenderCellParams) => (
      <NextLink href={`/orders/${row.orderId}`} legacyBehavior>
        <Link underline='always'>View order</Link>
      </NextLink>
    ),
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map(({ isPaid, shippingAddress, _id }, index) => ({
    id: index + 1,
    paid: isPaid,
    fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
    orderId: _id,
  }));

  return (
    <ShopLayout title='Order history' pageDescription='Client order history'>
      <Typography variant='h1' component='h1'>
        Order history
      </Typography>

      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false,
      },
    };
  }

  const orders = await dbOrders.getOrdersByUser(session.user.id);

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;

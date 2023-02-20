import useSWR from 'swr';

import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { AdminLayout } from '@/components/layouts';
import { IOrder, IUser } from '@/interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID', width: 250 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'name', headerName: 'Fullname', width: 300 },
  { field: 'total', headerName: 'Total amount', width: 300 },
  {
    field: 'isPaid',
    headerName: 'Paid',
    renderCell: ({ row }: GridRenderCellParams) => {
      return row.isPaid ? (
        <Chip variant='outlined' label='Paid' color='success' />
      ) : (
        <Chip variant='outlined' label='Pending' color='error' />
      );
    },
  },
  {
    field: 'numberOfItems',
    headerName: 'No. products',
    align: 'center',
    width: 150,
  },
  {
    field: 'check',
    headerName: 'View order',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>
          View order
        </a>
      );
    },
  },
  { field: 'createdAt', headerName: 'Created at', width: 300 },
];

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  if (!data && !error) return <></>;

  const rows = data!.map(
    ({ _id, user, total, isPaid, numberOfItems, createdAt }) => ({
      id: _id,
      email: (user as IUser).email,
      name: (user as IUser).name,
      total,
      isPaid,
      numberOfItems,
      createdAt,
    })
  );

  return (
    <AdminLayout
      title='Orders'
      subtitle='Orders maintenance'
      icon={<ConfirmationNumberOutlined />}
    >
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
    </AdminLayout>
  );
};

export default OrdersPage;

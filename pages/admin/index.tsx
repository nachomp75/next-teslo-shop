import { useState, useEffect } from 'react';
import useSWR from 'swr';

import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';

import { SummaryTile } from '@/components/admin';
import { AdminLayout } from '@/components/layouts';
import { DashboardSummaryResponse } from '@/interfaces';

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>(
    '/api/admin/dashboard',
    {
      refreshInterval: 30000,
    }
  );
  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!error && !data) {
    return <></>;
  }

  if (error) {
    console.log(error);
    return <Typography>Error trying to load data</Typography>;
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithoutStock,
    lowInventory,
  } = data!;

  return (
    <AdminLayout
      title='Dashboard'
      subtitle='Overall stats'
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subtitle='Total orders'
          icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={paidOrders}
          subtitle='Paid orders'
          icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={notPaidOrders}
          subtitle='Pending orders'
          icon={<CreditCardOutlined color='error' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfClients}
          subtitle='Clients'
          icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfProducts}
          subtitle='Products'
          icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={productsWithoutStock}
          subtitle='Products without stock'
          icon={
            <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />
          }
        />

        <SummaryTile
          title={lowInventory}
          subtitle='Low inventory'
          icon={
            <ProductionQuantityLimitsOutlined
              color='warning'
              sx={{ fontSize: 40 }}
            />
          }
        />

        <SummaryTile
          title={refreshIn}
          subtitle='Next update:'
          icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;

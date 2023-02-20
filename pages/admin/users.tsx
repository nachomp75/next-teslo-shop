import { useState, useEffect } from 'react';
import useSWR from 'swr';

import { Grid, MenuItem, Select, Typography } from '@mui/material';
import { PeopleOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { AdminLayout } from '@/components/layouts';
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return <></>;

  const onRoleUpdate = async (userId: string, newRole: string) => {
    const previousUsers = users.map((user) => ({ ...user }));
    const updatedUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));

    setUsers(updatedUsers);

    try {
      await tesloApi.put('/admin/users', { userId, role: newRole });
    } catch (error) {
      setUsers(previousUsers);
      alert('Could not update user role');
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'name', headerName: 'Fullname', width: 300 },
    {
      field: 'role',
      headerName: 'Role',
      width: 300,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Select
            value={row.role}
            label='Role'
            onChange={({ target }) => onRoleUpdate(row.id, target.value)}
            sx={{ width: 300 }}
          >
            {['admin', 'client', 'super-user', 'SEO'].map((role) => (
              <MenuItem key={role} value={role}>
                <Typography textTransform='capitalize'>{role}</Typography>
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
  ];

  const rows = users.map(({ _id, email, name, role }) => ({
    id: _id,
    email,
    name,
    role,
  }));

  return (
    <AdminLayout
      title='Users'
      subtitle='Users maintenance'
      icon={<PeopleOutline />}
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

export default UsersPage;

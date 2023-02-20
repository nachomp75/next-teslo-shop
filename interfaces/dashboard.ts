export interface DashboardSummaryResponse {
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithoutStock: number;
  lowInventory: number;
}

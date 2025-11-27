import AdminDashboardEnhanced from "@/components/admin/dashboard/AdminDashboardEnhanced";
import {
  getAlldata,
  getDashboardDatabaseModel,
  getMainIndicatorsModel,
} from "@/services/model/DashboardDatabaseModel";
import Box from "@mui/material/Box";

export default async function Dashboard() {
  const databaseLocations = await getDashboardDatabaseModel();
  const mainData = await getMainIndicatorsModel();
  const orgList = await getAlldata();
  const allOrg = orgList.allOrg;

  return (
    <Box>
      <AdminDashboardEnhanced
        mainIndicator={mainData}
        databaseLocations={databaseLocations}
        allOrg={allOrg}
      />
    </Box>
  );
}

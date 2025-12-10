import AdminDashboardEnhanced from "@/components/admin/dashboard/AdminDashboardEnhanced";
import {
  getAlldata,
  getDashboardDatabaseModel,
  getMainIndicatorsModel,
  getDatabaseTechnologyStats,
} from "@/services/model/DashboardDatabaseModel";
import { getDuplicateIndicators } from "@/services/IndicatorService";
import Box from "@mui/material/Box";

export default async function Dashboard() {
  const databaseLocations = await getDashboardDatabaseModel();
  const mainData = await getMainIndicatorsModel();
  const orgList = await getAlldata();
  const allOrg = orgList.allOrg;
  const duplicateIndicators = await getDuplicateIndicators();
  const technologyStats = await getDatabaseTechnologyStats();

  return (
    <Box>
      <AdminDashboardEnhanced
        mainIndicator={mainData}
        databaseLocations={databaseLocations}
        allOrg={allOrg}
        duplicateIndicators={duplicateIndicators}
        technologyStats={technologyStats}
      />
    </Box>
  );
}

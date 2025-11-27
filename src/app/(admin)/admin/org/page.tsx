import AdminBreadCrumpMenu from "@/components/admin/AdminBreadCrumpMenu";
import AdminOrgList from "@/components/organization/AdminOrgList";

import { Box } from "@mui/material";
const OrganizationPage = async () => {
  const columns = [
    { field: "org_id", headerName: "№", width: 10 },
    { field: "name", headerName: "Байгууллагын нэр", width: 10 },
    {
      field: "org_short_name",
      headerName: "Товчилсон нэр",
      width: 10,
    },
    { field: "email", headerName: "И-мэйл хаяг", width: 10 },
    { field: "website", headerName: "Цахим хуудас", width: 10 },
    { field: "phone_number", headerName: "Утасны дугаар", width: 10 },
    // { field: "is_active", headerName: "Идэвхитэй эсэх", width: 10 },
  ];

  return (
    <Box>
      <Box sx={{ p: 2 }}>
        <AdminBreadCrumpMenu
          type="org"
          menu_name=" Байгууллагын жагсаалт"
          link="/*"
        />
      </Box>
      <AdminOrgList columns={columns} />
    </Box>
  );
};

export default OrganizationPage;

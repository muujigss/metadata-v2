import AdminBreadCrumpMenu from "@/components/admin/AdminBreadCrumpMenu";
import AdminLogList from "@/components/admin/log";

import { Box } from "@mui/material";
const LogPage = async () => {

  return (
    <Box>
      {/* <Box sx={{ p: 2 }}>
        <AdminBreadCrumpMenu
          type="org"
          menu_name=" Лог жагсаалт"
          link="/*"
        />
      </Box> */}
      <AdminLogList />
    </Box>
  );
};

export default LogPage;

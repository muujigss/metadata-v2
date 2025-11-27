import AdminBreadCrumpMenu from "@/components/admin/AdminBreadCrumpMenu";

import { Box } from "@mui/material";

import UserList from "@/components/admin/user/UserList";

const UsersPage = async () => {
  return (
    <Box width={"100%"}>
      <Box sx={{ p: 2 }}>
        <AdminBreadCrumpMenu
          type="user"
          menu_name=" Хэрэглэгчийн жагсаалт"
          link="/*"
        />
      </Box>
      <UserList />
    </Box>
  );
};

export default UsersPage;

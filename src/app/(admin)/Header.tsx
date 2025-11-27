"use client";
import AppBar from "@/components/admin/AppBar";
import Drawer from "@/components/admin/Drawer";
import { logOutUser } from "@/services/UserService";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuIcon from "@mui/icons-material/Menu";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import MailOutlined from "@mui/icons-material/MailOutlined";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MainList from "./MainList";
import useCurrentUser from "@/utils/useCurrentUser";
import { ICurrentUserContext } from "@/utils/context";
import Link from "next/link";
import { useGetUserLevel, useGetUserRole } from "@/utils/customHooks";
import { Kbd } from "flowbite-react";
import { ISpecification } from "@/interfaces/ISpecification";

const Header = () => {
  const [open, setOpen] = useState(true);
  const [openProfile, setOpenProfile] = useState(false);
  const router = useRouter();

  const { userInfo } = useCurrentUser() as ICurrentUserContext;
  let firstname = userInfo?.firstname;
  let lastname = userInfo?.lastname;

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const toggleProfileDrawer = () => {
    setOpenProfile(!openProfile);
  };

  const handleSubmit = async () => {
    const response = await logOutUser();

    if (response.success) {
      localStorage.removeItem("lastname");
      localStorage.removeItem("firstname");
      localStorage.removeItem("user_level");
      localStorage.removeItem("org_id");
      localStorage.removeItem("user_id");
      localStorage.removeItem("org_name");
      localStorage.removeItem("email");

      router.push("/login");
    } else {
      console.log("error");
    }
  };

  return (
    <>
      <AppBar
        position="absolute"
        sx={{ zIndex: 10, left: 0, top: 0, boxShadow: "none" }}
        open={open}
      >
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
            display: "flex",
            justifyContent: "space-between",
            boxShadow: "none",
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className=" uppercase">
              Төрийн мета өгөгдлийн нэгдсэн сан
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              color="secondary"
              variant="text"
              sx={{
                backgroundColor: "#f2e5b7",
                color: "#000",
                display: "flex",
                gap: 1,
                ":hover": {
                  backgroundColor: "primary.light",
                  color: "#fff",
                },
              }}
              onClick={toggleProfileDrawer}
            >
              <Person2RoundedIcon />
              <Typography variant="body1">{firstname}</Typography>
              <Typography variant="body1">{lastname}</Typography>
            </Button>
          </Box>
        </Toolbar>
        {openProfile && (
          <ProfileDrawer
            handleSubmit={handleSubmit}
            openProfile={openProfile}
          />
        )}
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <MainList />
        </List>
      </Drawer>
    </>
  );
};

const ProfileDrawer = ({
  openProfile,
  handleSubmit,
}: {
  openProfile: boolean;
  handleSubmit: any;
}) => {
  const { userInfo } = useCurrentUser();

  const { data: userLevels } = useGetUserLevel();
  const { data: userRoles } = useGetUserRole();

  let roles = userInfo?.roles;

  // console.log({ userLevels, userInfo, userRoles });

  return (
    <Box
      position={"absolute"}
      display={"flex"}
      flexDirection={"column"}
      alignItems="center"
      justifyContent={"center"}
      gap={0.5}
      width={"250px"}
      sx={{
        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
        top: 64,
        right: 0,
        bgcolor: "primary.light",
        p: 2,
        gradient: "linear-gradient(180deg, #E8F7FF 0%, #FFFFFF 100%)",
        ":hover": {
          bgcolor: "primary.dark",
          gradient: "linear-gradient(180deg, #E8F7FF 0%, #FFFFFF 100%)",
        },
      }}
    >
      <Typography variant="caption" sx={{ textAlign: "center" }}>
        {userInfo?.organization?.name}
      </Typography>
      <Typography variant="caption">
        {userLevels?.find((item: any) => item.id == userInfo?.user_level)?.name}
      </Typography>
      <Typography variant="caption" display={"flex"}>
        <MailOutlined fontSize="small" /> {userInfo?.email}
      </Typography>
      <Typography variant="caption" display={"flex"} alignItems={"center"}>
        {roles && roles?.length > 0 && (
          <>
            Хэрэглэгчийн эрх:
            {roles.map((item: any, i: number) => (
              <div className="m-1" key={i}>
                <Kbd className=" font-thin text-text-table-small text-secondary-high">
                  {userRoles?.find(
                    (spec: ISpecification) => spec.id == +item.id
                  )?.name || item.id}
                </Kbd>
              </div>
            ))}
          </>
        )}
      </Typography>

      <Button size="small" color="inherit" onClick={handleSubmit}>
        <Typography variant="caption">Гарах</Typography>
        <LogoutRoundedIcon fontSize="small" />
      </Button>
    </Box>
  );
};
export default Header;

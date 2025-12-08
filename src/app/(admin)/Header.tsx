"use client";
import AppBar from "@/components/admin/AppBar";
import Drawer from "@/components/admin/Drawer";
import { logOutUser } from "@/services/UserService";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuIcon from "@mui/icons-material/Menu";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import MailOutlined from "@mui/icons-material/MailOutlined";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  Skeleton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MainList from "./MainList";
import useCurrentUser from "@/utils/useCurrentUser";
import { ICurrentUserContext } from "@/utils/context";
import { useGetUserLevel, useGetUserRole } from "@/utils/customHooks";
import { Kbd } from "flowbite-react";
import { ISpecification } from "@/interfaces/ISpecification";
import { getNotif, getNotifCount, updateNotif } from "@/services/NotifService";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";

const Header = () => {
  const [open, setOpen] = useState(true);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const router = useRouter();

  const { userInfo } = useCurrentUser() as ICurrentUserContext;
  let firstname = userInfo?.firstname;
  let lastname = userInfo?.lastname;

  useEffect(() => {
    if (userInfo) {
      fetchNotifCount();
    }
  }, [userInfo]);

  const fetchNotifCount = async () => {
    try {
      const data = await getNotifCount(userInfo?.id, userInfo?.user_level);
      if (data) {
        setNotifCount(data?.count);
      }
    } catch (error) {
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const toggleProfileDrawer = () => {
    setOpenProfile(!openProfile);
  };
  const toggleNotifDrawer = () => {
    setOpenNotif(!openNotif);
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

  const handUpdateNotif = async (item: any) => {
    if (Number(userInfo?.user_level) === 1) {
      await updateNotif(userInfo?.id, item.id);
      fetchNotifCount()
      router.push(`/admin/database?org_id=${item?.database?.organization?.id}&id=${item?.database?.id}`);
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
              Төрөлжсөн бүртгэлийн нэгдсэн сан
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }} className="gap-10">
            <div className="flex relative p-3 cursor-pointer hover:bg-[#42a5f5] hover:rounded-xl" onClick={toggleNotifDrawer}>
              <NotificationsNoneIcon className="" />
              <div
                className="absolute -top-0 -right-1 bg-pink-500 text-white font-bold w-7 h-7 flex items-center justify-center rounded-full text-[12px]"
              >
                {notifCount}
              </div>
            </div>
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
        {openNotif && (
          <NotificationDrawer
            handUpdateNotif={handUpdateNotif}
            openNotif={openNotif}
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
const NotificationDrawer = ({
  openNotif,
  handUpdateNotif,
}: {
  openNotif: boolean;
  handUpdateNotif: any;
}) => {
  const { userInfo } = useCurrentUser() as ICurrentUserContext;
  const [isLoading, setIsLoading] = useState(false);
  const [notifList, setNotifList] = useState([]);

  useEffect(() => {
    fetchNotif();
  }, []);

  const fetchNotif = async () => {
    try {
      setIsLoading(true);
      const data = await getNotif(userInfo?.id);
      if (data) {
        setNotifList(data);
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItem = (item: any) => {
    handUpdateNotif(item)
    setNotifList(prev =>
      prev.map(n =>
        n.id === item.id
          ? { ...n, is_view_admin: true }
          : n
      )
    );
  }

  return (
    <div className="w-[280px] absolute right-[250px] top-[64px] bg-[#42a5f5]">
      {
        isLoading
          ? (
            <>
              <Skeleton
                animation="wave"
                variant="rectangular"
                height={100}
                sx={{
                  borderRadius: (theme) => theme.shape.borderRadius / 5,
                }}
              ></Skeleton>
            </>
          )
          : (
              <>
                <div className="flex flex-col overflow-y-auto h-[300px]">
                  { notifList.length === 0 && (
                    <span className="py-2 px-3">Өгөгдөл хоосон.</span>
                  ) }
                  { notifList.map((item: any, i: number) => {
                    return (
                      <div key={i} className={`cursor-pointer flex justify-between py-2 px-3 hover:bg-[#1976d2] border-b 
                        // ${(Number(userInfo?.user_level) === 1 && item.is_view_admin) || (Number(userInfo?.user_level) === 2 && item.is_view_user) ? 'bg-[#1976d2]' : 'bg-[#42a5f5]'}
                        ${(item.is_view_admin) ? 'bg-[#1976d2]' : 'bg-[#42a5f5]'}
                        `}
                        onClick={() => handleUpdateItem(item)}
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px]">{moment(item?.created_date).format("YYYY-MM-DD")}</span>
                          <span className="text-[12px] font-bold">{item?.text}</span><br />
                          <span className="text-[10px]">{item?.database?.name}</span>
                        </div>
                        <div className="pt-2">
                          {
                            // Number(userInfo?.user_level) === 1 && item.is_view_admin
                            item.is_view_admin
                              ? (
                                  <RadioButtonCheckedIcon fontSize="small" />
                                )
                              : (
                                <RadioButtonUncheckedIcon fontSize="small" />
                              )
                          }
                        </div>
                      </div>
                    )
                  }) }
                </div>
              </>
          )
      }
    </div>
  );
};
export default Header;

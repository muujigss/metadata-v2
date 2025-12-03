"use client";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import React from "react";
import Building2FillIcon from "remixicon-react/Building2FillIcon";
import DashboardFillIcon from "remixicon-react/DashboardFillIcon";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
import QuestionLineIcon from "remixicon-react/QuestionLineIcon";
import ChatHistoryLineIcon from "remixicon-react/ChatHistoryLineIcon";
import VideoLineIcon from "remixicon-react/VideoLineIcon";
import InformationFillIcon from "remixicon-react/InformationFillIcon";
import User2FillIcon from "remixicon-react/User2FillIcon";
import Settings3LineIcon from "remixicon-react/Settings3LineIcon";
import GitPullRequestFillIcon from "remixicon-react/GitPullRequestFillIcon";
import FileCopyLineIcon from "remixicon-react/FileCopyLineIcon";
import useCurrentUser from "@/utils/useCurrentUser";
import { Tooltip } from "@mui/material";
import { usePathname } from "next/navigation";

const MainList = () => {
  let { userInfo } = useCurrentUser();
  let pathname = usePathname();
  // console.log({ pathname });

  return (
    <React.Fragment>
      <Link href={"/admin/dashboard"}>
        <Tooltip title={"Дашбоард"}>
          <ListItemButton
            sx={{
              backgroundColor:
                pathname == "/admin/dashboard" ? "aliceblue" : "",
            }}
          >
            <ListItemIcon>
              <DashboardFillIcon color="#518df9" />
            </ListItemIcon>
            <ListItemText primary={"Дашбоард"} />
          </ListItemButton>
        </Tooltip>
      </Link>
      {userInfo?.user_level == 1 && (
        <Link href={"/admin/org"}>
          <Tooltip title={"Байгууллага"}>
            <ListItemButton
              sx={{
                backgroundColor: pathname == "/admin/org" ? "aliceblue" : "",
              }}
            >
              <ListItemIcon>
                <Building2FillIcon color="#518df9" />
              </ListItemIcon>
              <ListItemText primary={"Байгууллага"} />
            </ListItemButton>
          </Tooltip>
        </Link>
      )}
      {userInfo?.user_level != 1 && (
        <Link href={"/admin/database"}>
          <Tooltip title={"Өгөгдлийн сан"}>
            <ListItemButton
              sx={{
                backgroundColor:
                  pathname == "/admin/database" ? "aliceblue" : "",
              }}
            >
              <ListItemIcon>
                <Database2FillIcon color="#518df9" />
              </ListItemIcon>
              <ListItemText primary={"Өгөгдлийн сан"} />
            </ListItemButton>
          </Tooltip>
        </Link>
      )}
      {(userInfo?.user_level == 1 || userInfo?.user_level == 2) && (
        <Link href={"/admin/user"}>
          <Tooltip title={"Хэрэглэгч"}>
            <ListItemButton
              sx={{
                backgroundColor: pathname == "/admin/user" ? "aliceblue" : "",
              }}
            >
              <ListItemIcon>
                <User2FillIcon color="#518df9" />
              </ListItemIcon>
              <ListItemText primary={"Хэрэглэгч"} />
            </ListItemButton>
          </Tooltip>
        </Link>
      )}
      
      {userInfo?.user_level == 1 && (
        <Link href={"/admin/request"}>
          <Tooltip title={"Хүсэлт"}>
            <ListItemButton
              sx={{
                backgroundColor:
                  pathname == "/admin/request" ? "aliceblue" : "",
              }}
            >
              <ListItemIcon>
                <GitPullRequestFillIcon color="#518df9" />
              </ListItemIcon>   
              <ListItemText primary={"Хүсэлт"} />
            </ListItemButton>
          </Tooltip>
        </Link>
      )}
      {(userInfo?.user_level == 1) && (
        <Link href={"/admin/org-request"}>
          <Tooltip title={"Байгууллагын хүсэлт"}>
            <ListItemButton
              sx={{
                backgroundColor:
                  pathname == "/admin/org-request" ? "aliceblue" : "",
              }}
            >
              <ListItemIcon>
                <GitPullRequestFillIcon color="#518df9" />
              </ListItemIcon>   
              <ListItemText primary={"Байгууллагын хүсэлт"} />
            </ListItemButton>
          </Tooltip>
        </Link>
      )}
      {userInfo?.user_level == 1 && (
        <Link href={"/admin/log"}>
          <Tooltip title={"Лог"}>
            <ListItemButton
              sx={{
                backgroundColor: pathname == "/admin/log" ? "aliceblue" : "",
              }}
            >
              <ListItemIcon>
                <ChatHistoryLineIcon color="#518df9" />
              </ListItemIcon>
              <ListItemText primary={"Лог"} />
            </ListItemButton>
          </Tooltip>
        </Link>
      )}
      {userInfo?.user_level == 1 && (
        <Link href={"/admin/duplicate"}>
          <Tooltip title={"Давхцалын цэс"}>
            <ListItemButton
              sx={{
                backgroundColor:
                  pathname == "/admin/duplicate" ? "aliceblue" : "",
              }}
            >
              <ListItemIcon>
                <FileCopyLineIcon color="#518df9" />
              </ListItemIcon>
              <ListItemText primary={"Давхцалын цэс"} />
            </ListItemButton>
          </Tooltip>
        </Link>
      )}
      <Link href={"/juram"}>
        <Tooltip title={"Журам"}>
          <ListItemButton
            sx={{
              backgroundColor: pathname == "/juram" ? "aliceblue" : "",
            }}
          >
            <ListItemIcon>
              <InformationFillIcon color="#518df9" />
            </ListItemIcon>
            <ListItemText primary={"Журам"} />
          </ListItemButton>
        </Tooltip>
      </Link>
      <Link href={"/guide"}>
        <Tooltip title={"Заавар"}>
          <ListItemButton
            sx={{
              backgroundColor: pathname == "/guide" ? "aliceblue" : "",
            }}
          >
            <ListItemIcon>
              <QuestionLineIcon color="#518df9" />
            </ListItemIcon>
            <ListItemText primary={"Заавар"} />
          </ListItemButton>
        </Tooltip>
      </Link>
      <Link href={"/videos"}>
        <Tooltip title={"Видео заавар"}>
          <ListItemButton
            sx={{
              backgroundColor: pathname == "/videos" ? "aliceblue" : "",
            }}
          >
            <ListItemIcon>
              <VideoLineIcon color="#518df9" />
            </ListItemIcon>
            <ListItemText primary={"Видео заавар"} />
          </ListItemButton>
        </Tooltip>
      </Link>
      <Link href="/admin/user/change-password">
        <Tooltip title={"Нууц үг солих"}>
          <ListItemButton
            sx={{
              backgroundColor:
                pathname == "/admin/user/change-password" ? "aliceblue" : "",
            }}
          >
            <ListItemIcon>
              <Settings3LineIcon color="#518df9" />
            </ListItemIcon>
            <ListItemText primary={"Тохиргоо"} />
          </ListItemButton>
        </Tooltip>
      </Link>
    </React.Fragment>
  );
};

export default MainList;

"use client";
import ResetPasswordButton from "./ResetPasswordButton";
import Loader from "@/components/Loader";
import User from "@/components/user/User";
import UserEditBar from "@/components/user/UserEditBar";
// import User from "@/components/user/User";
import { ISource } from "@/interfaces/ILib";
import { IUser } from "@/interfaces/IUser";
import { getUserService } from "@/services/UserService";
import CurrentUserContext, { ICurrentUserContext } from "@/utils/context";
import { useGetUserLevel, useGetUserRole } from "@/utils/customHooks";
import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useContext } from "react";
import UserAddLineIcon from "remixicon-react/UserAddLineIcon";
import { textSubInputTheme } from "@/components/componentTheme/SearchTheme";
import { Badge, TextInput, Button } from "flowbite-react";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
const UserList = () => {
  const { userInfo, setUserInfo } = useContext(
    CurrentUserContext
  ) as ICurrentUserContext;
  const [openModal, setOpenModal] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    { field: "id", headerName: "№", width: 55 },
    { field: "user_level", headerName: "Хэрэглэгчийн түвшин", width: 150 },
    { field: "org_id", headerName: "Байгууллагын нэр", width: 240 },
    { field: "lastname", headerName: "Овог", width: 120 },
    { field: "firstname", headerName: "Нэр", width: 120 },
    { field: "department", headerName: "Хэлтэс", width: 170 },
    { field: "position", headerName: "Албан тушаал", width: 180 },
    { field: "phone_number", headerName: "Утасны дугаар", width: 130 },
    { field: "mobile", headerName: "Гар утасны дугаар", width: 130 },
    { field: "email", headerName: "И-мэйл хаяг", width: 230 },
    { field: "roles", headerName: "Хэрэглэгчийн эрх", width: 180 },
    { field: "Edit", headerName: "Засах", width: 85 },
    { field: "reset", headerName: "Нууц үг", width: 170 },
  ];
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  let userLevel = userInfo?.user_level || 0;
  let orgId = userInfo?.org_id || 0;

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users" + userLevel + orgId],
    queryFn: () => getUserService(Number(userLevel), Number(orgId)),
  });

  const {
    data: userRoles,
    isLoading: roleLoading,
    isError: roleError,
  } = useGetUserRole();

  const {
    data: userLevels,
    isLoading: levelLoading,
    isError: levelError,
  } = useGetUserLevel();

  if (isLoading) return <Loader />;
  if (isError) return <p>Алдаа гарлаа</p>;

  if (levelLoading) return <Loader />;
  if (levelError) return <p>Алдаа гарлаа</p>;

  if (roleLoading) return <Loader />;
  if (roleError) return <p>Алдаа гарлаа</p>;

  const handleOpenModal = (data: any) => {
    setOpenModal(!openModal);
  };
  const filteredUsers = userData?.filter((user: IUser) =>
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
        <Typography variant="h6">Хэрэглэгчийн жагсаалт</Typography>
        <Box>
          <Button
            className="text-[#518df9] border border-[#518df9] mr-3"
            size="xs"
            onClick={handleOpenModal}
          >
            <UserAddLineIcon size={24} />
            Хэрэглэгч
          </Button>
          {openModal && (
            <User
              openModal={openModal}
              setOpenModal={setOpenModal}
              userId={0}
            />
          )}
        </Box>
      </Box>


      <div className="w-full md:w-1/3 pb-4">
        <div className="relative w-full">
          <TextInput
            className="w-full py-1.5"
            theme={textSubInputTheme}
            placeholder="Хэрэглэгч хайх..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
          />
  
          <Button
            color="grey"
            size="xs"
            onClick={() => { setSearchTerm(""); setPage(0); }}
            className="absolute top-0 right-0 p-2 my-1"
          >
            {searchTerm ? <CloseLineIcon size={16} /> : <SearchLineIcon size={16} />}
          </Button>
        </div>
      </div>

      <TableContainer sx={{ height: 620, overflow: "auto", scrollbarGutter: "stable" }}>
        <Table stickyHeader sx={{ tableLayout: "fixed", minWidth: 1965, "& td": { overflowWrap: "anywhere", verticalAlign: "top" } }}>
          <TableHead>
            <TableRow>
              {columns?.map((column: any, i: number) => {
                return (
                  <TableCell
                    key={i}
                    scope="col"
                    sx={{
                      textAlign: "center",
                      width: column?.width,
                      background: "#518df9",
                      color: "white",
                    }}
                  >
                    {column?.headerName}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers &&
  filteredUsers
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((item: IUser, i: number) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                      <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                      <TableCell> {item.userLevel?.name}</TableCell>
                      <TableCell> {item.organization?.name}</TableCell>
                      <TableCell> {item.lastname}</TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/user/${item.id}`}
                          className=" text-primary-default hover:underline"
                        >
                          {item.firstname}
                        </Link>
                      </TableCell>
                      <TableCell> {item.department}</TableCell>
                      <TableCell> {item.position}</TableCell>
                      <TableCell> {item.phone_number}</TableCell>
                      <TableCell> {item.mobile}</TableCell>
                      <TableCell> {item.email}</TableCell>
                      <TableCell>
                        {item?.roles &&
                          item?.roles?.map((item: any, i: number) => (
                            <Badge
                              key={i}
                              color="gray"
                              style={{ textAlign: "center" }}
                            >
                              <span className=" font-medium text-text-body-small">
                                {userRoles?.find(
                                  (spec: ISource) => spec?.id == +item?.id
                                )?.name || item?.id}
                              </span>
                            </Badge>
                          ))}
                      </TableCell>
                      <TableCell>
                        {item.id !== undefined && <UserEditBar userId={item.id} type="list" />}
                      </TableCell>
                      <TableCell>{!!item.id && !!item.email && item.is_active && ((Number(userLevel) === 1 && [2, 3].includes(Number(item.user_level))) || (Number(userLevel) === 2 && Number(item.user_level) === 3 && item.org_id === Number(orgId))) && <ResetPasswordButton userId={item.id} email={item.email} />}</TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>

        </Table>
      </TableContainer>
      <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                labelRowsPerPage={"Хуудас бүр дэх мөрийн тоо"}
                component="div"
                count={filteredUsers?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActions}
              />
    </Box>
  );
};

export default UserList;

"use client";
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
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "flowbite-react";
import Link from "next/link";
import React, { useContext } from "react";
import UserAddLineIcon from "remixicon-react/UserAddLineIcon";
import { textSubInputTheme } from "@/components/componentTheme/SearchTheme";
import {  TextInput } from "flowbite-react";
const UserList = () => {
  const { userInfo, setUserInfo } = useContext(
    CurrentUserContext
  ) as ICurrentUserContext;
  const [openModal, setOpenModal] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    { field: "id", headerName: "№", width: 10 },
    { field: "user_level", headerName: "Хэрэглэгчийн түвшин", width: 400 },
    { field: "org_id", headerName: "Байгууллагын нэр", width: 400 },
    { field: "lastname", headerName: "Овог", width: 10 },
    { field: "firstname", headerName: "Нэр", width: 10 },
    { field: "department", headerName: "Хэлтэс", width: 10 },
    { field: "position", headerName: "Албан тушаал", width: 10 },
    { field: "phone_number", headerName: "Утасны дугаар", width: 10 },
    { field: "mobile", headerName: "Гар утасны дугаар", width: 10 },
    { field: "email", headerName: "И-мэйл хаяг", width: 10 },
    { field: "roles", headerName: "Хэрэглэгчийн эрх", width: 10 },
    { field: "Edit", headerName: "Засах", width: 10 },
    // { field: "Delete", headerName: "Устгах", width: 10 },
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
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
        <Box sx={{ width: "70%", mb: 2 }}>
        <TextInput
          className="w-full py-1.5 truncate"
          theme={textSubInputTheme}
          id="search"
          type="text"
          placeholder="Хэрэглэгч хайх..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>


        <Box>
          <Button
            sx={{
              border: "1px solid #518df9",
              color: "#518df9",
              display: "flex",
            }}
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

      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader>
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                      <TableCell>{i + 1}</TableCell>
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
                      <TableCell> {item.email}</TableCell>
                      <TableCell> {item.phone_number}</TableCell>
                      <TableCell> {item.mobile}</TableCell>
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
                        <UserEditBar userId={item?.id} type="list" />
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                labelRowsPerPage={"Хуудас бүр дэх мөрийн тоо"}
                colSpan={11}
                count={userData && userData?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;

"use client";
import React, { useState, Suspense } from "react";
import { getOrganization } from "@/services/OrganizationService";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
} from "@mui/material";
import {  TextInput } from "flowbite-react";
import AddOrganization from "./AddOrganization";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import FileExcel2LineIcon from "remixicon-react/FileExcel2LineIcon";
import { IOrganization } from "@/interfaces/IOrganization";
import { textSubInputTheme } from "../componentTheme/SearchTheme";
const AdminOrgList = ({ columns }: { columns: any }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["orgs for admin"],
    queryFn: () => getOrganization(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  if (isLoading) return <Loader />;
  const filteredData = data?.filter((org: IOrganization) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
        <Typography variant="h5">Байгууллагын жагсаалт</Typography>
        <div className="flex gap-2 mr-1">
          <Box>
            <AddOrganization />
          </Box>
          <Button
            sx={{
              border: "1px solid #518df9",
              color: "#518df9",
              display: "flex",
            }}
            startIcon={<FileExcel2LineIcon size={24} />}
          >
            татах
          </Button>
        </div>
      </Box>
       <TextInput
        className="w-full py-1.5 truncate"
        theme={textSubInputTheme}
        id="search"
        type="text"
        placeholder="Байгууллагын нэрээр хайх..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Suspense fallback={<Loader />}>
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
              {filteredData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item: IOrganization, i: number) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                    <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                    <TableCell>
                      {item?.img_url ? (
                        <img 
                          src={item?.img_url} 
                          alt="Logo" 
                          className="w-12 h-12 object-contain rounded border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                          No logo
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/database?org=${item.id}`}>
                        <Typography
                          sx={{
                            textTransform: "uppercase",
                            color: "#518df9",
                            display: "flex",
                          }}
                        >
                          {item.name}
                          <ArrowRightSLineIcon />
                        </Typography>
                      </Link>
                    </TableCell>
                    <TableCell>{item.org_short_name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.website}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredData?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Хуудас дахь мөр:"
        />
      </Suspense>
    </Box>
  );
};

export default AdminOrgList;

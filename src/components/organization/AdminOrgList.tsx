"use client";
import React, { useState, Suspense } from "react";
import { getOrganization } from "@/services/OrganizationService";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  
} from "@mui/material";
import {  TextInput } from "flowbite-react";
import AddOrganization from "./AddOrganization";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import { IOrganization } from "@/interfaces/IOrganization";
import { textSubInputTheme } from "../componentTheme/SearchTheme";
const AdminOrgList = ({ columns }: { columns: any }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["orgs for admin"],
    queryFn: () => getOrganization(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  if (isLoading) return <Loader />;
  const filteredData = data?.filter((org: IOrganization) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
        <Typography variant="h5">Байгууллагын жагсаалт</Typography>
        <Box>
          <AddOrganization />
        </Box>
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
  {filteredData?.map((item: IOrganization, i: number) => {
    return (
      <TableRow hover role="checkbox" tabIndex={-1} key={i}>
        <TableCell>{i + 1}</TableCell>
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
      </Suspense>
    </Box>
  );
};

export default AdminOrgList;

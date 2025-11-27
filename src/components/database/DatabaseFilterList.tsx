"use client";
import React, { useState } from "react";
import { TextInput } from "flowbite-react";
import DbList from "./DbList";
import { useQuery } from "@tanstack/react-query";
import { getDatabase } from "@/services/DatabaseService";
import Loader from "../Loader";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import { textInputTheme } from "../componentTheme/SearchTheme";
import DatabaseSideBar from "./DatabaseSideBar";
import { IDatabase } from "@/interfaces/IDatabase";
import { useGetDbType, useGetOrgs, useGetSectors } from "@/utils/customHooks";

const DatabaseFilterList = ({ id, code }: any) => {
  const [selectDatabaseType, setSelectDatabaseType] = useState(0);
  const [selectSector, setSelectSector] = useState(
    code === undefined ? "" : code
  );
  const [searchText, setSearchText] = useState("");
  const [selectOrg, setSelectOrg] = useState(id === undefined ? 0 : id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["fetch database"],
    queryFn: () => getDatabase(1),
    refetchOnWindowFocus: true,
  });

  const { data: sector } = useGetSectors();
  const { data: databaseType } = useGetDbType();
  const { data: orgs } = useGetOrgs();

  const filteredData =
    searchText == ""
      ? data?.data
      : data?.data.filter((item: IDatabase) =>
          item?.name.toLowerCase().includes(searchText.toLowerCase())
        );

  const sectorFilter = sector?.filter((item: any) => {
    if (searchText == "") {
      return filteredData?.filter(
        (itemData: any) => itemData?.sector == item?.id
      );
    } else {
      return (
        filteredData?.filter((itemData: any) => itemData?.sector == item?.id)
          .length > 0
      );
    }
  });
  const dbFilter = databaseType?.filter((item: any) => {
    if (searchText == "") {
      return filteredData?.filter(
        (itemData: any) => itemData?.db_type == item?.id
      );
    } else {
      return (
        filteredData?.filter((itemData: any) => itemData?.db_type == item?.id)
          .length > 0
      );
    }
  });
  const orgFilter = orgs?.filter((item: any) => {
    if (searchText == "") {
      return filteredData?.filter(
        (itemData: any) => itemData?.org_id == item?.id
      );
    } else {
      return (
        filteredData?.filter((itemData: any) => itemData?.org_id == item?.id)
          .length > 0
      );
    }
  });

  const searchIcon = () => {
    return <SearchLineIcon color="#005baa" size={16} />;
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filterList = filteredData?.filter((item: IDatabase) => {
    return (
      (item?.db_type == selectDatabaseType || selectDatabaseType == 0) &&
      (item?.sector == selectSector || selectSector == "") &&
      (selectOrg == 0 || item?.org_id == selectOrg)
    );
  });

  if (isLoading) return <Loader />;
  if (error) return <p>Ачааллаж байна ...</p>;
  return (
    <div className="container justify-between py-8">
      <div className="flex flex-row items-start self-stretch gap-4">
        <div className="w-1/3 h-full">
          <div className="w-full pb-4 text-text-body-meduim text-secondary-default">
            <TextInput
              theme={textInputTheme}
              id="search"
              type="text"
              rightIcon={searchIcon}
              placeholder="Өгөгдлийн сангаар хайх..."
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
          <DatabaseSideBar
            sector={sectorFilter}
            selectSector={selectSector}
            setSelectSector={setSelectSector}
            databaseType={dbFilter}
            selectDatabaseType={selectDatabaseType}
            setSelectDatabaseType={setSelectDatabaseType}
            organization={orgFilter}
            selectOrg={selectOrg}
            setSelectOrg={setSelectOrg}
            filterList={filteredData}
          />
        </div>
        <div className="w-full h-full">
          <DbList data={filterList} />
        </div>
      </div>
    </div>
  );
};

export default DatabaseFilterList;

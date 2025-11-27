"use client";
import { ITable } from "@/interfaces/ITable";
import { useGetOrgs, useGetSectors } from "@/utils/customHooks";
import { TextInput } from "flowbite-react";
import React, { useState } from "react";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import { textInputTheme } from "../componentTheme/SearchTheme";
import TList from "./TList";
import TableSidebar from "./TableSidebar";

const TablePage = ({ data }: { data: ITable[] }) => {
  const [selectSector, setSelectSector] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectOrg, setSelectOrg] = useState(0);

  const { data: sector } = useGetSectors();
  const { data: orgs } = useGetOrgs();

  const filteredData =
    searchText == ""
      ? data
      : data.filter((item: ITable) =>
          item?.tbl_name.toLowerCase().includes(searchText.toLowerCase())
        );
  const orgFilter = orgs?.filter((item: any) => {
    if (searchText == "") {
      return filteredData?.filter(
        (itemData: any) =>
          itemData?.database?.organization?.org_id == item?.org_id
      );
    } else {
      return (
        filteredData?.filter(
          (itemData: any) =>
            itemData?.database?.organization?.org_id == item?.org_id
        ).length > 0
      );
    }
  });
  const sectorFilter = sector?.filter((item: any) => {
    if (searchText == "") {
      return filteredData?.filter(
        (itemData: any) => itemData?.database?.sectors?.code == item?.code
      );
    } else {
      return (
        filteredData?.filter(
          (itemData: any) => itemData?.database?.sectors?.code == item?.code
        ).length > 0
      );
    }
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const searchIcon = () => {
    return <SearchLineIcon color="#005baa" size={16} />;
  };

  const filterList = filteredData?.filter((item: any) => {
    return (
      (item?.database?.sectors?.code == selectSector || selectSector == "") &&
      (item?.database?.organization?.org_id == selectOrg || selectOrg == 0)
    );
  });

  return (
    <div className="container py-8 ">
      <div className="flex flex-row items-start self-stretch gap-4">
        <div className="w-1/3 h-full">
          <div className="w-full pb-4 text-text-body-meduim text-secondary-default">
            <TextInput
              theme={textInputTheme}
              id="search"
              type="text"
              rightIcon={searchIcon}
              placeholder="Хүснэгтийн нэрээр хайх..."
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
          <TableSidebar
            filterList={filteredData}
            sector={sectorFilter}
            selectSector={selectSector}
            setSelectSector={setSelectSector}
            organization={orgFilter}
            selectOrg={selectOrg}
            setSelectOrg={setSelectOrg}
          />
        </div>

        <div className={`${"w-full h-full"}`}>
          <TList
            currentPage={currentPage}
            searchText={searchText}
            orgId={orgText}
            sectorId={sectorText}
          />
        </div>
      </div>
    </div>
  );
};
export default TablePage;

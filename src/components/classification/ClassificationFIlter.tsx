"use client";
import React, { useState } from "react";
import { TextInput } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import { getClassification } from "@/services/ClassificationService";
import ClassificationList from "./ClassificationList";
import { textInputTheme } from "../componentTheme/SearchTheme";
import { IClassification } from "@/interfaces/IClassification";
import ClassificationSidebar from "./ClassificationSideBar";
import { useGetOrgs, useGetSectors } from "@/utils/customHooks";
import { TotalOrganization, TotalSector } from "../TotalValue";

const ClassificationFilter = () => {
  const [searchText, setSearchText] = useState("");
  const [selectSector, setSelectSector] = useState("");
  const [selectOrg, setSelectOrg] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["fetch database"],
    queryFn: () => getClassification(),
    refetchOnWindowFocus: true,
  });
  const { data: sector } = useGetSectors();
  const { data: orgs } = useGetOrgs();

  const searchIcon = () => {
    return <SearchLineIcon color="#005baa" size={16} />;
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const filteredData =
    searchText == ""
      ? data
      : data.filter((item: IClassification) =>
          item?.name?.toLowerCase().includes(searchText.toLowerCase())
        );
  const orgFilter = orgs?.filter((item: any) => {
    if (searchText == "") {
      return filteredData?.filter(
        (itemData: any) =>
          itemData?.indicators[0]?.indicator.table.database.organization_id ==
          item?.org_id
      );
    } else {
      return (
        filteredData &&
        filteredData?.filter(
          (itemData: IClassification) =>
            itemData?.indicators[0]?.indicator.table.database.organization_id ==
            item?.org_id
        ).length > 0
      );
    }
  });

  const sectorFilter = sector?.filter((item: any) => {
    if (searchText == "") {
      return filteredData?.filter(
        (itemData: IClassification) =>
          itemData?.indicators[0]?.indicator.table.database.sector == item?.code
      );
    } else {
      return (
        filteredData &&
        filteredData?.filter(
          (itemData: IClassification) =>
            itemData?.indicators[0]?.indicator.table.database.sector ==
            item?.code
        ).length > 0
      );
    }
  });
  const filterList = filteredData?.filter((item: IClassification) => {
    return (
      (item?.indicators[0]?.indicator.table.database.sector == selectSector ||
        selectSector == "") &&
      (selectOrg == 0 ||
        item?.indicators[0]?.indicator.table.database.organization_id ==
          selectOrg)
    );
  });

  if (isLoading) return <Loader />;
  if (error) return <p>Ачааллаж байна ...</p>;
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
              placeholder="Ангилал кодын нэрээр хайх..."
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
          <ClassificationSidebar
            sector={sectorFilter}
            selectSector={selectSector}
            setSelectSector={setSelectSector}
            organization={orgFilter}
            selectOrg={selectOrg}
            setSelectOrg={setSelectOrg}
            filterList={filteredData}
          />
        </div>
        <div className="w-full h-full">
          <ClassificationList
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

export default ClassificationFilter;

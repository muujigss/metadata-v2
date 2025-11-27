"use client";
import { IForm } from "@/interfaces/IForm";
import { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import FormList from "./FormList";

const FormListPage = ({ data }: any) => {
  const [selectSector, setSelectSector] = useState("");
  const [selectOrg, setSelectOrg] = useState(0);
  const [searchText, setSearchText] = useState("");

  const filteredData =
    searchText == ""
      ? data
      : data.filter((item: IForm) =>
          item?.name.toLowerCase().includes(searchText.toLowerCase())
        );

  const filterList = filteredData?.filter((item: any) => {
    return (
      (item?.database?.sectors?.code == selectSector || selectSector == "") &&
      (selectOrg == 0 || item?.database?.organization?.org_id == selectOrg)
    );
  });

  return (
    <div className=" w-full flex py-5 gap-2">
      <div className="w-1/3">
        <FilterSidebar
          data={filteredData}
          searchText={searchText}
          setSearchText={setSearchText}
          selectSector={selectSector}
          setSelectSector={setSelectSector}
          selectOrg={selectOrg}
          setSelectOrg={setSelectOrg}
        />
      </div>

      <div className={"w-full"}>
        <FormList data={filterList} />
      </div>
    </div>
  );
};
export default FormListPage;

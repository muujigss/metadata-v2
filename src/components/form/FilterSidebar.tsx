"use client";
import { Button, TextInput } from "flowbite-react";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import OrganizationSideBar from "../OrganizationSidebar";
import SectorSidebar from "../SectorSidebar";
import { textInputTheme } from "../componentTheme/SearchTheme";

type IFilterSidebarProps = {
  setSelectOrg?: (id: number) => void;
  setSelectSource?: (id: number) => void;
  setSelectSector?: (id: string) => void;
  selectOrg?: number;
  selectSource?: number;
  selectSector?: string;
  data: any;
  searchText?: string;
  setSearchText?: any;
};

const FilterSidebar = ({ data }: IFilterSidebarProps) => {
  const { dataByOrg, dataBySector } = data;

  const pathname = usePathname();
  const searchParams: any = useSearchParams();
  const { replace } = useRouter();
  const searchText = searchParams.get("query") || "";

  const searchIcon = () => {
    return <SearchLineIcon color="#005baa" size={16} />;
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const params = new URLSearchParams(searchParams);
    if (value.length == 0) {
      params.delete("query");
    } else {
      params.set("query", value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const clearAllFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    params.delete("org");
    params.delete("sector");

    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="w-full md:w-1/3 h-full">
      <div className="w-full pb-4 text-text-body-meduim text-secondary-default flex justify-between items-center">
        <div className="relative w-full">
          <TextInput
            theme={textInputTheme}
            id="search"
            type="text"
            placeholder="Маягтын нэрээр хайх..."
            value={searchText}
            onChange={handleSearchChange}
          />
          <Button
            color={"grey"}
            size={"xs"}
            onClick={clearAllFilter}
            className="absolute top-0 right-0 p-2 my-1 inline-flex items-center text-text-body-small justify-center"
          >
            {searchText == "" ? (
              <SearchLineIcon color="#333a3f" size={16} />
            ) : (
              <CloseLineIcon color="#333a3f" size={16} />
            )}
          </Button>
        </div>
      </div>
      <div>
        <OrganizationSideBar organization={dataByOrg} />
        {dataBySector && <SectorSidebar sector={dataBySector} />}
      </div>
    </div>
  );
};

export default FilterSidebar;

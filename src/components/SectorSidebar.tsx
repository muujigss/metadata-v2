"use client";
import { ISector } from "@/interfaces/ISector";
import { Accordion, ListGroup, TextInput } from "flowbite-react";
import React, { useState } from "react";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import { accordionTheme } from "./componentTheme/AccordionTheme";
import { textSubInputTheme } from "./componentTheme/SearchTheme";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SectorSidebar = ({ sector }: { sector: ISector[] }) => {
  const [sectorSearch, setSectorSearch] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const sectorText = searchParams.get("sector") || "";

  const sectorSearchData =
    sectorSearch == ""
      ? sector
      : sector?.filter((item: any) => {
          return item?.name.toLowerCase().includes(sectorSearch.toLowerCase());
        });

  const handleSectorSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSectorSearch(event.target.value);
  };

  const handleSectorCancel = () => {
    setSectorSearch("");
    // setSelectSector("");
  };

  const onClickOnSector = (sector: string) => {
    const params = new URLSearchParams(searchParams);
    if (sector.length == 0) {
      params.delete("sector");
    } else {
      params.set("sector", sector);
    }
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Accordion className="bg-white mb-1" theme={accordionTheme} collapseAll>
      <Accordion.Panel>
        <Accordion.Title className="focus:ring-1 hover:bg-primary-high hover:text-primary-background p-2">
          Салбар
        </Accordion.Title>
        <Accordion.Content className="text-text-body-medium2 p-0">
          <div className="relative w-full h-full">
            <TextInput
              className="w-full py-1.5 "
              theme={textSubInputTheme}
              id="search"
              type="text"
              placeholder="Салбарын нэрээр хайх..."
              value={sectorSearch}
              onChange={handleSectorSearchChange}
            />
            <button
              type="submit"
              className="absolute top-0 end-0 p-2 my-1.5 inline-flex items-start text-text-body-small justify-center"
              onClick={handleSectorCancel}
            >
              {sectorSearch == "" ? (
                <SearchLineIcon color="#333a3f" size={16} />
              ) : (
                <CloseLineIcon color="#333a3f" size={16} />
              )}
              <span className="sr-only">Search</span>
            </button>
          </div>
          {sectorSearchData?.length > 0 ? (
            <ListGroup className="rounded-none">
              <ListGroup.Item
                className={`${
                  sectorText === ""
                    ? "active bg-secondary-background"
                    : "text-text-body-medium2"
                }`}
                onClick={() => onClickOnSector("")}
              >
                <div className="flex flex-1 items-start">Бүгд</div>
                {/* <div
                  className={
                    "inline-flex items-center px-1 rounded" +
                    `${
                      sectorText === ""
                        ? " bg-primary-default text-table-default"
                        : ""
                    }`
                  }
                >
                  {sectorSearchData.reduce((a, b) => a + b?.data_count, 0)}
                </div> */}
              </ListGroup.Item>
              {sectorSearchData
                ?.filter((item: any) => item?.data_count > 0)
                ?.map((sectorData: ISector, i: any) => {
                  return (
                    <ListGroup.Item
                      key={i}
                      onClick={() =>
                        onClickOnSector(sectorData?.id?.toString())
                      }
                      className={`${
                        sectorText == sectorData?.id?.toString()
                          ? "active bg-secondary-background"
                          : " text-text-body-medium2"
                      }`}
                    >
                      <div className="flex flex-1 items-start">
                        <p className="text-start">{sectorData?.name}</p>
                      </div>
                      <div
                        className={
                          "inline-flex items-center px-1 rounded" +
                          `${
                            sectorText === sectorData?.id?.toString()
                              ? " bg-primary-default text-table-default"
                              : ""
                          }`
                        }
                      >
                        {" " + sectorData?.data_count}
                      </div>
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
          ) : (
            <div className="text-text-body-medium2">Салбар олдсонгүй...</div>
          )}
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
};
export default SectorSidebar;

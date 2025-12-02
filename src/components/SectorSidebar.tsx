"use client";
import { ISector } from "@/interfaces/ISector";
import { Accordion, ListGroup, TextInput } from "flowbite-react";
import React, { useState } from "react";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import { accordionTheme } from "./componentTheme/AccordionTheme";
import { listGroupTheme } from "./componentTheme/ListGroupTheme";
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

  const customAccordionTheme = {
    ...(accordionTheme || {}),
    root: {
      ...(accordionTheme?.root || {}),
      base: "divide-y divide-secondary-background border-secondary-background bg-[#3D4E6C26]",
    },
    content: {
      ...(accordionTheme?.content || {}),
      base: "first:rounded-t-lg last:rounded-b-lg bg-transparent",
    },
    title: {
      ...(accordionTheme?.title || {}),
      base: "flex w-full items-center justify-between p-2 first:rounded-t-lg last:rounded-b-lg bg-[#3D4E6C26]",
      flush: {
        ...(accordionTheme?.title?.flush || {}),
        off: "hover:bg-white/10 focus:ring-2 focus:ring-primary-default focus:outline-none bg-[#3D4E6C26]",
      },
      open: {
        ...(accordionTheme?.title?.open || {}),
        on: "bg-[#3D4E6C26] text-white",
      },
    },
  };

  const customListGroupTheme = {
    ...(listGroupTheme || {}),
    root: {
      ...(listGroupTheme?.root || {}),
      base: "list-none bg-transparent text-left text-sm font-medium text-white",
    },
    item: {
      ...(listGroupTheme?.item || {}),
      base: "[&>*]:first:rounded-t-lg [&>*]:last:rounded-b-lg [&>*]:last:border-b-0",
      link: {
        base: "flex w-full items-center p-2 cursor-pointer",
        active: {
          off: "hover:bg-white/10 focus:outline-none",
          on: "bg-transparent",
        },
      },
    },
  };

  const customTextInputTheme = {
    ...(textSubInputTheme || {}),
    field: {
      ...(textSubInputTheme?.field || {}),
      input: {
        ...(textSubInputTheme?.field?.input || {}),
        colors: {
          ...(textSubInputTheme?.field?.input?.colors || {}),
          gray: "text-white border-transparent bg-transparent focus:bg-transparent focus:ring-0 focus:border-transparent placeholder-white/70 placeholder:text-text-body-small",
        },
      },
    },
  };

  return (
    <Accordion className="bg-[#3D4E6C26] mb-1" theme={customAccordionTheme} collapseAll>
      <Accordion.Panel>
        <Accordion.Title className="focus:ring-1 hover:bg-primary-high hover:text-primary-background p-2 text-white bg-[#3D4E6C26]">
          Салбар
        </Accordion.Title>
        <Accordion.Content className="text-text-body-medium2 p-0 text-white">
          <div className="relative w-full h-full">
            <TextInput
              className="w-full py-1.5 "
              theme={customTextInputTheme}
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
                <SearchLineIcon color="white" size={16} />
              ) : (
                <CloseLineIcon color="white" size={16} />
              )}
              <span className="sr-only">Search</span>
            </button>
          </div>
          {sectorSearchData?.length > 0 ? (
            <ListGroup className="rounded-none" theme={customListGroupTheme}>
              <ListGroup.Item
                className={`${
                  sectorText === ""
                    ? "active bg-transparent text-white"
                    : "text-white"
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
                          ? "active bg-transparent text-white"
                          : " text-white"
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
            <div className="text-white">Салбар олдсонгүй...</div>
          )}
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
};
export default SectorSidebar;

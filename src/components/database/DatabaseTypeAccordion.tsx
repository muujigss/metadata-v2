import { Accordion, ListGroup, TextInput } from "flowbite-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { textSubInputTheme } from "../componentTheme/SearchTheme";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import { accordionTheme } from "../componentTheme/AccordionTheme";
import { ISector } from "@/interfaces/ISector";
import { listGroupTheme } from "../componentTheme/ListGroupTheme";

const DatabaseTypeAccordion = ({ dbType }: { dbType: ISector[] }) => {
  const [dbSearch, setDbSearch] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const dbTypeText = searchParams.get("dbtype") || "";

  const dbTypeSearchData =
    dbSearch == ""
      ? dbType
      : dbType?.filter((item: any) => {
          return item?.name.toLowerCase().includes(dbSearch.toLowerCase());
        });

  const handleDbSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDbSearch(event.target.value);
  };

  const handleDbCancel = () => {
    setDbSearch("");
    // setSelectDatabaseType(0);
  };

  const onClickOnDbType = (dbTypeId: string) => {
    const params = new URLSearchParams(searchParams);

    if (dbTypeId.length == 0) {
      params.delete("dbtype");
    } else {
      params.set("dbtype", dbTypeId);
    }
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
          Өгөгдлийн сангийн төрөл
        </Accordion.Title>
        <Accordion.Content className=" text-text-body-medium2 p-0 text-white">
          <div className="relative w-full h-full">
            <TextInput
              className="w-full py-1.5 "
              theme={customTextInputTheme}
              id="search"
              type="text"
              placeholder="Өгөгдлийн сангийн нэрээр хайх..."
              value={dbSearch}
              onChange={handleDbSearchChange}
            />
            <button
              type="submit"
              className="absolute top-0 end-0 p-2 my-1.5 inline-flex items-start text-text-body-small justify-center"
              onClick={handleDbCancel}
            >
              {dbSearch == "" ? (
                <SearchLineIcon color="white" size={16} />
              ) : (
                <CloseLineIcon color="white" size={16} />
              )}
              <span className="sr-only">Search</span>
            </button>
          </div>
          {dbTypeSearchData?.length > 0 ? (
            <ListGroup theme={customListGroupTheme}>
              <ListGroup.Item
                className={`${
                  dbTypeText === ""
                    ? "active bg-transparent text-white"
                    : "text-white"
                }`}
                onClick={() => onClickOnDbType("")}
              >
                <div className="flex flex-1 items-start">Бүгд</div>
                {/* <div
                  className={
                    "inline-flex items-center px-1 rounded" +
                    `${
                      dbTypeText === ""
                        ? " bg-primary-default text-table-default"
                        : ""
                    }`
                  }
                >
                  {dbTypeSearchData.reduce((a, b) => a + b?.data_count, 0)}
                </div> */}
              </ListGroup.Item>
              {dbTypeSearchData
                ?.filter((item: any) => item?.data_count > 0)
                ?.map((databaseType: ISector, i: any) => {
                  return (
                    <ListGroup.Item
                      key={i}
                      onClick={() =>
                        onClickOnDbType(databaseType?.id.toString())
                      }
                      className={`${
                        dbTypeText === databaseType?.id.toString()
                          ? "active bg-transparent text-white"
                          : "text-white"
                      }`}
                    >
                      <div className="flex flex-1 items-start">
                        <p className="text-start"> {databaseType?.name}</p>
                      </div>
                      <div
                        className={
                          "inline-flex items-center px-1 rounded" +
                          `${
                            dbTypeText === databaseType?.id.toString()
                              ? " bg-primary-default text-table-default"
                              : ""
                          }`
                        }
                      >
                        {" " + databaseType?.data_count}
                      </div>
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
          ) : (
            <p className="text-white">Өгөгдлийн сан олдсонгүй</p>
          )}
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
};

export default DatabaseTypeAccordion;

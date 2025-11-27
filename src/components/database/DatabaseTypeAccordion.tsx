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
  return (
    <Accordion className="bg-white mb-1" theme={accordionTheme} collapseAll>
      <Accordion.Panel>
        <Accordion.Title className="focus:ring-1 hover:bg-primary-high hover:text-primary-background p-2">
          Өгөгдлийн сангийн төрөл
        </Accordion.Title>
        <Accordion.Content className=" text-text-body-medium2 p-0">
          <div className="relative w-full h-full">
            <TextInput
              className="w-full py-1.5 "
              theme={textSubInputTheme}
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
                <SearchLineIcon color="#333a3f" size={16} />
              ) : (
                <CloseLineIcon color="#333a3f" size={16} />
              )}
              <span className="sr-only">Search</span>
            </button>
          </div>
          {dbTypeSearchData?.length > 0 ? (
            <ListGroup theme={listGroupTheme}>
              <ListGroup.Item
                className={`${
                  dbTypeText === ""
                    ? "active bg-secondary-background"
                    : "text-text-body-medium2"
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
                          ? "active bg-secondary-background"
                          : "text-text-body-medium2"
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
            <p>Өгөгдлийн сан олдсонгүй</p>
          )}
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
};

export default DatabaseTypeAccordion;

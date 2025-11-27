"use client";
import { IOrganization } from "@/interfaces/IOrganization";
import { Accordion, ListGroup, TextInput } from "flowbite-react";
import React, { useState } from "react";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import { accordionTheme } from "./componentTheme/AccordionTheme";
import { textSubInputTheme } from "./componentTheme/SearchTheme";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const OrganizationSideBar = ({
  organization,
}: {
  organization: IOrganization[];
}) => {
  const [orgSearch, setOrgSearch] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const orgText = searchParams.get("org") || "";

  const orgSearchData =
    orgSearch == ""
      ? organization
      : organization?.filter((item: any) => {
          return item?.name.toLowerCase().includes(orgSearch.toLowerCase());
        });

  const handleOrgSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrgSearch(e.target.value);
  };
  const handleOrgCancel = () => {
    setOrgSearch("");
    //setSelectOrg(0);
  };

  const onClickOnOrg = (orgId: string) => {
    const params = new URLSearchParams(searchParams);

    if (orgId.length == 0) {
      params.delete("org");
    } else {
      params.set("org", orgId);
    }
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Accordion className="bg-white mb-1" theme={accordionTheme} alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title className="focus:ring-1 hover:bg-primary-high hover:text-primary-background p-2">
          Байгууллага
        </Accordion.Title>
        <Accordion.Content className="text-text-body-medium2 p-0">
          <div className="relative w-full h-full">
            <TextInput
              className="w-full py-1.5 truncate"
              theme={textSubInputTheme}
              id="search"
              type="text"
              placeholder="Байгууллагын нэрээр хайх..."
              value={orgSearch}
              onChange={handleOrgSearchChange}
            />
            <button
              type="submit"
              className="absolute top-0 end-0 p-2 my-1.5 inline-flex items-start text-text-body-small justify-center"
              onClick={handleOrgCancel}
            >
              {orgSearch == "" ? (
                <SearchLineIcon color="#333a3f" size={16} />
              ) : (
                <CloseLineIcon color="#333a3f" size={16} />
              )}
              <span className="sr-only">Search</span>
            </button>
          </div>
          {orgSearchData?.length > 0 ? (
            <ListGroup className="rounded-none">
              <ListGroup.Item
                className={`${
                  orgText == ""
                    ? "active bg-secondary-background"
                    : "text-text-body-medium2"
                }`}
                onClick={() => onClickOnOrg("")}
              >
                <div className="flex flex-1 items-start">Бүгд</div>
                {/* <div
                  className={
                    "inline-flex items-center px-1 rounded" +
                    `${
                      orgText == ""
                        ? " bg-primary-default text-table-default"
                        : ""
                    }`
                  }
                >
                  {orgSearchData.reduce((a, b) => a + b?.data_count, 0)}
                </div> */}
              </ListGroup.Item>
              {orgSearchData
                ?.filter((item: any) => item?.data_count > 0)
                ?.map((orgData: IOrganization, i: any) => {
                  return (
                    <ListGroup.Item
                      key={i}
                      onClick={() => onClickOnOrg(orgData?.id.toString())}
                      className={`${
                        orgText == orgData?.id.toString()
                          ? "active bg-secondary-background"
                          : " text-text-body-medium2"
                      }`}
                    >
                      <div className="flex flex-1 items-start">
                        <p className="text-start">{orgData?.name}</p>
                      </div>
                      <div
                        className={
                          "inline-flex items-center px-1 rounded" +
                          `${
                            orgText == orgData?.id.toString()
                              ? " bg-primary-default text-table-default"
                              : ""
                          }`
                        }
                      >
                        {" " + orgData?.data_count}
                      </div>
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
          ) : (
            <p>Байгууллага олдсонгүй...</p>
          )}
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
};
export default OrganizationSideBar;

"use client";
import { IOrganization } from "@/interfaces/IOrganization";
import { Accordion, ListGroup, TextInput } from "flowbite-react";
import React, { useState } from "react";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import { accordionTheme } from "./componentTheme/AccordionTheme";
import { listGroupTheme } from "./componentTheme/ListGroupTheme";
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
    console.log("Organization clicked:", orgId);
    const params = new URLSearchParams(searchParams);

    if (orgId.length == 0) {
      params.delete("org");
    } else {
      params.set("org", orgId);
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
    <Accordion className="bg-[#3D4E6C26] mb-1" theme={customAccordionTheme} alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title className="focus:ring-1 hover:bg-primary-high hover:text-primary-background p-2 text-white bg-[#3D4E6C26]">
          Байгууллага
        </Accordion.Title>
        <Accordion.Content className="text-text-body-medium2 p-0 text-white">
          <div className="relative w-full h-full">
            <TextInput
              className="w-full py-1.5 truncate"
              theme={customTextInputTheme}
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
                <SearchLineIcon color="white" size={16} />
              ) : (
                <CloseLineIcon color="white" size={16} />
              )}
              <span className="sr-only">Search</span>
            </button>
          </div>
          {orgSearchData?.length > 0 ? (
            <ListGroup className="rounded-none" theme={customListGroupTheme}>
              <ListGroup.Item
                className={`${
                  orgText == ""
                    ? "active bg-transparent text-white"
                    : "text-white"
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
                          ? "active bg-transparent text-white"
                          : " text-white"
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

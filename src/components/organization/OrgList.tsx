"use client";
import { IOrganization } from "@/interfaces/IOrganization";
import { useGetOrgs } from "@/utils/customHooks";
import { Badge, Card, TextInput } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
import GlobalLineIcon from "remixicon-react/GlobalLineIcon";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import { textInputOrgTheme } from "../componentTheme/SearchTheme";

const OrgList = () => {
  const [searchText, setSearchText] = useState("");
  const searchIcon = () => {
    return <SearchLineIcon color="#005baa" size={16} />;
  };

  const { data: orgs } = useGetOrgs();
  const filteredData =
    searchText == ""
      ? orgs
      : orgs.filter((item: IOrganization) =>
          item?.name.toLowerCase().includes(searchText.toLowerCase())
        );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  return (
    <div className="container justify-between py-8">
      <div className="flex flex-row items-start self-stretch gap-4">
        <div className="w-1/3 h-full">
          <div className="w-full pb-4 text-text-body-meduim text-secondary-default">
            <TextInput
              theme={textInputOrgTheme}
              id="search"
              type="text"
              rightIcon={searchIcon}
              placeholder="Байгууллагын нэрээр  хайх..."
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="w-full h-full">
          {filteredData?.length == 0 && <p className="text-white">Хайлтын үр дүнд олдсонгүй ...</p>}
          <div className="flex flex-col gap-4 self-stretch">
            {filteredData
              ?.filter(
                (orgFIlter: IOrganization) => orgFIlter?.is_active == true
              )
              ?.map((list: IOrganization, i: number) => {
                return (
                  <Card 
                    className="flex self-stretch justify-between bg-[#3D4E6C26] border-transparent text-white" 
                    key={i}
                    theme={{
                        root: {
                            base: "flex rounded-lg border border-transparent bg-[#3D4E6C26] shadow-md",
                            children: "flex h-full flex-col justify-center gap-4 p-4"
                        }
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="shrink-0 bg-white/10 p-2 rounded-lg">
                        <Image
                          alt=""
                          height={50}
                          width={50}
                          quality={70}
                          src={
                            !!list?.img_url
                              ? list?.img_url
                              : "/logo/no-image.png"
                          }
                          className=" object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/database?org=${list?.id}`}>
                          <p className="text-lg font-bold text-white leading-6 hover:text-blue-400 transition-colors">
                            {list?.name}
                          </p>
                          <p className="text-sm text-gray-300 leading-4 list-desc mt-1">
                            {list?.address}
                          </p>
                        </Link>
                        <div className="flex items-center text-sm text-gray-400 gap-4 py-2">
                          {list?.website && (
                            <Link
                              href={`${list?.website}`}
                              target="_blank"
                              className="hover:text-blue-400 transition-colors"
                            >
                              <span className=" inline-flex items-center ">
                                <GlobalLineIcon size={14} className="mr-1" />
                                <p>{list?.website}</p>
                              </span>
                            </Link>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Database2FillIcon size={14} />
                            <Badge color="success" className="ml-1">
                              {list?.databases?.filter(
                                (db: any) => db.is_active == true && db.is_form == true
                              )?.length}
                            </Badge>
                          </span>
                        </div>
                      </div>

                      <div className="inline-flex items-center text-base font-semibold text-gray-400">
                        <ArrowRightSLineIcon size={26} />
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgList;

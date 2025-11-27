"use client";
import { getOrganizationById } from "@/services/OrganizationService";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Loader from "../Loader";
import BreadCrumpMenu from "../BreadCrumpMenu";
import DatabaseFilterList from "../database/DatabaseFilterList";
const OrgDetail = ({ id }: { id: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["organization by id", id],
    queryFn: () => getOrganizationById({ id }),
  });

  const orgDb = data?.databases;
  if (isLoading) return <Loader />;
  return (
    <div className="w-full h-full">
      <BreadCrumpMenu
        menu_name="Байгууллагууд"
        id={6}
        submenu_id={id}
        submenu_name={data?.name}
      />
      <div className="container py-8">
        {/* <h1 className="mb-4 text-center  text-text-display-medium uppercase text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          {data?.org_name}
        </h1> */}
        <DatabaseFilterList id={id} />
      </div>
    </div>
  );
};
export default OrgDetail;

"use client";
import { IOrganization } from "@/interfaces/IOrganization";
import { useGetOrgs } from "@/utils/customHooks";
import { Card } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import ArrowRightCircleLineIcon from "remixicon-react/ArrowRightCircleLineIcon";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
export const revalidate = 3600;
const OrgSlideList = () => {
  const { data: org } = useGetOrgs();
  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-wrap items-center justify-between pt-16 pb-0 lg:pb-8 gap-2">
        <h5 className="uppercase text-text-home-title">Байгууллага</h5>
        <Link
          href="/organization"
          className="text-text-body-medium uppercase text-secondary-default hover:underline hover:text-primary-medium"
        >
          <span className="inline-flex items-center hover:border-b-2 hover:border-primary-medium ">
            Бүх байгууллага харах
            <ArrowRightCircleLineIcon className="mx-2" size={18} />
          </span>
        </Link>
      </div>

      <div className="">
        <div className="flow-root">
          <ul className="lg:grid lg:grid-cols-4 justify-between gap-4">
            {org
              ?.filter(
                (orgFIlter: IOrganization) => orgFIlter?.is_active == true
              )
              ?.map((orgList: IOrganization, i: number) => {
                return (
                  <li className="py-2" key={i}>
                    <Link href={`/database?org=${orgList?.id}`}>
                      <Card className="w-full h-full">
                        <div className="flex items-center justify-start space-x-2">
                          <div className="shrink-0">
                            <Image
                              alt={orgList?.org_short_name}
                              src={
                                !!orgList?.img_url
                                  ? orgList?.img_url
                                  : "/logo/no-image.png"
                              }
                              width={60}
                              height={60}
                              className="object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-text-body-large text-secondary-medium truncate lg:text-wrap leading-5">
                              {orgList?.name}
                            </p>
                          </div>
                          <div className="inline-flex items-center justify-center gap-1  text-text-body-medium bg-primary-default bg-opacity-10 px-2 border border-primary-default rounded-lg">
                            <Database2FillIcon size={14} color="#005baa" />
                            {orgList?.databases?.length}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </li>
                );
              })
              .slice(0, 8)}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default OrgSlideList;

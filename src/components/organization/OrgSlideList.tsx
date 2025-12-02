"use client";
import { IOrganization } from "@/interfaces/IOrganization";
import { useGetOrgs } from "@/utils/customHooks";
import { Card } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import ArrowRightCircleLineIcon from "remixicon-react/ArrowRightCircleLineIcon";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
export const revalidate = 3600;
const OrgSlideList = () => {
  const { data: org } = useGetOrgs();
  return (
    <div className="relative w-full bg-[#080812]"> 
      <div className="container mx-auto z-10">
        <div className="grid grid-cols-2 pt-16 pb-0 lg:pb-8 gap-2">
          <h5 className="flex justify-end text-white font-medium font-sans text-[38px]">Байгууллага</h5>
          <Link
            href="/organization"
            className="flex justify-end text-text-body-medium text-secondary-white italic opacity-80 hover:underline hover:text-primary-medium"
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
                        <div className="w-full h-full bg-[rgba(61,78,108,0.15)] backdrop-blur-lg rounded-lg bg-[url('/v2/bg-pattern-wave.png')] bg-cover bg-no-repeat">
                          <div className="flex items-center justify-start gap-10 p-4">
                            <div className="shrink-0">
                              <Image
                                alt={orgList?.org_short_name}
                                src={
                                  !!orgList?.img_url
                                    ? orgList?.img_url
                                    : "/logo/no-image.png"
                                }
                                width={42}
                                height={42}
                                className="object-contain rounded"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-white text-[14px] font-sans truncate lg:text-wrap leading-5">
                                {orgList?.name}
                              </p>
                            </div>
                            <div className="inline-flex items-center justify-center gap-1 px-2">
                              {/* <Database2FillIcon size={14} color="#005baa" />
                              {orgList?.databases?.length} */}
                              <div className="flex items-center justify-center w-[24px] h-[24px] bg-white rounded-full shadow-md text-gray-800">
                                <ArrowRightSLineIcon size={16} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })
                .slice(0, 8)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrgSlideList;

"use client";
import Link from "next/link";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
import Building4LineIcon from "remixicon-react/Building4LineIcon";
import EditBoxFillIcon from "remixicon-react/EditBoxFillIcon";
import GridLineIcon from "remixicon-react/GridLineIcon";
import PulseLineIcon from "remixicon-react/PulseLineIcon";
import BarcodeBoxLineIcon from "remixicon-react/BarcodeBoxLineIcon";

const StatComponent = ({ mainIndicator }: { mainIndicator: any }) => {
  return (
    <div className="bg-white">
      <div className="container mx-auto py-14 px-8">
        <div className="w-full">
          <ul className="flex flex-col lg:grid lg:grid-cols-2 justify-between gap-4 ">
            <li className="py-3 sm:py-4 bg-surface-default px-4">
              <Link href="/organization">
                <div className="flex items-center space-x-4 w-full">
                  <div className="shrink-0">
                    <Building4LineIcon size={24} />
                  </div>
                  <div className="min-w-0 flex-1 items-center">
                    <p className="uppercase text-sm font-medium text-gray-900 dark:text-white">
                      Байгууллага
                    </p>
                    <p className="truncate text-text-body-medium2 text-justify text-secondary-default opacity-80 ">
                      Бүртгэлтэй байгууллагын мэдээлэл
                    </p>
                  </div>
                  <div className="inline-flex bg-primary-medium text-white justify-center items-center rounded-full bg-primary-10 w-10 h-10 lg:h-12 lg:w-12">
                    <span className="text-text-org-name lg:text-text-body-medium">
                      {mainIndicator?.organizations}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
            <li className="py-3 sm:py-4 bg-surface-default px-4">
              <Link href="/database">
                <div className="flex items-center space-x-4 w-full">
                  <div className="shrink-0">
                    <Database2FillIcon size={24} />
                  </div>
                  <div className="min-w-0 flex-1 items-center">
                    <p className="uppercase text-sm font-medium text-gray-900 dark:text-white">
                      Өгөгдлийн сан
                    </p>
                    <p className="truncate text-text-body-medium2 text-justify text-secondary-default opacity-80 ">
                      Төрийн байгууллагын өгөгдлийн сангийн мета мэдээлэл
                    </p>
                  </div>
                  <div className="inline-flex bg-primary-medium text-white justify-center items-center rounded-full bg-primary-100 w-10 h-10 lg:h-12 lg:w-12">
                    <span className="text-text-org-name lg:text-text-body-medium">
                      {mainIndicator?.databases}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
            <li className="py-3 sm:py-4 bg-surface-default px-4">
              <Link href={`/table`}>
                <div className="flex items-center space-x-4">
                  <div className="shrink-0">
                    <GridLineIcon size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="uppercase text-sm font-medium text-gray-900 dark:text-white">
                      Хүснэгт
                    </p>
                    <p className="truncate text-text-body-medium2 text-justify text-secondary-default opacity-80 ">
                      Өгөгдлийн санд агуулагдаж буй үндсэн хүснэгтийн мета
                      мэдээлэл
                    </p>
                  </div>
                  <div className="inline-flex bg-primary-medium text-white justify-center items-center rounded-full bg-primary-100 w-10 h-10 lg:h-12 lg:w-12">
                    <span className="text-text-org-name lg:text-text-body-medium">
                      {mainIndicator?.tables}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
            <li className="py-3 sm:py-4 bg-surface-default px-4">
              <Link href={`/indicator`}>
                <div className="flex items-center space-x-4">
                  <div className="shrink-0">
                    <PulseLineIcon size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="uppercase text-sm font-medium text-gray-900 dark:text-white">
                      Үзүүлэлт
                    </p>
                    <p className="truncate text-text-body-medium2 text-justify text-secondary-default opacity-80 ">
                      Үндсэн хүснэгтийн үзүүлэлтийн мета мэдээлэл
                    </p>
                  </div>
                  <div className="inline-flex bg-primary-medium text-white justify-center items-center rounded-full bg-primary-100 w-10 h-10 lg:h-12 lg:w-12">
                    <span className="text-text-org-name lg:text-text-body-medium">
                      {mainIndicator?.indicators}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
            <li className="py-3 sm:py-4 bg-surface-default px-4">
              <Link href={`/classification`}>
                <div className="flex items-center space-x-4">
                  <div className="shrink-0">
                    <BarcodeBoxLineIcon size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="uppercase text-sm font-medium text-gray-900 dark:text-white">
                      Ангилал, код
                    </p>
                    <p className="truncate text-text-body-medium2 text-justify text-secondary-default opacity-80 ">
                      Үндсэн хүснэгтийн ангилал, кодын мета мэдээлэл
                    </p>
                  </div>
                  <div className="inline-flex bg-primary-medium text-white justify-center items-center rounded-full bg-primary-100 w-10 h-10 lg:h-12 lg:w-12">
                    <span className="text-text-org-name lg:text-text-body-medium">
                      {mainIndicator?.classifications}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
            <li className="py-3 sm:py-4 bg-surface-default px-4">
              <Link href={`/form`}>
                <div className="flex items-center space-x-4">
                  <div className="shrink-0">
                    <EditBoxFillIcon size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="uppercase text-sm font-medium text-gray-900 dark:text-white">
                      Маягт
                    </p>
                    <p className="truncate text-text-body-medium2 text-justify text-secondary-default opacity-80 ">
                      Маягтын мета мэдээлэл
                    </p>
                  </div>
                  <div className="inline-flex bg-primary-medium text-white justify-center items-center rounded-full bg-primary-100 w-10 h-10 lg:h-12 lg:w-12">
                    <span className="text-text-org-name lg:text-text-body-medium">
                      {mainIndicator?.forms}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default StatComponent;

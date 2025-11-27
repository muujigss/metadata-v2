import React from "react";
import { Card } from "flowbite-react";
import BarcodeBoxLineIcon from "remixicon-react/BarcodeBoxLineIcon";
import Link from "next/link";
import Database2LineIcon from "remixicon-react/Database2LineIcon";
import Table2Icon from "remixicon-react/Table2Icon";
import EditBoxFillIcon from "remixicon-react/EditBoxFillIcon";
import PulseLineIcon from "remixicon-react/PulseLineIcon";
import Tooltip from "@mui/material/Tooltip";

export default function Result({ data }: any) {
  const checkObj = (d: any, cc: any) => {
    if (d) {
      return Object.keys(d).includes(cc);
    }
  };

  if (
    !checkObj(data, "database") &&
    !checkObj(data, "table") &&
    !checkObj(data, "form") &&
    !checkObj(data, "indicator") &&
    !checkObj(data, "classification")
  )
    return (
      <div className="w-full text-center">
        <p className="pb-4">Хайлтын үр дүн олдсонгүй</p>
        <hr />
      </div>
    );

  const database: any = data.database;
  const table: any =
    data.table &&
    data.table.filter(
      (e: { highlight: { tbl_name: any } }) => e.highlight.tbl_name
    );
  const form: any =
    data.form &&
    data.form.filter(
      (e: { highlight: { form_name: any } }) => e.highlight.form_name
    );
  const indicator: any =
    data.indicator &&
    data.indicator.filter(
      (e: { highlight: { indicator_name: any } }) => e.highlight.indicator_name
    );
  const classification: any =
    data.classification &&
    data.classification.filter(
      (e: { highlight: { classification_name: any } }) =>
        e.highlight.classification_name
    );

  return (
    <div className="flex flex-col gap-6 w-full mb-5 text-left">
      {checkObj(data, "database") && database.length > 0 && (
        <Card className="data w-full">
          <Link
            className="truncate text-text-title-medium text-secondary-default leading-6 inline-flex gap-2 items-center"
            href={"/database"}
          >
            <Database2LineIcon size={25} />
            Өгөгдлийн сан
          </Link>
          <hr />
          <ul className="">
            {database.map((dt: any, i: any) => {
              return (
                <li className="" key={i}>
                  <div className="flex justify-center gap-2 w-full">
                    <div className="shrink-0 text-primary-high">
                      <Database2LineIcon size={20} className="rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1 ">
                      <Link
                        className="truncate text-text-body-medium2 font-medium text-black cursor-pointer text-wrap hover:underline"
                        href={"/database/" + dt._source.db_id}
                        dangerouslySetInnerHTML={{
                          __html: dt?.highlight?.db_name,
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
      {checkObj(data, "table") && table.length > 0 && (
        <Card className="data w-full">
          <Link
            className="truncate text-text-title-medium text-secondary-default leading-6 inline-flex gap-2 items-center"
            href={"/table"}
          >
            <Table2Icon size={25} />
            Хүснэгт
          </Link>
          <hr />
          <ul className="">
            {table.map((dt: any, i: any) => {
              return (
                <li className="py-3 sm:py-2" key={i}>
                  <div className="flex justify-center gap-2 w-ful">
                    <div className="shrink-0 text-primary-high">
                      <Table2Icon size={25} className="rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        className="truncate text-text-body-medium2 font-medium text-black cursor-pointer text-wrap hover:underline"
                        href={"/table/" + dt._source.tbl_id}
                        dangerouslySetInnerHTML={{
                          __html: dt.highlight.tbl_name,
                        }}
                      />
                      <div className="flex justify-left items-left gap-2 ">
                        <Link
                          data-tooltip-target="tooltip-light"
                          className="truncate text-text-body-medium2 text-gray-500 font-normal hover:underline cursor-pointer"
                          href={"/database/" + dt._source.db_id}
                        >
                          <div className="flex items-center">
                            <Tooltip
                              title={
                                <div
                                  className="text-wrap"
                                  dangerouslySetInnerHTML={{
                                    __html: dt._source.db_name,
                                  }}
                                />
                              }
                              placement="top-start"
                            >
                              <div>Өгөгдлийн сан</div>
                            </Tooltip>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
      {checkObj(data, "form") && form.length > 0 && (
        <Card className="data w-full">
          <Link
            className="truncate text-text-title-medium text-secondary-default leading-6 inline-flex gap-2 items-center"
            href={"/form"}
          >
            <EditBoxFillIcon size={25} />
            Маягт
          </Link>
          <hr />
          <ul className="">
            {form.map((dt: any, i: any) => {
              return (
                <li className="py-3 sm:py-2" key={i}>
                  <div className="flex justify-center gap-2 w-ful">
                    <div className="shrink-0 text-primary-high">
                      <EditBoxFillIcon size={25} className="rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        className="truncate text-text-body-medium2 font-medium text-black cursor-pointer text-wrap hover:underline"
                        href={"/form/" + dt._source.form_id}
                        dangerouslySetInnerHTML={{
                          __html: dt.highlight.form_name,
                        }}
                      />
                      <div className="flex justify-left items-left gap-2 ">
                        <Link
                          data-tooltip-target="tooltip-light"
                          className="truncate text-text-body-medium2 text-gray-500 font-normal hover:underline cursor-pointer"
                          href={"/database/" + dt._source.db_id}
                        >
                          <div className="flex items-center">
                            <Tooltip
                              title={
                                <div
                                  className="text-wrap"
                                  dangerouslySetInnerHTML={{
                                    __html: dt._source.db_name,
                                  }}
                                />
                              }
                              placement="top-start"
                            >
                              <div>Өгөгдлийн сан</div>
                            </Tooltip>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
      {checkObj(data, "indicator") && indicator.length > 0 && (
        <Card className="data w-full">
          <Link
            className="truncate text-text-title-medium text-secondary-default leading-6 inline-flex gap-2 items-center"
            href={"/indicator"}
          >
            <PulseLineIcon size={25} />
            Үзүүлэлт
          </Link>
          <hr />
          <ul className="">
            {indicator.map((dt: any, i: any) => {
              return (
                <li className="py-3 sm:py-2" key={i}>
                  <div className="flex justify-center gap-2 w-ful">
                    <div className="shrink-0 text-primary-high">
                      <PulseLineIcon size={25} className="rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        className="truncate text-text-body-medium2 font-medium text-black cursor-pointer text-wrap hover:underline"
                        href={"/indicator/" + dt._source.indicator_id}
                        dangerouslySetInnerHTML={{
                          __html: dt.highlight.indicator_name,
                        }}
                      />
                      <div className="flex justify-left items-left ">
                        <Link
                          data-tooltip-target="tooltip-light"
                          className="truncate text-text-body-medium2 text-gray-500 font-normal hover:underline cursor-pointer"
                          href={"/database/" + dt._source.db_id}
                        >
                          <div className="flex items-center">
                            <Tooltip
                              title={
                                <div
                                  className="text-wrap"
                                  dangerouslySetInnerHTML={{
                                    __html: dt._source.db_name,
                                  }}
                                />
                              }
                              placement="top-start"
                            >
                              <div>Өгөгдлийн сан</div>
                            </Tooltip>
                          </div>
                        </Link>
                        <Link
                          data-tooltip-target="tooltip-light"
                          className="truncate text-text-body-medium2 text-gray-500 font-normal hover:underline cursor-pointer"
                          href={"/table/" + dt._source.tbl_id}
                        >
                          <div className="flex items-center">
                            <svg
                              stroke="currentColor"
                              fill="none"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="mx-1 h-4 w-4 text-gray-400 group-first:hidden md:mx-2"
                              data-testid="flowbite-breadcrumb-separator"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                            <Tooltip
                              title={
                                <div
                                  className="text-wrap"
                                  dangerouslySetInnerHTML={{
                                    __html: dt._source.tbl_name,
                                  }}
                                />
                              }
                              placement="top-start"
                            >
                              <div>Хүснэгт</div>
                            </Tooltip>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
      {checkObj(data, "classification") && classification.length > 0 && (
        <Card>
          <Link
            className="truncate text-text-title-medium text-secondary-default leading-6 inline-flex gap-2 items-center"
            href={"/classification"}
          >
            <BarcodeBoxLineIcon size={25} />
            Ангилал код
          </Link>
          <hr />
          <ul className="">
            {classification.map((dt: any, i: any) => {
              return (
                <li className="py-3 sm:py-2" key={i}>
                  <div className="flex justify-center gap-2 w-ful">
                    <div className="shrink-0 text-primary-high">
                      <BarcodeBoxLineIcon size={25} className="rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        className="truncate text-text-body-medium2 font-medium text-black cursor-pointer text-wrap hover:underline"
                        href={"/classification/" + dt._source.id}
                        dangerouslySetInnerHTML={{
                          __html: dt.highlight.classification_name,
                        }}
                      />
                      <div className="flex justify-left items-left ">
                        <Link
                          data-tooltip-target="tooltip-light"
                          className="truncate text-text-body-medium2 text-gray-500 font-normal hover:underline cursor-pointer"
                          href={"/database/" + dt._source.db_id}
                        >
                          <div className="flex items-center">
                            <Tooltip
                              title={
                                <div
                                  className="text-wrap"
                                  dangerouslySetInnerHTML={{
                                    __html: dt._source.db_name,
                                  }}
                                />
                              }
                              placement="top-start"
                            >
                              <div>Өгөгдлийн сан</div>
                            </Tooltip>
                          </div>
                        </Link>
                        <Link
                          data-tooltip-target="tooltip-light"
                          className="truncate text-text-body-medium2 text-gray-500 font-normal hover:underline cursor-pointer"
                          href={"/table/" + dt._source.tbl_id}
                        >
                          <div className="flex items-center">
                            <svg
                              stroke="currentColor"
                              fill="none"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="mx-1 h-4 w-4 text-gray-400 group-first:hidden md:mx-2"
                              data-testid="flowbite-breadcrumb-separator"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                            <Tooltip
                              title={
                                <div
                                  className="text-wrap"
                                  dangerouslySetInnerHTML={{
                                    __html: dt._source.tbl_name,
                                  }}
                                />
                              }
                              placement="top-start"
                            >
                              <div>Хүснэгт</div>
                            </Tooltip>
                          </div>
                        </Link>
                        <Link
                          data-tooltip-target="tooltip-light"
                          className="truncate text-text-body-medium2 text-gray-500 font-normal hover:underline cursor-pointer"
                          href={"/indicator/" + dt._source.indicator_id}
                        >
                          <div className="flex items-center">
                            <svg
                              stroke="currentColor"
                              fill="none"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="mx-1 h-4 w-4 text-gray-400 group-first:hidden md:mx-2"
                              data-testid="flowbite-breadcrumb-separator"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                            <Tooltip
                              title={
                                <div
                                  className="text-wrap"
                                  dangerouslySetInnerHTML={{
                                    __html: dt._source.indicator_name,
                                  }}
                                />
                              }
                              placement="top-start"
                            >
                              <div>Үзүүлэлт</div>
                            </Tooltip>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}

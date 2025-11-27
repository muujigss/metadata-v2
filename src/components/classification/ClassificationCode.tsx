"use client";
import React, { useState } from "react";
import { IClassificationCode } from "@/interfaces/IClassificationCode";
import { Button, TextInput } from "flowbite-react";
import {
  textInputClassTheme,
  textSubInputTheme,
} from "../componentTheme/SearchTheme";
import SearchLineIcon from "remixicon-react/SearchLineIcon";
import * as XLSX from "xlsx";
import FileExcelLineIcon from "remixicon-react/FileExcelLineIcon";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";

const ClassificationCode = ({
  data,
  name,
}: {
  data: IClassificationCode[];
  name: string;
}) => {
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [activePage, setActivePage] = useState(1);
  if (!data) {
    return <p>Ачааллаж байна ...</p>;
  }

  const searchIcon = () => {
    return <SearchLineIcon color="#005baa" size={12} />;
  };

  const filteredData =
    searchName != "" || searchCode != ""
      ? data?.filter((classCode: IClassificationCode) => {
          return (
            classCode.code?.toLowerCase().includes(searchCode.toLowerCase()) &&
            classCode?.definition
              .toLowerCase()
              .includes(searchName?.toLowerCase())
          );
        })
      : data;

  const downloadExcel = () => {
    const exportData = data
      ?.sort((a: any, b: any) => a.code - b.code)
      ?.map((dt: any, i: number) => {
        return {
          "№": i + 1,
          Код: dt?.code,
          Нэр: dt?.definition,
        };
      });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils?.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${name}.xlsx`);
  };
  const paginationList = (items: any, pageSize: number) => {
    const totalPages = Math.ceil(items?.length / pageSize);
    const offset = pageSize * (activePage - 1);
    const paginatedItems = items.slice(offset, pageSize * activePage);

    return {
      nextPage: () => setActivePage((p) => (p < totalPages ? p + 1 : p)),
      previousPage: () => setActivePage((p) => (p > 1 ? p - 1 : p)),
      totalPages,
      totalItems: items.length,
      items: paginatedItems,
    };
  };

  const { items, nextPage, previousPage, totalPages, totalItems } =
    paginationList(filteredData, Math.min(15, filteredData?.length));

  return (
    <div className="container py-2 ">
      <div className="relative overflow-x-auto ">
        <div className="flex items-center justify-between gap-10 py-2">
          <div className="flex items-center gap-10 py-2 font-bold"></div>
          <button
            className="inline-flex items-center gap-2 p-2  text-text-body-small font-normal border border-tertirary-default bg-tertirary-default bg-opacity-10 hover:bg-tertirary-default hover:bg-opacity-10 hover:border-tertirary-default hover:ring-0 rounded-lg"
            onClick={() => downloadExcel()}
          >
            <FileExcelLineIcon color="#40ac70" size={16} />
            Ангилал, код татах
          </button>
        </div>
        <table className="w-full text-left rtl:text-right text-secondary-medium">
          <thead className="site-table text-secondary-default uppercase bg-table-default p-3 ">
            <tr>
              <th scope="col" className="px-6 py-3 ">
                №
              </th>
              <th scope="col" className="px-4 py-3 tbody-code">
                Код
                <TextInput
                  className="text-text-table-small"
                  type="text"
                  rightIcon={searchIcon}
                  theme={textInputClassTheme}
                  value={searchCode}
                  placeholder="Кодоор хайх ... "
                  onChange={(e) => setSearchCode(e.target.value)}
                />
              </th>
              <th scope="col" className="px-4 py-3 w-full">
                Нэр
                <TextInput
                  className="text-text-table-small"
                  type="text"
                  rightIcon={searchIcon}
                  theme={textInputClassTheme}
                  value={searchName}
                  placeholder="Нэрээр хайх ... "
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </th>
            </tr>
          </thead>
          <tbody className=" text-text-body-medium2">
            {items?.length > 0 ? (
              items?.map((classCode: IClassificationCode, i: any) => {
                return (
                  <tr
                    className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border"
                    key={i}
                  >
                    <th
                      scope="row"
                      className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
                    >
                      {i + 1}
                    </th>
                    <td className="px-6 py-2 tbody-code">{classCode?.code}</td>
                    <td className="px-6 py-2 w-full">
                      {classCode?.definition}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-center">
                  Хайлтын илэрц олдсонгүй...
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between gap-10 py-2">
          <p>
            Нийт: <span className="font-bold">{totalItems}</span>
          </p>
          <div className="flex items-center justify-end gap-8 ">
            <button
              onClick={previousPage}
              disabled={activePage <= 1}
              className={
                activePage == 1
                  ? "opacity-50 p-1 font-light text-white bg-gray-800 rounded cursor-not-allowed"
                  : "" +
                    " p-1 font-light text-white bg-gray-800 rounded hover:bg-gray-900"
              }
            >
              <ArrowLeftSLineIcon size={16} />
            </button>
            <p className="text-text-body-medium p-2">
              Хуудас <span className="font-bold">{activePage}</span> /{" "}
              {totalPages}
            </p>
            <button
              onClick={nextPage}
              disabled={activePage >= totalPages}
              className={
                activePage == totalPages
                  ? "opacity-50 p-1 font-light text-white bg-gray-800 rounded cursor-not-allowed"
                  : "" +
                    " p-1 font-light text-white bg-gray-800 rounded hover:bg-gray-900"
              }
            >
              <ArrowRightSLineIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassificationCode;

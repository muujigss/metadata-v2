"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React from "react";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";

const PaginationComp = ({
  totalPages,
  onPageChange,
  perPage,
  lastPage,
}: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { replace } = useRouter();

  const changeHandler = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const paginationNumbers = Array.from(
    { length: Math.ceil(totalPages / perPage) },
    (_, i) => i + 1
  );
  const totalPage = Math.ceil(totalPages / perPage);
  let currentItems;
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  currentItems = paginationNumbers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePage = (pageIndex: number, i: number) => {
    const limit = 15;
    const preservedDistanceToEdge = 4;
    const distanceToLastPage = Math.abs(totalPage - pageIndex);
    const distanceToCurrent = Math.abs(pageIndex - currentPage);
    const isEdgePage = pageIndex === totalPage || pageIndex === 1;
    let isLastPreservedRange = distanceToLastPage < preservedDistanceToEdge;
    let isFirstPreservedRange = pageIndex <= preservedDistanceToEdge + 1;

    if (currentPage == preservedDistanceToEdge + 1 && totalPage > limit) {
      isFirstPreservedRange = false;
    }

    if (
      totalPage >= limit &&
      currentPage !== pageIndex &&
      !isEdgePage &&
      !isFirstPreservedRange &&
      !isLastPreservedRange &&
      distanceToCurrent > 1
    ) {
      return <button className="page truncated">...</button>;
    }
    return (
      <button
        key={i}
        onClick={() => {
          changeHandler(pageIndex);
        }}
        className={`cursor-pointer px-3 py-1 rounded ${
          currentPage == pageIndex
            ? "bg-primary-default text-white"
            : "bg-white text-gray-800"
        }`}
      >
        {pageIndex}
      </button>
    );
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) onPageChange(+currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage !== 1) onPageChange(currentPage - 1);
  };
  return (
    <div className="flex items-center justify-between text-sm py-6 gap-2">
      <div className="flex items-center gap-1 justify-start">
        {/* Нийт:
        <span className="text-primary-default text-text-title-medium">
          {totalPages}
        </span> */}
      </div>
      <div className="flex flex-wrap md:flex-row items-center gap-2 justify-end">
        <button
          className={
            currentPage == 1
              ? " flex items-center justify-end px-4 py-1 text-base opacity-50 cursor-not-allowed rounded text-white bg-gray-800"
              : "" +
                "flex items-center justify-end px-4 py-1 text-base font-medium text-white bg-gray-800 rounded hover:bg-gray-900"
          }
          onClick={goToPrevPage}
          disabled={currentPage == 1}
        >
          <ArrowLeftSLineIcon />
          Өмнөх
        </button>

        {paginationNumbers.map((page, i) => handlePage(page, i))}
        <button
          className={
            currentPage == lastPage
              ? " flex items-center justify-start opacity-50 px-4 py-1 text-base font-medium text-white bg-gray-800 rounded cursor-not-allowed"
              : "" +
                "flex items-center justify-start px-4 py-1 text-base font-medium text-white bg-gray-800 rounded hover:bg-gray-900"
          }
          onClick={goToNextPage}
          disabled={currentPage == lastPage}
        >
          Дараах
          <ArrowRightSLineIcon />
        </button>
      </div>
    </div>
  );
};

export default PaginationComp;

"use client";

const ExcelDownloadButton = ({
  searchText,
  orgId,
  sectorId,
  dbType,
}: {
  searchText?: string;
  orgId?: string;
  sectorId?: string;
  dbType?: string;
}) => {
  const handleDownload = () => {
    const params = new URLSearchParams();
    if (searchText) params.set("query", searchText);
    if (orgId) params.set("org", orgId);
    if (sectorId) params.set("sector", sectorId);
    if (dbType) params.set("dbtype", dbType);
    window.location.href = `/api/export/excel/database/site?${params.toString()}`;
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer"
    >
      Эксел татах
    </button>
  );
};

export default ExcelDownloadButton;

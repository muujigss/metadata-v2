import OrganizationSideBar from "../OrganizationSidebar";
import SectorSidebar from "../SectorSidebar";
import { TotalOrganization, TotalSector } from "../TotalValue";

const FormSidebar = ({
  sector,
  setSelectSector,
  selectSector,
  organization,
  selectOrg,
  setSelectOrg,
  filterList,
}: any) => {
  const orgCount = TotalOrganization({
    data: filterList,
    sector: selectSector,
    databaseType: 0,
    name: "table",
  });
  const sectorCount = TotalSector({
    data: filterList,
    databaseType: 0,
    org: selectOrg,
    name: "table",
  });
  return (
    <div>
      <OrganizationSideBar
        organization={organization}
        selectOrg={selectOrg}
        setSelectOrg={setSelectOrg}
        orgCount={orgCount}
      />
      <SectorSidebar
        sector={sector}
        setSelectSector={setSelectSector}
        sectorCount={sectorCount}
        selectSector={selectSector}
      />
    </div>
  );
};
export default FormSidebar;

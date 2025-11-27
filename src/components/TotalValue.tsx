import { IClassification } from "@/interfaces/IClassification";

const TotalDatabase = ({ data, sector, org }: any) => {
  const filterData = data?.filter(
    (dataFilter: any) =>
      (dataFilter?.sector == sector || sector == "") &&
      (dataFilter?.organization_id == org || org == 0)
  );
  const totalValue = filterData?.length || 0;
  const countList: any = {};
  filterData?.forEach((db: any) => {
    if (countList[db.db_type]) {
      countList[db?.db_type].dbCount++;
    } else {
      countList[db?.db_type] = {
        name: db?.db_type,
        dbCount: 1,
      };
    }
  });

  return {
    totalValue,
    count: countList,
  };
};
const TotalSector = ({ data, databaseType, org, name }: any) => {
  const filterData =
    name == "classification"
      ? data?.filter((dataFilter: IClassification) => {
          return (
            (dataFilter?.indicators &&
              dataFilter?.indicators.length > 0 &&
              dataFilter?.indicators[0].indicator.table.database
                .organization_id == org) ||
            org == 0
          );
        })
      : name == "table"
      ? data?.filter((dataFilter: any) => {
          return dataFilter?.database?.organization?.org_id == org || org == 0;
        })
      : name == "indicator"
      ? data?.filter((dataFilter: any) => {
          return (
            dataFilter?.table?.database?.organization?.org_id == org || org == 0
          );
        })
      : data?.filter(
          (dataFilter: any) =>
            (dataFilter?.db_type == databaseType || databaseType == 0) &&
            (dataFilter?.organization_id == org || org == 0)
        );
  const totalValue = filterData?.length || 0;

  const countList: any = {};
  filterData?.forEach((db: any) => {
    if (name == "classification") {
      if (
        db?.indicators &&
        db?.indicators.length > 0 &&
        countList[db?.indicators[0].indicator.table.database.organization_id]
      ) {
        countList[db?.indicators[0].indicator.table.database.organization_id]
          .orgCount++;
      } else {
        countList[
          db?.indicators &&
            db?.indicators.length > 0 &&
            db?.indicators[0].indicator.table.database.organization_id
        ] = {
          name:
            db?.indicators &&
            db?.indicators.length > 0 &&
            db?.indicators[0].indicator.table.database.organization_id,
          orgCount: 1,
        };
      }
    } else if (name == "table") {
      if (countList[db?.database?.sectors?.code]) {
        countList[db?.database?.sectors?.code].sectorCount++;
      } else {
        countList[db?.database?.sectors?.code] = {
          name: db?.database?.sectors?.code,
          sectorCount: 1,
        };
      }
    } else if (name == "indicator") {
      if (countList[db?.table?.database?.sectors?.code]) {
        countList[db?.table?.database?.sectors?.code].sectorCount++;
      } else {
        countList[db?.table?.database?.sectors?.code] = {
          name: db?.table?.database?.sectors?.code,
          sectorCount: 1,
        };
      }
    } else {
      if (countList[db.sector]) {
        countList[db?.sector].sectorCount++;
      } else {
        countList[db?.sector] = {
          name: db?.sector,
          sectorCount: 1,
        };
      }
    }
  });

  return {
    totalValue,
    count: countList,
  };
};
const TotalOrganization = ({ data, sector, databaseType, name }: any) => {
  const filterData =
    name == "classification"
      ? data?.filter((dataFilter: IClassification) => {
          return (
            dataFilter?.indicators[0]?.indicator.table.database.sector ==
              sector || sector == ""
          );
        })
      : name === "table"
      ? data?.filter((dataFilter: any) => {
          return dataFilter?.database?.sectors?.code == sector || sector == "";
        })
      : name === "indicator"
      ? data?.filter((dataFilter: any) => {
          return (
            dataFilter?.table?.database?.sectors?.code == sector || sector == ""
          );
        })
      : data?.filter(
          (dataFilter: any) =>
            (dataFilter?.sector == sector || sector == "") &&
            (dataFilter?.db_type == databaseType || databaseType == 0)
        );

  const totalValue = filterData?.length || 0;
  const countList: any = {};
  filterData?.forEach((db: any) => {
    if (name == "classification") {
      if (
        db?.indicators &&
        db?.indicators.length > 0 &&
        countList[db?.indicators[0].indicator.table.database.organization_id]
      ) {
        countList[db?.indicators[0].indicator.table.database.organization_id]
          .orgCount++;
      } else {
        countList[
          db?.indicators &&
            db?.indicators.length > 0 &&
            db?.indicators[0].indicator.table.database.organization_id
        ] = {
          name:
            db?.indicators &&
            db?.indicators.length > 0 &&
            db?.indicators[0].indicator.table.database.organization_id,
          orgCount: 1,
        };
      }
    } else if (name == "table") {
      if (countList[db?.database?.organization?.org_id]) {
        countList[db?.database?.organization?.org_id].orgCount++;
      } else {
        countList[db?.database?.organization?.org_id] = {
          name: db?.database?.organization?.org_id,
          orgCount: 1,
        };
      }
    } else if (name == "indicator") {
      if (countList[db?.table?.database?.organization?.org_id]) {
        countList[db?.table?.database?.organization?.org_id].orgCount++;
      } else {
        countList[db?.table?.database?.organization?.org_id] = {
          name: db?.table?.database?.organization?.org_id,
          orgCount: 1,
        };
      }
    } else {
      if (countList[db.organization_id]) {
        countList[db?.organization_id].orgCount++;
      } else {
        countList[db?.organization_id] = {
          name: db?.organization_id,
          orgCount: 1,
        };
      }
    }
  });

  return {
    totalValue,
    count: countList,
  };
};
export { TotalDatabase, TotalSector, TotalOrganization };

export const convertToJson = ({
  headers,
  data,
}: {
  headers: any;
  data: any;
}) => {
  const sliceData = data.slice(1);
  const rows: any = [];
  sliceData.forEach((element: any) => {
    let rowData: any = {};
    element.length > 0 &&
      element.forEach((item: any) => {
        rowData["id"] = element[0];
        rowData["code"] = element[1];
        rowData["name"] = element[2];
      });
    element.length === 3 && rows.push(rowData);
  });
  return rows;
};

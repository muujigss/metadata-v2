import moment from "moment";

const ClassificationDetail = ({ fieldData }: any) => {
  return (
    <table className="site-table w-full text-left rtl:text-right text-secondary-medium">
      <thead className=" text-secondary-default uppercase bg-table-default p-3 text-text-body-medium2">
        <tr>
          <th scope="col" className="px-6 py-3">
            №
          </th>
          <th scope="col" className="px-6 py-3">
            Код
          </th>
          <th scope="col" className="px-6 py-3">
            Утга
          </th>
        </tr>
      </thead>
      <tbody className=" text-text-body-medium2">
        <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
          <th
            scope="row"
            className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
          >
            1
          </th>
          <td className="px-6 py-2">Шифр</td>
          <td className="px-6 py-2">{fieldData?.classification_code}</td>
        </tr>
        <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
          <th
            scope="row"
            className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
          >
            2
          </th>
          <td className="px-6 py-2">Тодорхойлолт</td>
          <td className="px-6 py-2">{fieldData?.classification_definition}</td>
        </tr>
        <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
          <th
            scope="row"
            className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
          >
            3
          </th>
          <td className="px-6 py-2">Маягт батлагдсан огноо</td>
          <td className="px-6 py-2">
            {fieldData?.confirmed_decree_date &&
              moment(fieldData?.confirmed_decree_date).format("YYYY-MM-DD")}
          </td>
        </tr>
        <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
          <th
            scope="row"
            className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
          >
            4
          </th>
          <td className="px-6 py-2">Ангилал, кодыг баталсан эсэх </td>
          <td className="px-6 py-2">
            {fieldData?.is_confirm ? "Тийм" : "Үгүй"}
          </td>
        </tr>
        <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
          <th
            scope="row"
            className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
          >
            5
          </th>
          <td className="px-6 py-2">
            Ангилал, кодыг баталсан тушаал шийдвэрийн нэр
          </td>
          <td className="px-6 py-2">{fieldData?.confirmed_decree_name}</td>
        </tr>
        <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
          <th
            scope="row"
            className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
          >
            6
          </th>
          <td className="px-6 py-2">
            Ангилал, кодыг баталсан тушаал шийдвэрийн дугаар
          </td>
          <td className="px-6 py-2">{fieldData?.confirmed_decree_num}</td>
        </tr>
        <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
          <th
            scope="row"
            className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
          >
            7
          </th>
          <td className="px-6 py-2">Ангилал, кодыг баталсан тушаал огноо</td>
          <td className="px-6 py-2">
            {fieldData?.confirmed_decree_date &&
              moment(fieldData?.confirmed_decree_date).format("YYYY-MM-DD")}
          </td>
        </tr>
        <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
          <th
            scope="row"
            className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
          >
            8
          </th>
          <td className="px-6 py-2">Ангилал, кодыг баталсан байгууллага</td>
          <td className="px-6 py-2">{fieldData?.confirmed_organization1}</td>
        </tr>
        <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
          <th
            scope="row"
            className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
          >
            9
          </th>
          <td className="px-6 py-2">Ангилал, кодыг баталсан байгууллага 2</td>
          <td className="px-6 py-2">{fieldData?.confirmed_organization3}</td>
        </tr>
        <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
          <th
            scope="row"
            className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
          >
            10
          </th>
          <td className="px-6 py-2">Ангилал, кодыг баталсан байгууллага 3</td>
          <td className="px-6 py-2">{fieldData?.confirmed_organization3}</td>
        </tr>
        <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
          <th
            scope="row"
            className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
          >
            11
          </th>
          <td className="px-6 py-2">Ангилал, кодыг нэвтрүүлсэн огноо</td>
          <td className="px-6 py-2">
            {fieldData?.implemented_date &&
              moment(fieldData?.implemented_date).format("YYYY")}
          </td>
        </tr>
        <tr className=" odd:dark:bg-gray-900 even:bg-table-default even:dark:bg-gray-800 border-b dark:border-table-border">
          <th
            scope="row"
            className="px-6 py-2 font-medium text-table-number whitespace-nowrap dark:text-white"
          >
            12
          </th>
          <td className="px-6 py-2">Ангиллыг хамгийн сүүлд шинэчилсэн огноо</td>
          <td className="px-6 py-2">
            {fieldData?.last_updated_date &&
              moment(fieldData?.last_updated_date).format("YYYY")}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
export default ClassificationDetail;

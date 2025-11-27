import path from "path";

export const menuList = [
  {
    menu_id: 1,
    name: "Өгөгдлийн сан",
    path: "/database",
    subdata: [
      { id: 1, name: "Хүснэгтийн мэдээлэл", path: "/table/1" },
      { id: 2, name: "Маягтын мэдээлэл", path: "/form/1" },
    ],
  },

  {
    menu_id: 2,
    name: "Хүснэгт",
    path: "/table",
    subdata: [
      { id: 1, name: "Үзүүлэлт" },
      { id: 2, name: "Ангилал код" },
    ],
  },
  {
    menu_id: 3,
    name: "Үзүүлэлт",
    path: "/indicator",
    subdata: [{ id: 1, name: "Ангилал код" }],
  },
  {
    menu_id: 4,
    name: "Ангилал код",
    path: "/classification",
  },
  {
    menu_id: 5,
    name: "Маягт",
    path: "/form",
  },
];

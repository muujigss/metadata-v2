import type { CustomFlowbiteTheme } from "flowbite-react";

export const breadcrumbTheme: CustomFlowbiteTheme["breadcrumb"] = {
  root: {
    base: "flex flex-wrap",
    list: "flex items-center",
  },
  item: {
    base: "group flex items-center",
    chevron: "mx-1 h-4 w-4 group-first:hidden md:mx-2",
    href: {
      off: "flex items-center ",
      on: "flex items-center ",
    },
  },
};

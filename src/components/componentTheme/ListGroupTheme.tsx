import type { CustomFlowbiteTheme } from "flowbite-react";

export const listGroupTheme: CustomFlowbiteTheme["listGroup"] = {
  root: {
    base: "list-none bg-white text-left text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white",
  },
  item: {
    base: "[&>*]:first:rounded-t-lg [&>*]:last:rounded-b-lg [&>*]:last:border-b-0",
    link: {
      base: "flex w-full items-center ",
      active: {
        off: "hover:bg-secondary-background hover:text-text-body-medium2 focus:text-text-body-medium2 focus:outline-none focus:ring-2 focus:ring-secondary-background ",
        on: "",
      },
      disabled: {
        off: "",
        on: "cursor-not-allowed bg-gray-100 text-gray-900 hover:bg-gray-100 hover:text-gray-900 focus:text-gray-900",
      },
      href: {
        off: "",
        on: "",
      },
      icon: "mr-2 h-4 w-4 fill-current",
    },
  },
};

export const listGroupDetailSidebarTheme: CustomFlowbiteTheme["listGroup"] = {
  root: {
    base: "list-none bg-white text-left text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white",
  },
  item: {
    base: "[&>*]:first:rounded-t-lg [&>*]:last:rounded-b-lg [&>*]:last:border-b-0",
    link: {
      base: "flex w-full items-center ",
      active: {
        off: "hover:bg-secondary-background hover:text-text-body-medium2 focus:text-text-body-medium2 focus:outline-none focus:ring-2 focus:ring-secondary-background ",
        on: "",
      },
      disabled: {
        off: "",
        on: "cursor-not-allowed bg-gray-100 text-gray-900 hover:bg-gray-100 hover:text-gray-900 focus:text-gray-900",
      },
      href: {
        off: "",
        on: "",
      },
      icon: "mr-2 h-4 w-4 fill-current",
    },
  },
};

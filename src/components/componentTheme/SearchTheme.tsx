import type { CustomFlowbiteTheme } from "flowbite-react";

export const textInputTheme: CustomFlowbiteTheme["textInput"] = {
  base: "flex",
  addon:
    "inline-flex items-center rounded-l-md border border-r-0 border-primary-default px-3 text-text-body-meduim2 text-secondary-default",
  field: {
    base: "relative w-full",
    icon: {
      base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
      svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
    },
    rightIcon: {
      base: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
      svg: "h-5 w-5 focus:text-secondary-default",
    },
    input: {
      base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
      sizes: {
        sm: "p-2 sm:text-xs",
        md: "p-2.5 text-sm",
        lg: "p-4 sm:text-base",
      },
      colors: {
        gray: "border-primary-default text-secondary-default focus:border-secondary-default focus:ring-secondary-default placeholder-secondary-default ",
        info: "",
        failure: "",
        warning: "",
        success: "",
      },
      withRightIcon: {
        on: "pr-10",
        off: "",
      },
      withIcon: {
        on: "pl-10",
        off: "",
      },
      withAddon: {
        on: "rounded-r-lg",
        off: "rounded-lg",
      },
      withShadow: {
        on: "shadow-sm dark:shadow-sm-light",
        off: "",
      },
    },
  },
};

export const textSubInputTheme: CustomFlowbiteTheme["textInput"] = {
  base: "flex",
  addon:
    "inline-flex items-center px-3 text-text-body-small text-secondary-default",
  field: {
    base: "relative w-full",
    icon: {
      base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
      svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
    },
    rightIcon: {
      base: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
      svg: "h-5 w-5 focus:text-secondary-default",
    },
    input: {
      base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
      sizes: {
        sm: "p-2 sm:text-xs",
        md: "p-2 text-sm",
        lg: "p-4 sm:text-base",
      },
      colors: {
        gray: "text-text-body-small text-secondary-default border-transparent bg-tab-border focus:bg-transparent focus:ring-0 focus:border-tab-border placeholder-gray-500 placeholder:text-text-body-small",
        info: "",
        failure: "",
        warning: "",
        success: "",
      },
      withRightIcon: {
        on: "pr-10",
        off: "",
      },
      withIcon: {
        on: "pl-10",
        off: "",
      },
      withAddon: {
        on: "rounded-r-lg",
        off: "",
      },
      withShadow: {
        on: "shadow-sm dark:shadow-sm-light",
        off: "",
      },
    },
  },
};

export const textInputClassTheme: CustomFlowbiteTheme["textInput"] = {
  base: "flex",
  addon:
    "inline-flex items-center px-3 text-text-body-small text-secondary-default",
  field: {
    base: "relative w-auto",
    icon: {
      base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
      svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
    },
    rightIcon: {
      base: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
      svg: "h-5 w-5 focus:text-secondary-default",
    },
    input: {
      base: "block w-full h-8 text-text-table-small text-secondary-default border disabled:cursor-not-allowed disabled:opacity-50",
      sizes: {
        sm: "p-2 sm:text-xs",
        md: "",
        lg: "",
      },
      colors: {
        gray: "text-text-body-small border-transparent bg-tab-background focus:ring-0 focus:border-transparent placeholder-gray-500 placeholder:text-text-body-small",
        info: "",
        failure: "",
        warning: "",
        success: "",
      },
      withRightIcon: {
        on: "pr-10",
        off: "",
      },
      withIcon: {
        on: "pl-10",
        off: "",
      },
      withAddon: {
        on: "rounded-r-lg",
        off: "",
      },
      withShadow: {
        on: "shadow-sm dark:shadow-sm-light",
        off: "",
      },
    },
  },
};

export const textInputHomeSearchTheme: CustomFlowbiteTheme["textInput"] = {
  base: "flex",
  addon:
    "inline-flex items-center px-3 text-text-body-small text-secondary-default",
  field: {
    base: "relative w-full",
    icon: {
      base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
      svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
    },
    rightIcon: {
      base: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
      svg: "h-5 w-5 focus:text-secondary-default",
    },
    input: {
      base: "block w-full h-12 text-text-body-meduim text-secondary-default border disabled:cursor-not-allowed disabled:opacity-50",
      sizes: {
        sm: "p-2 sm:text-xs",
        md: "",
        lg: "",
      },
      colors: {
        gray: "text-text-body-meduim border-transparent bg-tab-background focus:ring-0 focus:border-transparent placeholder-gray-500 placeholder:text-text-body-meduim2",
        info: "",
        failure: "",
        warning: "",
        success: "",
      },
      withRightIcon: {
        on: "pr-10",
        off: "",
      },
      withIcon: {
        on: "pl-10",
        off: "",
      },
      withAddon: {
        on: "rounded-r-lg",
        off: "",
      },
      withShadow: {
        on: "shadow-sm dark:shadow-sm-light",
        off: "",
      },
    },
  },
};

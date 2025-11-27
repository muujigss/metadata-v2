import { Select as BaseSelect } from "@mui/base/Select";
import React from "react";
import { Listbox } from "./ListBoxTheme";
import { Popup } from "./PopupTheme";
import { Button } from "./SelectButtonTheme";

export const MultiSelect = React.forwardRef(function CustomMultiSelect(
  props: any,
  ref
) {
  const slots = {
    root: Button,
    listbox: Listbox,
    popup: Popup,
    ...props.slots,
  };

  return <BaseSelect {...props} multiple ref={ref} slots={slots} />;
});

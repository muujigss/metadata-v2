import { switchClasses } from "@mui/base/Switch";
import { styled } from "@mui/system";
import { blue, grey } from "./ColorTheme";

export const SwitchRoot = styled("span")(
  ({ theme }) => `
  position: relative;
  display: inline-block;
  width: 32px;
  height: 20px;
  cursor: pointer;


  & .${switchClasses.track} {
    background: ${theme.palette.mode === "dark" ? grey[600] : grey[400]};
    border-radius: 16px;
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
  }

  & .${switchClasses.thumb} {
    position: relative;
    display: block;
    width: 14px;
    height: 14px;
    top: 3px;
    left: 3px;
    border-radius: 16px;
    background-color: #fff;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  }

  &.${switchClasses.focusVisible} .${switchClasses.track} {
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? grey[700] : blue[200]
    };
  }

  &.${switchClasses.checked} {
    .${switchClasses.thumb} {
      left: 15px;
      top: 3px;
      background-color: #fff;
    }

    .${switchClasses.track} {
      background: ${blue[600]};
    }
  }

  & .${switchClasses.input} {
    cursor: inherit;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 1;
    margin: 0;
  }
  `
);

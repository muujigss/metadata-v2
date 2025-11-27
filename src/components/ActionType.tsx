"use client";
import { updateActionService } from "@/services/ActionService";
import { useGetActionType } from "@/utils/customHooks";
import useCurrentUser from "@/utils/useCurrentUser";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { SelectComponent } from "./admin/form";
import TooltipComponent from "./admin/formComponents/TooltipComponent";
import Loader from "./Loader";

const ActionType = ({
  action_type,
  user_level,
  user_id,
  dbId,
}: {
  action_type: number;
  user_level: number;
  user_id: number;
  dbId: number;
}) => {
  let [loading, setLoading] = useState(false);
  const [aType, setAType] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const { data: actionType, isLoading: actionTypeLoading } = useGetActionType();

  const { userInfo } = useCurrentUser();

  if (loading) return <Loader />;
  if (actionTypeLoading) return <Loader />;

  let txtAction = actionType.find((item: any) => item.id == action_type)?.name;

  let txtStatusColor =
    action_type == 1
      ? "primary"
      : action_type == 2
      ? "warning"
      : action_type == 3
      ? "success"
      : "error";

  const onSendActions = async (actionType: number) => {
    try {
      setLoading(true);

      let res = await updateActionService({
        item_id: dbId,
        user_id: user_id,
        action_type: actionType,
      });

      if (!res?.status) {
        return setAlertMessage(res?.message);
      } else {
        window.location.reload();
      }
    } catch (error) {
    } finally {
      console.log("finally");
      setLoading(false);
    }
  };
  // console.log({ user_level, action_type, userInfo });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        mt: 1,
        gap: 1,
      }}
    >
      <p className="py-1 text-justify text-wrap">Төлөв</p>

      <TooltipComponent
        content="Хүсэлт илгээх, Хүлээгдэж буй, 
    Баталсан, Буцаагдсан (Хүсэлт дахин илгээх) гэсэн төлөв харагдана"
      />

      {user_level == 3 || user_level == 2 ? (
        action_type == 1 || action_type == 4 ? (
          <>
            {userInfo?.roles?.find(
              (item: any) => item.id == 3 || item.id == 1
            ) && (
              <Button
                variant="outlined"
                color={txtStatusColor}
                size="small"
                onClick={() => onSendActions(2)}
              >
                {action_type == 4 ? " Хүсэлт дахин илгээх" : txtAction}
              </Button>
            )}
          </>
        ) : (
          userInfo?.roles?.find(
            (item: any) => item.id == 3 || item.id == 1
          ) && (
            <Typography
              color={txtStatusColor}
              sx={{ textTransform: "uppercase" }}
            >
              {txtAction}
            </Typography>
          )
        )
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user_level == 1 ? (
            <>
              <SelectComponent
                options={actionType.filter((item: any) => {
                  console.log({ item });
                  // && action_type == 2
                  if (action_type == 2) {
                    if (item.id == 3 || item.id == 4) {
                      return {
                        id: item.id,
                        name: item.name,
                      };
                    }
                  } else if (action_type == 3) {
                    if (item.id == 4) {
                      return {
                        id: item.id,
                        name: item.name,
                      };
                    }
                  }
                })}
                label=""
                name="action_type"
                defaultValue={aType}
                onChange={(e: any, value: any) => {
                  setAType(value);
                }}
              />
              <Button
                variant="outlined"
                color={"info"}
                size="small"
                onClick={() => onSendActions(aType)}
              >
                Хадгалах
              </Button>
            </>
          ) : (
            <Typography
              color={txtStatusColor}
              sx={{ textTransform: "uppercase" }}
            >
              {txtAction}
            </Typography>
          )}
        </Box>
      )}
      {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
    </Box>
  );
};

export default ActionType;

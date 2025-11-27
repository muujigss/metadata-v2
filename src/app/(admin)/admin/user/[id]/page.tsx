import Loader from "@/components/Loader";
import UserEditBar from "@/components/user/UserEditBar";
import { ISpecification } from "@/interfaces/ISpecification";
import { IUser } from "@/interfaces/IUser";
import { getUserRoleModel } from "@/services/model/LibUserRoleModel";
import { getUserDetailService } from "@/services/UserService";
import {
  Avatar,
  Box,
  CardContent,
  Divider,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import { Kbd } from "flowbite-react";
import moment from "moment";
type searchParamsProps = {
  id: string;
};

const UserDetailPage = async ({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams?: searchParamsProps;
}) => {
  // console.log({ params });
  const id = { params }.params.id;

  const userId = id;
  const userDetail: IUser = await getUserDetailService(Number(userId));

  const userRoles = await getUserRoleModel();

  if (userDetail == null) {
    <Loader />;
  }

  // console.log({ userDetail: userDetail?.roles });

  return (
    <Box sx={{ display: "flex", width: "100%", flexDirection: "row" }}>
      <Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "40%",
          }}
        >
          <Typography variant="h5">Хэрэглэгчийн мэдээлэл</Typography>
          <Stack direction="row">
            <UserEditBar userId={userDetail?.id} type="one" />
          </Stack>
        </Box>
        <Grid2 container>
          <Divider />
          <CardContent>
            <Box sx={{ overflow: "auto" }}>
              <Box>
                <Box p={1}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                      alt={userDetail?.profile_img_url}
                      src={userDetail?.profile_img_url}
                      sx={{ width: "72px", height: "72px" }}
                    />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6" mb={0.5}>
                        {userDetail?.firstname} {userDetail?.lastname}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={0.5}
                        fontWeight={600}
                      >
                        {userDetail?.organization?.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Grid2 container>
                    <Grid2 size={{ xs: 12, sm: 6, lg: 6 }}>
                      <Typography
                        variant="body2"
                        mb={0.5}
                        color="text.secondary"
                      >
                        Хэрэглэгчийн түвшин
                      </Typography>
                      <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                        {userDetail?.userLevel?.name}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, lg: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Гар утасны дугаар
                      </Typography>
                      <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                        {userDetail?.mobile}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, lg: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Утасны дугаар
                      </Typography>
                      <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                        {userDetail?.phone_number}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, lg: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        И-мэйл хаяг
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                        {userDetail?.email}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, lg: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Хэлтсийн нэр
                      </Typography>
                      <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                        {userDetail?.department}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, lg: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Албан тушаал
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                        {userDetail?.position}
                      </Typography>
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, lg: 6 }}>
                      <Typography variant="body2" mb={1} color="text.secondary">
                        Хэрэглэгчийн эрх
                      </Typography>
                      <Typography variant="subtitle1" mb={0.5}>
                        {userDetail.roles &&
                          userDetail?.roles?.length > 0 &&
                          userDetail?.roles.map((item, i) => (
                            <div className="m-1" key={i}>
                              <Kbd className=" font-thin text-text-table-small">
                                {userRoles?.find(
                                  (spec: ISpecification) => spec.id == +item.id
                                )?.name || item.id}
                              </Kbd>
                            </div>
                          ))}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, lg: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Хамгийн сүүлд нэвтэрсэн огноо
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                        {moment(userDetail?.last_login_date).format(
                          "YYYY-MM-DD"
                        )}
                      </Typography>
                    </Grid2>
                  </Grid2>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Grid2>
      </Stack>
    </Box>
  );
};

export default UserDetailPage;

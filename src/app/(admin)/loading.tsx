import { Box, LinearProgress, Skeleton, Typography } from "@mui/material";

export default function Loading() {
  return <Box role="status" aria-label="Хуудас ачаалж байна" sx={{ p: 2, minHeight: 400 }}>
    <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />
    <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>Хуудас ачаалж байна…</Typography>
    <Skeleton width="35%" height={40} />
    <Skeleton height={64} />
    {[0, 1, 2, 3].map(row => <Skeleton key={row} variant="rounded" height={48} sx={{ my: 1 }} />)}
  </Box>;
}

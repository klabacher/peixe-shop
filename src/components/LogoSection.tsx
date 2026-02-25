import { Box, Typography } from "@mui/joy";
import { useStoreSettings } from "../context/useStoreSettings";

export default function LogoSection() {
  const { settings } = useStoreSettings();

  return (
    <Box sx={{ p: 3, textAlign: "center", backgroundColor: "background.body" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        <Typography
          level="h4"
          component="h1"
          sx={{
            cursor: "pointer",
            fontWeight: 800,
            color: "primary.500",
          }}
        >
          {settings.storeName}
        </Typography>
        <Typography
          level="h4"
          component="h1"
          sx={{
            cursor: "pointer",
            fontWeight: 800,
            color: "primary.500",
          }}
        >
          {settings.storeSubname}
        </Typography>
      </div>
      <Typography
        level="h2"
        sx={{
          mb: 1,
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "primary.500",
        }}
      >
        {settings.storeTagline}
      </Typography>

      <Typography
        level="body-md"
        sx={{ maxWidth: "600px", mx: "auto", color: "text.secondary" }}
      >
        {settings.storeDescription}
      </Typography>
    </Box>
  );
}

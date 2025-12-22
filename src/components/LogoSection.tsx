import { Box, Typography } from "@mui/joy";

export default function LogoSection() {
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
          VIGANÔ
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
          PESCADOS
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
        O Frescor do Mar, na Sua Mesa.
      </Typography>

      <Typography
        level="body-md"
        sx={{ maxWidth: "600px", mx: "auto", color: "text.secondary" }}
      >
        Há anos selecionando os peixes mais nobres e os camarões mais frescos
        para você. Nossa missão é levar saúde, sabor e a tradição da alta
        gastronomia diretamente para a sua família em Colatina.
      </Typography>
    </Box>
  );
}

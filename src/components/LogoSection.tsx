import { Box, Typography } from "@mui/joy";
import SvgLogoIcon from "../assets/svgicon.svg";

export default function LogoSection() {
  return (
    <Box sx={{ p: 2 }}>
      <img src={SvgLogoIcon} />
      <Typography level="h2" sx={{ mb: 2, fontSize: "1.5rem" }}>
        Sobre nós:
      </Typography>
      <Typography level="h3">
        Peixes e camarões selecionados
        Qualidade, procedência e sabor na sua mesa
      </Typography>
      <Typography level="h3">
        Colatina - ES
      </Typography>
    </Box>
  );
}

import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Badge from "@mui/joy/Badge";
import { useNavigate } from "react-router-dom";
import SvgLogoIcon from "../assets/svgicon.svg";

interface HeaderProps {
  cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <Sheet
      variant="solid"
      color="primary"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "sm",
      }}
    >
      <img src={SvgLogoIcon} style={{ height: 60, filter: "brightness(0) invert(1)" }} alt="Viganô Pescados" />

      <Sheet
        component="button"
        type="button"
        onClick={() => navigate("/cart")}
        variant="outlined"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: "6px",
          borderRadius: "lg",
          border: "1px solid ---joy-palette-primary-outlinedBorder",
          bgcolor: "--joy-palette-common-whit",
          color: "primary.solidColor",
          fontWeight: "md",
          cursor: "pointer",
          transition:
            "transform 150ms ease, background-color 150ms ease, box-shadow 150ms ease",
          "&:hover": {
            bgcolor: "--joy-palette-common-white",
            transform: "translateY(-2px)",
            boxShadow: "md",
          },
        }}
        aria-label={`Carrinho, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
      >
        <IconButton
          component="span"
          variant="plain"
          sx={{ p: 0, color: "--joy-palette-common-white" }}
        >
          <Badge badgeContent={cartCount} color="success" size="sm">
            <ShoppingBagIcon />
          </Badge>
        </IconButton>
        <Typography color="primary" level="title-sm" sx={{ fontWeight: 800,
            color: "primary.500", }}>
          MEU <br /> CARRINHO
        </Typography>
      </Sheet>
    </Sheet>
  );
}

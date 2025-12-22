import * as React from "react";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import Chip from "@mui/joy/Chip";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import LogoSection from "../components/LogoSection";
import { products, type Product } from "../data/mockData";
import { useCart } from "../context/CartContext";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import WhatshotIcon from "@mui/icons-material/Whatshot";

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] =
    React.useState("Mais Pedidos");
  const { addToCart, count } = useCart();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Lista de Categorias para as Abas
  const categories = [
    { id: "Mais Pedidos", label: "Mais Pedidos", icon: <WhatshotIcon /> },
    { id: "Promoções", label: "Ofertas", icon: <LocalOfferIcon /> },
    { id: "Peixes", label: "Peixes", icon: null },
    { id: "Frutos do Mar", label: "Frutos do Mar", icon: null },
    { id: "Combos", label: "Kits & Combos", icon: null },
    { id: "Bebidas", label: "Bebidas", icon: null },
  ];

  // Lógica de Filtragem
  const filteredProducts = React.useMemo(() => {
    switch (selectedCategory) {
      case "Mais Pedidos":
        // Retorna produtos marcados como bestSeller ou os 4 primeiros como fallback
        return products.filter((p) => p.isBestSeller) || products.slice(0, 4);
      case "Promoções":
        // Retorna apenas produtos com originalPrice (indica desconto)
        return products.filter(
          (p) => p.originalPrice && p.originalPrice > p.price
        );
      default:
        // Filtra pela string da categoria
        return products.filter((p) => p.category === selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <Box
      sx={{
        pb: { xs: 0, sm: 12 },
        bgcolor: "background.body",
        minHeight: "100vh",
      }}
    >
      <Header cartCount={count} />

      <LogoSection />

      {/* Área de Abas (Sticky - cola no topo ao rolar) */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 99,
          bgcolor: "background.body",
          pt: 1,
          pb: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        <Tabs
          aria-label="Categorias de produtos"
          value={selectedCategory}
          onChange={(_event, newValue) =>
            setSelectedCategory(newValue as string)
          }
          sx={{ bgcolor: "transparent" }}
        >
          <TabList
            disableUnderline
            sx={{
              p: 0.5,
              gap: 1.5,
              borderRadius: "xl",
              bgcolor: "background.body",
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              overflowX: "auto",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": { height: 8 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.12)",
                borderRadius: 8,
              },
              "& > button": {
                scrollSnapAlign: "start",
                flex: "0 0 auto",
              },
              [`& .${tabClasses.root}`]: {
                boxShadow: "none",
                fontWeight: "md",
                borderRadius: "sm", // Formato de pílula
                whiteSpace: "nowrap",
                transition: "0.2s",
                px: { xs: 2, sm: 2.5 },
                py: 1,
                border: "1px solid",
                borderColor: "neutral.200",
                minWidth: { xs: 120, sm: "auto" }, // touch-friendly width on mobile
                [`&.${tabClasses.selected}`]: {
                  bgcolor: "primary.500",
                  color: "white",
                  borderColor: "primary.500",
                  fontWeight: "lg",
                },
                [`&:not(.${tabClasses.selected}):hover`]: {
                  bgcolor: "neutral.100",
                },
              },
            }}
          >
            {categories.map((cat) => (
              <Tab key={cat.id} value={cat.id} disableIndicator>
                {cat.icon && (
                  <Box component="span" sx={{ mr: 1, display: "inherit" }}>
                    {cat.icon}
                  </Box>
                )}
                {cat.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Box>

      <Box sx={{ px: 2, mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            level="h2"
            sx={{ fontSize: "1.25rem", fontWeight: 800, color: "text.primary" }}
          >
            {selectedCategory === "Promoções"
              ? "Ofertas Imperdíveis 🔥"
              : selectedCategory}
          </Typography>
          <Chip size="sm" variant="soft" color="neutral">
            {filteredProducts.length} itens
          </Chip>
        </Box>

        {filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
            <Typography>
              Nenhum produto encontrado nesta categoria hoje.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredProducts.map((product) => (
              <Grid key={product.id} xs={12} sm={6} md={3}>
                <ProductCard product={product} onClick={handleProductClick} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Footer (rendered at the end of the page) */}
      <Box
        component="footer"
        sx={{
          bgcolor: "primary.500",
          color: "white",
          pt: 2,
          pb: 2,
          textAlign: "center",
          fontWeight: "md",
          mt: 4,
          boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
        }}
      >
        © 2024 Viganô Pescados. Todos os direitos reservados.
      </Box>

      <ProductModal
        open={!!selectedProduct}
        onClose={handleCloseModal}
        product={selectedProduct}
        onAddToCart={addToCart}
      />
    </Box>
  );
}

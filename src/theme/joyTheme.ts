// import { extendTheme } from '@mui/joy/styles';

// // Configuração das Fontes
// const fontFamilyDisplay = "'Montserrat', sans-serif";
// const fontFamilyBody = "'Inter', sans-serif";

// // Novos Tokens de Design baseados no Relatório
// export const brand = {
//   navy: '#003366',       // Azul Marinho Profundo (Marca)
//   coral: '#FF6B6B',      // Coral Vivo (Ação/Conversion)
//   white: '#FFFFFF',
//   offWhite: '#F7F8FA',   // Fundo App (Depth)
//   grayDark: '#2D3436',   // Títulos
//   grayMedium: '#636E72', // Descrições
//   greenSuccess: '#00C853' // Feedback positivo
// } as const;

// export const joyTheme = extendTheme({
//   fontFamily: {
//     body: fontFamilyBody,
//     display: fontFamilyDisplay,
//   },
//   radius: {
//     xs: '8px',
//     sm: '12px',
//     md: '16px', // Padrão novo para Cards
//     lg: '24px',
//     xl: '32px',
//   },
//   shadow: {
//     // Sistema de sombras coloridas (tinturadas de azul) para efeito "flutuante"
//     xs: '0 2px 4px rgba(0, 51, 102, 0.05)',
//     sm: '0 4px 8px rgba(0, 51, 102, 0.08)',
//     md: '0 8px 16px rgba(0, 51, 102, 0.12)', // Sombra padrão do card
//     lg: '0 12px 24px rgba(0, 51, 102, 0.15)',
//     xl: '0 20px 40px rgba(0, 51, 102, 0.20)',
//   },
//   colorSchemes: {
//     light: {
//       palette: {
//         primary: {
//           // Usamos o Azul Navy como cor primária institucional
//           500: brand.navy,
//           plainColor: brand.navy,
//           solidBg: brand.navy,
//           solidHoverBg: 'rgba(0, 51, 102, 0.9)',
//           solidColor: brand.white,
//         },
//         // O "Danger" ou uma cor customizada pode atuar como o Coral de ação principal
//         danger: {
//           500: brand.coral,
//           plainColor: brand.coral,
//           solidBg: brand.coral,
//           solidHoverBg: '#FF5252',
//           solidColor: brand.white,
//         },
//         success: {
//           500: brand.greenSuccess,
//           solidBg: brand.greenSuccess,
//         },
//         neutral: {
//           // Ajuste de tons de cinza para melhor leitura
//           500: brand.grayMedium,
//           700: brand.grayDark,
//           800: '#1F2937',
//         },
//         background: {
//           body: brand.offWhite, // Fundo geral off-white
//           surface: brand.white, // Cards brancos puros
//         },
//         text: {
//           primary: brand.grayDark,
//           secondary: brand.grayMedium,
//         },
//       },
//     },
//   },
//   components: {
//     JoyButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: '12px', // Botões mais arredondados
//           fontFamily: fontFamilyDisplay,
//           fontWeight: 700,
//           transition: 'all 0.2s ease',
//           '&:active': {
//             transform: 'scale(0.96)', // Feedback tátil visual
//           },
//         },
//       },
//     },
//     JoyCard: {
//       styleOverrides: {
//         root: {
//           border: 'none', // Removemos a borda cinza padrão
//           backgroundColor: brand.white,
//           borderRadius: '16px',
//           boxShadow: '0 8px 16px rgba(0, 51, 102, 0.08)', // Sombra atmosférica
//           transition: 'transform 0.2s ease, box-shadow 0.2s ease',
//           '&:hover': {
//             transform: 'translateY(-4px)', // Efeito de elevação
//             boxShadow: '0 12px 24px rgba(0, 51, 102, 0.12)',
//           },
//         },
//       },
//     },
//     JoyTypography: {
//       styleOverrides: {
//         root: ({ ownerState }) => ({
//           ...(ownerState.level?.includes('h') && {
//             fontFamily: fontFamilyDisplay,
//             letterSpacing: '-0.02em', // Tight tracking para títulos modernos
//           }),
//         }),
//       },
//     },
//   },
// });

// export default joyTheme;

import { extendTheme } from '@mui/joy/styles';

const fontFamilyDisplay = "'Montserrat', sans-serif";
const fontFamilyBody = "'Inter', sans-serif";

export const brand = {
  navy: '#003366',       
  coral: '#FF6B6B',      
  white: '#FFFFFF',
  offWhite: '#F7F8FA', 
  grayDark: '#2D3436',   
  grayMedium: '#636E72',
  greenSuccess: '#00C853'
} as const;

export const joyTheme = extendTheme({
  fontFamily: {
    body: fontFamilyBody,
    display: fontFamilyDisplay,
  },
  radius: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadow: {
    xs: '0 2px 4px rgba(0, 51, 102, 0.05)',
    sm: '0 4px 8px rgba(0, 51, 102, 0.08)',
    md: '0 8px 16px rgba(0, 51, 102, 0.12)',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          500: brand.navy,
          solidBg: brand.navy,
          solidHoverBg: 'rgba(0, 51, 102, 0.9)',
          solidColor: brand.white,
        },
        danger: {
          500: brand.coral,
          solidBg: brand.coral,
          solidHoverBg: '#FF5252',
          solidColor: brand.white,
        },
        neutral: {
          100: '#F0F2F5', // Fundo hover das abas
        },
        background: {
          body: brand.offWhite,
          surface: brand.white,
        },
      },
    },
  },
});

export default joyTheme;
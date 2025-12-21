import { extendTheme } from '@mui/joy/styles';
import { fontFamilyBody, fontFamilyDisplay } from './fonts';

export const brand = {
  blue: '#004B87',
  green: '#00A651',
  white: '#FFFFFF',
  gray: '#6B7280',
  yellow: '#F4A020',
  red: '#E63946',
} as const;

export const joyTheme = extendTheme({
  fontFamily: {
    body: fontFamilyBody,
    display: fontFamilyDisplay,
  },
  radius: {
    xs: '10px',
    sm: '10px',
    md: '10px',
    lg: '10px',
    xl: '10px',
  },
  shadow: {
    xs: '0 1px 6px rgba(0,0,0,0.05)',
    sm: '0 2px 10px rgba(0,0,0,0.06)',
    md: '0 6px 18px rgba(0,0,0,0.10)',
    lg: '0 10px 30px rgba(0,0,0,0.12)',
    xl: '0 16px 40px rgba(0,0,0,0.14)',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          500: brand.blue,
          plainColor: brand.blue,
          solidBg: brand.blue,
          solidHoverBg: 'rgba(0, 75, 135, 0.92)',
          solidColor: brand.white,
          outlinedBorder: 'rgba(0, 75, 135, 0.22)',
          outlinedHoverBorder: 'rgba(0, 75, 135, 0.32)',
        },
        success: {
          500: brand.green,
          plainColor: brand.green,
          solidBg: brand.green,
          solidHoverBg: 'rgba(0, 166, 81, 0.92)',
          solidColor: brand.white,
        },
        warning: {
          500: brand.yellow,
          plainColor: brand.yellow,
          solidBg: brand.yellow,
          solidHoverBg: 'rgba(244, 160, 32, 0.92)',
          solidColor: brand.white,
        },
        danger: {
          500: brand.red,
          plainColor: brand.red,
          solidBg: brand.red,
          solidHoverBg: 'rgba(230, 57, 70, 0.92)',
          solidColor: brand.white,
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: brand.gray,
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        background: {
          body: brand.white,
          surface: brand.white,
        },
        text: {
          secondary: brand.gray,
        },
        divider: 'rgba(0, 75, 135, 0.12)',
      },
    },
  },
  components: {
    JoyButton: {
      defaultProps: {
        variant: 'solid',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '10px',
          fontFamily: fontFamilyDisplay,
          fontWeight: 700,
        },
      },
    },
    JoyCard: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          backgroundColor: brand.white,
          borderColor: 'rgba(0, 75, 135, 0.12)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          transition: 'box-shadow 150ms ease, border-color 150ms ease',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(0,0,0,0.10)',
            borderColor: 'rgba(0, 75, 135, 0.22)',
          },
        },
      },
    },
    JoyInput: {
      styleOverrides: {
        root: {
          '--Input-radius': '10px',
          '--Input-focusedHighlight': brand.blue,
          '--Input-placeholderColor': brand.gray,
        },
        input: {
          '&::placeholder': {
            color: brand.gray,
            opacity: 1,
          },
        },
      },
    },
    JoyLink: {
      defaultProps: {
        color: 'primary',
      },
      styleOverrides: {
        root: {
          '&:hover': {
            color: 'success.plainColor',
          },
        },
      },
    },
  },
});

export default joyTheme;

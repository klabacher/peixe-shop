import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
          solidBg: '#EA0029', // iFood red-ish for primary actions
          solidHoverBg: '#B80020',
          solidColor: '#fff',
        },
        neutral: {
          plainColor: '#414141',
          plainHoverColor: '#212121',
        },
        background: {
          body: '#f5f5f5',
          surface: '#ffffff',
        },
      },
    },
  },
  fontFamily: {
    body: 'Anton, Inter, var(--joy-fontFamily-fallback)',
    display: 'Anton, Inter, var(--joy-fontFamily-fallback)',
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    JoyCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default theme;
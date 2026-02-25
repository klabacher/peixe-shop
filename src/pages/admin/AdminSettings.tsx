import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Grid,
  Divider,
  Sheet,
  Alert,
  CircularProgress,
  Card,
} from '@mui/joy';
import SaveIcon from '@mui/icons-material/Save';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useStoreSettings } from '../../context/useStoreSettings';
import { updateStoreSettings } from '../../firebase/admin';
import { changeAdminPassword } from '../../firebase/auth';
import type { StoreSettings } from '../../types/product';

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}

export default function AdminSettings() {
  const { settings, loading: settingsLoading, refresh } = useStoreSettings();
  const [form, setForm] = useState<StoreSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // CEP lookup
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  useEffect(() => {
    if (!settingsLoading) {
      setForm(settings);
    }
  }, [settings, settingsLoading]);

  const handleChange = (field: keyof StoreSettings, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    handleChange('addressCep', formatted);
    
    const digits = formatted.replace(/\D/g, '');
    if (digits.length === 8) {
      lookupCep(digits);
    }
  };

  const lookupCep = async (cep: string) => {
    setCepLoading(true);
    setCepError('');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        setCepError('CEP não encontrado');
        return;
      }
      setForm(prev => ({
        ...prev,
        address: data.logradouro ? `${data.logradouro}${data.bairro ? ` - ${data.bairro}` : ''}` : prev.address,
        addressCity: data.localidade || prev.addressCity,
        addressState: data.uf || prev.addressState,
      }));
      setSaved(false);
    } catch {
      setCepError('Erro ao buscar CEP');
    } finally {
      setCepLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateStoreSettings(form);
      setSaved(true);
      refresh();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter ao menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    setPasswordSaving(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setPasswordSuccess('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(
        err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
          ? 'Senha atual incorreta'
          : err.message || 'Erro ao alterar senha'
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  if (settingsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Store Info Section */}
      <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 'xl' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <StorefrontIcon sx={{ color: 'primary.500' }} />
          <Typography level="h4">Dados da Loja</Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <FormControl required>
              <FormLabel>Nome da Marca</FormLabel>
              <Input
                value={form.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                placeholder="VIGANÔ"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl required>
              <FormLabel>Subnome da Marca</FormLabel>
              <Input
                value={form.storeSubname}
                onChange={(e) => handleChange('storeSubname', e.target.value)}
                placeholder="PESCADOS"
              />
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <FormControl required>
              <FormLabel>Tagline</FormLabel>
              <Input
                value={form.storeTagline}
                onChange={(e) => handleChange('storeTagline', e.target.value)}
                placeholder="O Frescor do Mar, na Sua Mesa."
              />
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <FormControl required>
              <FormLabel>Descrição da Loja</FormLabel>
              <Textarea
                value={form.storeDescription}
                onChange={(e) => handleChange('storeDescription', e.target.value)}
                placeholder="Descrição sobre a loja..."
                minRows={3}
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl required>
              <FormLabel>WhatsApp (com DDD)</FormLabel>
              <Input
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="5527999999999"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl required>
              <FormLabel>Horário de Funcionamento</FormLabel>
              <Input
                value={form.openingHours}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                placeholder="Seg a Sex, 09:00 às 19:00"
              />
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Address Section */}
      <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 'xl' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <LocationOnIcon sx={{ color: 'primary.500' }} />
          <Typography level="h4">Endereço</Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid xs={12} sm={4}>
            <FormControl required>
              <FormLabel>CEP</FormLabel>
              <Input
                value={form.addressCep}
                onChange={(e) => handleCepChange(e.target.value)}
                placeholder="00000-000"
                endDecorator={
                  cepLoading ? (
                    <CircularProgress size="sm" />
                  ) : (
                    <SearchIcon
                      sx={{ cursor: 'pointer', color: 'neutral.500' }}
                      onClick={() => {
                        const digits = form.addressCep.replace(/\D/g, '');
                        if (digits.length === 8) lookupCep(digits);
                      }}
                    />
                  )
                }
              />
              {cepError && (
                <Typography level="body-xs" color="danger" sx={{ mt: 0.5 }}>
                  {cepError}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid xs={12} sm={8}>
            <FormControl required>
              <FormLabel>Endereço</FormLabel>
              <Input
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Rua, Número - Bairro"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl required>
              <FormLabel>Cidade</FormLabel>
              <Input
                value={form.addressCity}
                onChange={(e) => handleChange('addressCity', e.target.value)}
                placeholder="Colatina"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl required>
              <FormLabel>Estado</FormLabel>
              <Input
                value={form.addressState}
                onChange={(e) => handleChange('addressState', e.target.value)}
                placeholder="ES"
              />
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <FormControl>
              <FormLabel>Busca do Google Maps (query)</FormLabel>
              <Input
                value={form.mapsEmbedQuery}
                onChange={(e) => handleChange('mapsEmbedQuery', e.target.value)}
                placeholder="Colatina, ES, Brasil"
              />
              <Typography level="body-xs" sx={{ mt: 0.5, color: 'text.tertiary' }}>
                Usado para o embed do mapa no rodapé da loja
              </Typography>
            </FormControl>
          </Grid>

          {/* Maps Preview */}
          {form.mapsEmbedQuery && (
            <Grid xs={12}>
              <Sheet variant="outlined" sx={{ borderRadius: 'lg', overflow: 'hidden', mt: 1 }}>
                <iframe
                  title="Localização da Loja"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(form.mapsEmbedQuery)}&output=embed`}
                />
              </Sheet>
            </Grid>
          )}
        </Grid>
      </Card>

      {/* Save Button */}
      {error && (
        <Alert color="danger" variant="soft">
          {error}
        </Alert>
      )}
      {saved && (
        <Alert color="success" variant="soft" startDecorator={<CheckCircleIcon />}>
          Configurações salvas com sucesso!
        </Alert>
      )}
      <Button
        size="lg"
        startDecorator={saving ? <CircularProgress size="sm" /> : <SaveIcon />}
        onClick={handleSave}
        loading={saving}
        sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
      >
        Salvar Configurações
      </Button>

      <Divider />

      {/* Password Section */}
      <Card variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 'xl' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <LockIcon sx={{ color: 'primary.500' }} />
          <Typography level="h4">Alterar Senha</Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid xs={12}>
            <FormControl>
              <FormLabel>Senha Atual</FormLabel>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl>
              <FormLabel>Nova Senha</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormControl>
              <FormLabel>Confirmar Nova Senha</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
              />
            </FormControl>
          </Grid>
        </Grid>

        {passwordError && (
          <Alert color="danger" variant="soft" sx={{ mt: 2 }}>
            {passwordError}
          </Alert>
        )}
        {passwordSuccess && (
          <Alert color="success" variant="soft" sx={{ mt: 2 }} startDecorator={<CheckCircleIcon />}>
            {passwordSuccess}
          </Alert>
        )}

        <Button
          variant="soft"
          color="warning"
          startDecorator={<LockIcon />}
          onClick={handlePasswordChange}
          loading={passwordSaving}
          disabled={!currentPassword || !newPassword || !confirmPassword}
          sx={{ mt: 2, alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
        >
          Alterar Senha
        </Button>
      </Card>
    </Box>
  );
}

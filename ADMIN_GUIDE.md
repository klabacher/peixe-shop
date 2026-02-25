# 🔐 Guia do Painel Administrativo

## 📋 Visão Geral

O painel administrativo oferece uma interface completa para gerenciar produtos, categorias e configurações da loja Viganô Pescados.
- ✅ Autenticação segura (Email/Senha)
- ✅ Rotas protegidas (Apenas admin autorizado)
- ✅ Gestão de Produtos (Criar, Editar, Excluir) com upload de imagens
- ✅ Gestão de Categorias e Estoque
- ✅ Configurações Dinâmicas da Loja (Nome, Endereço, Horários, etc.)

---

## 🚀 Acesso Rápido

### 1. Acessar o Painel
Navegue para: **/admin/login**

### 2. Login
Utilize as credenciais de administrador configuradas no banco de dados.
- **Email Padrão**: `admin@vigano.com.br`
- **Senha Padrão**: Definida durante o seed inicial (geralmente `Admin@123` em dev)

> **Nota**: Não há opção de registro público. Contas de administração devem ser criadas via seed ou diretamente no Firebase Console.

---

## 🎯 Funcionalidades

### Gestão de Produtos
- **Novo Produto**: Botão "Novo produto" no topo do dashboard.
- **Editar**: Clique no botão "Editar" no card do produto.
- **Excluir**: Ícone de lixeira no card do produto (requer confirmação).
- **Imagens**: Upload direto para o Supabase Storage (suporta Drag & Drop).
- **Preços**: 
  - *Preço*: Valor atual de venda.
  - *Preço Original*: Use para mostrar promoções (aparecerá como "De R$ X" riscado).
- **Destaque**: Marque "Mais vendido" para aparecer na seção principal da Home.

### Configurações da Loja (Nova Aba)
Acesse a aba **"Configurações"** no Dashboard para alterar:
- **Identidade**: Nome da loja, subnome, slogan e descrição.
- **Contato**: Telefone (WhatsApp), Endereço completo.
- **Visualização**: Query do Google Maps para o rodapé.
- **Segurança**: Alterar a senha do administrador atual.

### Gestão de Categorias
Acesse a aba **"Categorias"** para visualizar estatísticas por categoria (quantidade de produtos, estoque).

---

## 🔒 Segurança

### Proteção de Rotas
O acesso às rotas `/admin/*` é protegido por verificação de autenticação e email autorizado.
A lista de emails permitidos está configurada em `src/components/ProtectedRoute.tsx`.

### Regras do Firestore
As regras de segurança (`firestore.rules`) garantem que apenas o administrador autenticado possa realizar operações de escrita (criar, editar, excluir). A leitura é pública para permitir o funcionamento da vitrine.

---

## 🛠️ Solução de Problemas

### Esqueci a Senha
O sistema não possui reset de senha automático por email. Para recuperar o acesso:
1. Acesse o console do Firebase Authentication.
2. Localize o usuário `admin@vigano.com.br`.
3. Defina uma nova senha manualmente ou exclua o usuário e rode o script de seed novamente.

### Erro no Upload de Imagem
- Verifique se o arquivo tem menos de 5MB.
- Certifique-se de que é um formato válido (JPG, PNG, WEBP).
- Verifique se as variáveis de ambiente do Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) estão corretas em `.env.local`.

---

## 📦 Backup e Dados
O sistema utiliza cache local e persistência do carrinho, mas os dados principais residem no **Firebase Firestore**. Recomenda-se realizar backups periódicos do Firestore através do console do Google Cloud, se necessário.

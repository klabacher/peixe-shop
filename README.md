# Viganô Pescados - E-commerce
a

<div align="center">
  <img src="/favicon.png" alt="Viganô Pescados Logo" width="120" />
  <h3>Peixaria & Frutos do Mar Frescos</h3>
</div>

Uma plataforma de e-commerce moderna desenvolvida para a Viganô Pescados, focada na venda de peixes e frutos do mar com integração direta via WhatsApp.

---

## 🚀 Funcionalidades Principais

### 🛍️ Vitrine Digital
  - **Catálogo Dinâmico**: Produtos organizados por categorias (Peixes, Camarões, Frutos do Mar, etc.)
  - **Destaques**: Seção de "Mais Pedidos" e "Ofertas" com preços promocionais
  - **Detalhes do Produto**: Modal com informações completas e imagens em alta resolução
  - **Preços e Descontos**: Exibição clara de "De/Por" para promoções
  - **Responsivo**: Interface mobile-first otimizada para qualquer dispositivo

### 🛒 Carrinho & Checkout
  - **Gestão de Pedidos**: Carrinho persistente (salvo localmente) com ajuste de quantidades
  - **Busca de CEP**: Integração com ViaCEP para preenchimento automático de endereço
  - **Checkout via WhatsApp**: Envia o pedido formatado diretamente para o WhatsApp da loja
  - **Mensagem Personalizada**: Inclui nome do cliente, itens, total, observações e método (Retirada)
  - **Cálculo de Total**: Somatório automático com suporte a promoções

### 🔐 Painel Administrativo
  - **Dashboard**: Visão geral produtos, categorias, estatísticas de estoque
  - **Gestão de Produtos**:
    - Cadastro e edição completa (Nome, Descrição, Preço, Unidade, Estoque)
    - **Upload de Imagens**: Integração com Supabase Storage para gestão otimizada
    - **Preços Promocionais**: Definição de preço original e preço com desconto
  - **Configurações da Loja**:
    - Alteração dinâmica de Nome, Slogan, Endereço e Horários
    - Embed do Google Maps configurável
    - Alteração de senha administrativa (Login único: `admin@vigano.com.br`)
  - **Segurança**: Autenticação via Firebase Auth (sem registro público)

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, TypeScript, Vite
- **UI Framework**: MUI Joy UI (Design System moderno e acessível)
- **Backend (Serverless)**:
  - **Firebase Firestore**: Banco de dados NoSQL para produtos e configurações
  - **Firebase Auth**: Autenticação segura para administradores
  - **Supabase Storage**: Armazenamento otimizado de imagens dos produtos
- **Integrações**:
  - **ViaCEP**: Consulta de endereços automática
  - **WhatsApp API**: Checkout direto via link
  - **Google Maps**: Visualização da unidade física

---

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Conta no Firebase e Supabase

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/peixe-shop.git
cd peixe-shop
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto com as chaves do Firebase e Supabase:
(Veja `.env.example` se disponível)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id

# Supabase Configuration
VITE_SUPABASE_URL=sua_supabase_url
VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key
```

### 4. Admin Inicial
A aplicação utiliza um único email de administração: `admin@vigano.com.br`.
A senha inicial é definida durante o seed ou manualmente no Firestore.
Para popular o banco com dados de exemplo e configurações da loja:
- Acesse `/admin/dashboard` após login
- Use o botão **"Popular Banco de Dados"** no topo da tela

### 5. Execute o projeto
```bash
npm run dev
// Acesse http://localhost:5173
```

---

## 📝 Guia do Administrador

Para detalhes sobre como gerenciar a loja, produtos e configurações, consulte o [Guia do Administrador](./ADMIN_GUIDE.md).

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

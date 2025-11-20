# Landing Page - Projetos TCC Saúde

Uma landing page moderna e profissional para apresentar dois projetos de TCC focados em saúde: **AVC Alerta** e **Socorro Imediato**.

## 🎯 Sobre os Projetos

### AVC Alerta
Aplicativo móvel para identificação dos primeiros sintomas de AVC (Acidente Vascular Cerebral) e informações sobre recuperação. Oferece:
- Reconhecimento rápido de sintomas
- Informações sobre tipos de AVC
- Orientações nutricionais
- Integração com dispositivos wearables

### Socorro Imediato
Aplicativo de primeiros socorros offline focado em situações do dia a dia. Desenvolvido em React Native com:
- Funcionamento 100% offline
- Instruções claras de primeiros socorros
- Interface simples e eficiente
- Busca rápida por tipo de emergência

## 🔐 Sistema de Autenticação

A aplicação utiliza o **Spark KV Storage** para autenticação segura de usuários. Este é um sistema de armazenamento de chave-valor persistente que mantém os dados seguros entre sessões.

### Credenciais de Teste

Você pode testar o sistema com estas credenciais pré-configuradas:

**Usuário 1:**
- Email: `demo@tcc-saude.com`
- Senha: `password`

**Usuário 2:**
- Email: `test@example.com`
- Senha: `password`

### Como Funciona a Autenticação

1. **Registro**: Os novos usuários podem criar uma conta fornecendo:
   - Nome de usuário (mínimo 3 caracteres, apenas letras, números e underscore)
   - Email válido
   - Senha (mínimo 6 caracteres)

2. **Segurança**: 
   - Senhas são criptografadas usando SHA-256
   - Validação de email e senha no frontend
   - Proteção contra registros duplicados
   - Sessão persistente usando Spark KV

3. **Login**: 
   - Validação de credenciais
   - Criação de sessão do usuário
   - Acesso à área protegida com projetos

4. **Área Protegida**:
   - Apenas usuários autenticados podem ver os detalhes completos dos projetos
   - Acesso aos botões de download e QR codes
   - Navegação personalizada

## 🚀 Tecnologias Utilizadas

- **React 19** com TypeScript
- **Tailwind CSS 4** para estilização
- **Shadcn UI** (componentes v4)
- **Framer Motion** para animações
- **Phosphor Icons** para ícones
- **Spark KV Storage** para persistência
- **Sonner** para notificações toast

## 🎨 Design

A aplicação segue princípios de design moderno com:
- **Paleta de cores médica**: Azul profissional, verde saúde e detalhes em teal
- **Tipografia**: Inter (corpo) e Plus Jakarta Sans (títulos)
- **Animações suaves**: Fade-in, hover effects e transições elegantes
- **Totalmente responsivo**: Mobile-first design
- **Acessibilidade**: Contraste WCAG AA, navegação por teclado

## 📱 Funcionalidades

### Navegação
- Menu fixo com scroll suave
- Responsivo com menu hambúrguer mobile
- Indicadores de seção ativa

### Hero Section
- Chamada principal impactante
- CTA para autenticação
- Gradiente suave de fundo

### Sobre os Projetos
- Cards informativos para cada projeto
- Lista de funcionalidades principais
- Design com hover effects

### Área de Projetos (Autenticado)
- Cards detalhados com descrições completas
- Placeholders para QR Codes
- Botões de download (preparados para links futuros)
- Badges de categorização

### Footer
- Informações dos projetos
- Links rápidos
- Design profissional

## 🔧 Arquitetura

```
src/
├── components/
│   ├── ui/              # Componentes Shadcn
│   ├── AuthDialog.tsx   # Modal de login/registro
│   ├── Navigation.tsx   # Barra de navegação
│   └── ProjectCard.tsx  # Card dos projetos
├── hooks/
│   ├── use-auth.tsx     # Hook de autenticação
│   └── use-mobile.ts    # Hook para detecção mobile
├── lib/
│   ├── auth.ts          # Utilitários de autenticação
│   └── utils.ts         # Utilitários gerais
└── App.tsx              # Componente principal
```

## 💾 Armazenamento de Dados

### Spark KV Storage

O sistema usa o Spark KV para armazenar:

**Chave: `users-db`**
- Array de usuários registrados
- Estrutura: `{ id, username, email, passwordHash, createdAt }`

**Chave: `user-session`**
- Sessão do usuário atual
- Estrutura: `{ userId, username, email }`

### Vantagens do Spark KV

✅ Persistência automática entre sessões  
✅ Não requer configuração de banco de dados externo  
✅ Funciona totalmente no cliente  
✅ API simples e reativa com hooks React  
✅ Ideal para aplicações Spark  

## 🎯 Como Usar

1. **Primeira visita**: Navegue pela página inicial e seção "Sobre"
2. **Autenticação**: Clique em "Acessar Projetos" para fazer login ou registrar
3. **Explorar**: Após autenticar, role até a seção de projetos
4. **Download**: Use os botões de download (links serão adicionados futuramente)

## 📝 Próximos Passos

Para adicionar os links de download dos APKs:

1. Hospede os arquivos APK
2. Atualize os `href` nos botões de download em `ProjectCard.tsx`
3. Adicione os QR codes reais substituindo os placeholders

## 🤝 Contribuição

Este projeto foi desenvolvido como apresentação de TCCs na área de saúde. Para sugestões ou melhorias, sinta-se à vontade para contribuir.

---

Desenvolvido com ❤️ para salvar vidas através da tecnologia.

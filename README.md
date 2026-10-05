# 📊 FechaFolha PRO

> **Plataforma premium para fechamento de salários, cálculo instantâneo de comissões e exportação inteligente de planilhas.**

O **FechaFolha PRO** é uma aplicação web *front-end* desenvolvida em React para gerenciar o fechamento de folha de pagamento de redes de lojas (com foco no varejo, como óticas, roupas, etc.). O sistema opera **100% localmente no navegador** do usuário, garantindo privacidade absoluta dos dados financeiros, velocidade instantânea e dispensando a necessidade de servidores ou bancos de dados em nuvem.

## ✨ Principais Funcionalidades

- 🏢 **Gestão Multi-Lojas:** Cadastre matriz e filiais, alternando facilmente entre os fechamentos de cada unidade.
- 👥 **Controle de Funcionários e Vendas:** Lançamento rápido do total de vendas de cada vendedor.
- 🧮 **Cálculo Automático de Comissões:** Suporte a comissionamento por **porcentagem (%)** sobre vendas ou **valor fixo (R$)**.
- 📱 **Exportação Inteligente para Excel (.xlsx):**
  - **Modo Celular (Mobile/WhatsApp):** Gera uma planilha compacta, verticalizada e com fontes maiores, perfeita para o dono da loja ou gerente visualizar e aprovar direto na tela do smartphone sem precisar "rolar para os lados".
  - **Modo Desktop:** Layout executivo tradicional com todas as colunas expandidas para visualização em monitores.
- 👁️ **Visão Consolidada da Rede:** Um dashboard gerencial que soma as vendas, salários base e comissões de *todas* as lojas cadastradas, exibindo o custo total da folha no mês.
- 📝 **Coluna de Observações Dinâmica:** Habilite ou desabilite uma coluna de anotações (ex: "Férias", "Meta Batida") que reflete instantaneamente na interface e no arquivo Excel gerado.

## 🎨 UI/UX e Design System

O projeto foi construído fugindo do padrão tradicional de "sistemas administrativos cinzas", adotando uma estética inspirada em fintechs de alto padrão (como Stripe e Linear.app):

- **Dark Mode Sofisticado:** Paleta baseada em tons de `Slate` e `Midnight Blue` (`#090A0F`), com acentos em `Emerald` e `Cyan`.
- **Glassmorphism:** Uso intensivo de superfícies translúcidas (`backdrop-blur`) e bordas sutis para criar profundidade e hierarquia visual.
- **Tipografia de Precisão:** Fontes limpas (`sans-serif`) com uso estrito da propriedade `tabular-nums` para alinhamento matemático perfeito das colunas financeiras (R$).
- **Micro-interações:** Animações nativas com Tailwind (`animate-in`, `fade-in`, glows radiais) para feedback tátil ao salvar, editar ou excluir dados.

## 🛠️ Tecnologias Utilizadas

- **[React](https://reactjs.org/)** - Biblioteca principal para construção da interface.
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para maior segurança do código e autocompletes.
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utilitária para o design responsivo e efeitos avançados de UI.
- **[Lucide React](https://lucide.dev/)** - Ícones vetoriais consistentes e de alta qualidade.
- **Local Storage API** - Persistência de dados nativa do navegador (via custom hooks / Zustand).
- **Vite** - Bundler e ambiente de desenvolvimento ultrarrápido.

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
Você precisará ter o [Node.js](https://nodejs.org/) instalado na sua máquina.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/fechafolha-pro.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd fechafolha-pro
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   # ou, se preferir usar yarn/pnpm:
   yarn install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Abra no navegador:**
   O terminal exibirá a URL local (geralmente `http://localhost:5173`). Clique para abrir a aplicação.

## 📁 Estrutura do Projeto (Destaques)

- `src/App.tsx`: Ponto de entrada que gerencia as rotas visuais e os estados globais dos Modais.
- `src/components/`:
  - `Header.tsx`: Barra superior com seleção de lojas e botões de exportação master.
  - `EmptyState.tsx`: Tela inicial elegante para criar a primeira loja com background *glow*.
  - `SellerForm.tsx`: Formulário de inserção de dados com cálculos em tempo real (*live preview*).
  - `SellerTable.tsx`: Quadro financeiro listando a equipe.
  - `*Modal.tsx`: Interfaces flutuantes (Edição, Visão Consolidada, Exclusão).
- `src/types/closing.ts`: Definições das interfaces TypeScript (`Store`, `Seller`, `ExportDeviceMode`).
- `src/utils/formatters.ts`: Lógica de formatação monetária (BRL) e parsing de inputs.
- `src/index.css`: Arquivo de base contendo diretivas do Tailwind e animações customizadas (Shimmer, FadeUp).

## 🔒 Privacidade e Segurança
Este aplicativo foi arquitetado no modelo *Client-Side Only*. Nenhum dado financeiro, nomes de lojas ou salários de funcionários trafegam pela rede ou são enviados para servidores externos. Tudo fica armazenado na memória cache (Local Storage) do dispositivo de onde o usuário está acessando.

---
Desenvolvido com 💚 e foco na experiência do usuário para simplificar a vida do varejo.
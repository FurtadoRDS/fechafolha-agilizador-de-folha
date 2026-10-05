<div align="center">
  <img src="./public/favicon.png" alt="FechaFolha PRO Logo" width="120" />

  # 🍃 FechaFolha PRO

  **Sistema Premium de Gestão e Fechamento de Salários e Comissões**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

  <p align="center">
    Plataforma de alta precisão para o cálculo instantâneo de comissões, gestão de múltiplas filiais e exportação inteligente de relatórios financeiros (Excel).
  </p>
</div>

<br/>

## 📖 Sobre o Projeto

O **FechaFolha PRO** nasceu da necessidade de modernizar e simplificar o fechamento financeiro no fim do mês para redes de lojas (como óticas e retalho). A aplicação substitui as planilhas manuais confusas por uma interface fluida, baseada no conceito visual de *Liquid Glass* (Glassmorphism escuro), oferecendo cálculos automáticos em tempo real e mantendo todos os dados seguros no próprio navegador do utilizador.

A *killer feature* da aplicação é o seu motor de exportação Excel: capaz de gerar ficheiros formatados não apenas para o computador, mas **estruturalmente desenhados para ecrãs de telemóvel**, facilitando o envio dos fechamentos via WhatsApp para gerentes e funcionários.

---

## ✨ Principais Funcionalidades

- **🏢 Gestão de Múltiplas Lojas:** Crie, edite e acompanhe o desempenho de várias filiais numa única interface. Consolidado geral de toda a rede de forma instantânea.
- **👥 Controle de Funcionários:** Adicione vendedores registando o total vendido, salário base e a taxa de comissão (em % ou valor fixo R$).
- **⚡ Cálculos em Tempo Real:** À medida que os dados são inseridos, o sistema calcula dinamicamente as comissões, salários totais e a percentagem de vendas da equipa face à loja.
- **📱 Exportação Inteligente (Excel):** Exportação de planilhas formatadas e estilizadas.
  - **Modo Celular:** Layout compacto com tipografia maior, focado em preencher a tela do smartphone na vertical (perfeito para partilha mobile).
  - **Modo Desktop:** Layout expandido tradicional com todas as colunas visíveis.
- **🔒 Segurança Local:** Arquitetura *Local-First*. Os dados financeiros sensíveis nunca saem da máquina, sendo guardados nativamente no `localStorage` do browser.
- **🎨 UI/UX Premium:** Design moderno com efeitos translúcidos, paleta esmeralda/ciano e feedback tátil em todas as interações.

---

## 💻 Tecnologias e Bibliotecas

A aplicação foi construída com um ecossistema moderno focado em performance e tipagem forte:

| Tecnologia / Ferramenta | Propósito |
| :--- | :--- |
| **React 18** | Biblioteca base para construção das interfaces de utilizador. |
| **TypeScript** | Tipagem estática para garantir a segurança dos cálculos financeiros (`types/closing.ts`). |
| **Vite** | *Bundler* ultra-rápido para desenvolvimento e build. |
| **Tailwind CSS** | Estilização utilitária usada para criar o efeito *Liquid Glass* e as classes arbitrárias de layout. |
| **xlsx-js-style** | Motor responsável por injetar fórmulas nativas (`=SOMA()`) e formatação monetária nos ficheiros Excel exportados. |
| **Lucide React** | Biblioteca de ícones SVG consistentes e minimalistas. |

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para correr a aplicação localmente na sua máquina.

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 16 ou superior).
- Git para clonar o repositório.

### Instalação

1. Clone o repositório:
```bash
git clone [https://github.com/seu-usuario/fechafolha-pro.git](https://github.com/seu-usuario/fechafolha-pro.git)
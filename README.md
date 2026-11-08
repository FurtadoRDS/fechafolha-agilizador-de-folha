# FechaFolha

Aplicação web para fechar salários e comissões de redes de lojas no fim do mês, sem depender de planilha manual.

**No ar:** [fechafolha-phi.vercel.app](https://fechafolha-phi.vercel.app/)

## O que ela faz

- Cadastra várias lojas, com troca rápida entre elas e uma visão consolidada da rede.
- Cadastra vendedores com total vendido, salário base e comissão em porcentagem ou valor fixo.
- Calcula na hora as comissões, o total a pagar e a participação da equipe nas vendas da loja.
- Exporta o fechamento em Excel em dois formatos: um compacto, para ler no celular e mandar pelo WhatsApp, e um completo, para o computador. As planilhas já saem com as fórmulas de soma.
- Guarda os dados no próprio navegador (localStorage). Nada vai para um servidor, e os dados não sincronizam entre aparelhos.

## Tecnologias

React, TypeScript, Tailwind CSS e Vite. As planilhas são geradas com xlsx-js-style, e os ícones são do Lucide.

## Como rodar

Requisitos: Node.js 22.12 ou mais recente.

```sh
npm ci
npm run dev
```

Para gerar e testar a versão de produção:

```sh
npm run build
npm run preview
```

`npm run lint` faz a checagem de tipos do TypeScript.

## Estrutura

```text
src/
  components/   telas e modais: lojas, vendedores e visão consolidada
  hooks/        useLocalStorage, que salva os dados no navegador
  types/        tipos usados no fechamento
  utils/        formatação de valores e exportação para Excel
```

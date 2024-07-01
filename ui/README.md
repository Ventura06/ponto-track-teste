<p align="center">
  <a href="http://nextjs.com/" target="blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="200"><mask height="180" id=":r8:mask0_408_134" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style="mask-type: alpha;"><circle cx="90" cy="90" fill="black" r="90"></circle></mask><g mask="url(#:r8:mask0_408_134)"><circle cx="90" cy="90" data-circle="true" fill="black" r="90"></circle><path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#:r8:paint0_linear_408_134)"></path><rect fill="url(#:r8:paint1_linear_408_134)" height="72" width="12" x="115" y="54"></rect></g><defs><linearGradient gradientUnits="userSpaceOnUse" id=":r8:paint0_linear_408_134" x1="109" x2="144.5" y1="116.5" y2="160.5"><stop stop-color="white"></stop><stop offset="1" stop-color="white" stop-opacity="0"></stop></linearGradient><linearGradient gradientUnits="userSpaceOnUse" id=":r8:paint1_linear_408_134" x1="121" x2="120.799" y1="54" y2="106.875"><stop stop-color="white"></stop><stop offset="1" stop-color="white" stop-opacity="0"></stop></linearGradient></defs></svg></a>
</p>

## Description

[Next](https://github.com/vercel/next.js) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# watch mode
$ pnpm dev
```

## Bibliotecas utilizadas

- Shadcn (Para Components de UI derivação de Radix)
- React Query (Para gerenciamento de requisições eficientes)
- React Hook Form (Para gerenciamento de formulários)
- Zod (Para validação de formulários)
- React Hot Toast (Para notificações)
- Tailwind CSS (Para estilização)

## Estrutura de pastas

    - app (Pasta principal do projeto)
        - fragments (Componentes de UI específicos dentro das próprias páginas)

    - components (Componentes de UI genéricos)
        - forms (Componentes de formulários)
        - list  (Componentes de listagem)
        - modal (Componentes de modais)
        - ui   (Componentes de UI do Shadcn)

    - lib (Bibliotecas de funções auxiliares)
        - hooks (Hooks customizados)
        - actions.ts (Funções de requisições no server side)
        - consts.ts (Constantes do projeto)
        - fetches.ts (Funções de requisições no client side)
        - models.ts (Tipagem de dados)
        - utils.ts (Funções auxiliares)
        - zodSchemas.ts (Schemas de validação)

## Deploy

    - Foi realizado na Vercel

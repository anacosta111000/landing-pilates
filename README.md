# Studio Prumo Pilates | Landing page

Landing page responsiva para um estúdio de pilates, criada como **projeto de demonstração para portfólio**. O estúdio, o endereço e os depoimentos são fictícios.

**Demonstração ao vivo:** https://studio-prumo-pilates.netlify.app/

## O que a página tem

- Hero com coluna de "vértebras" animada, que se alinha ao carregar e ondula conforme a rolagem
- Números que contam quando entram na tela
- Abas interativas com os tipos de aula
- Esfera de respiração animada (inspire/expire)
- Seletor de horários que preenche o pedido de aula experimental
- Formulário que abre o WhatsApp com a mensagem pronta
- Layout responsivo e respeito à preferência de "reduzir movimento" do sistema

## Tecnologias

- React 18
- Vite
- CSS puro (sem bibliotecas de UI)
- Ícones em SVG feitos à mão

## Como rodar localmente

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos finais ficam na pasta `dist`.

## Como personalizar

Tudo fica em `src/App.jsx`:

- `WHATSAPP`: número que recebe as mensagens (código do país + DDD + número, só dígitos)
- `HERO_IMG`: caminho de uma foto para o hero (ex.: `/hero.jpg`, com o arquivo em `public/`)
- `BENEFITS`, `CLASSES`, `PERIODS`, `STATS`: textos, aulas, horários e números da página

As cores e fontes ficam no início de `src/styles.css`, nas variáveis `:root`.

## Estrutura

```
├── index.html
├── package.json
├── vite.config.js
├── public/          (opcional: imagens)
└── src/
    ├── main.jsx
    ├── App.jsx
    └── styles.css
```

## Autora

Ana Clara, desenvolvedora.

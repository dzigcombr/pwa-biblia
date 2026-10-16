# Bíblia Sagrada - PWA de Leitura

Aplicativo Web Progressivo (PWA) moderno e minimalista para leitura bíblica com sistema de anotações personalizadas.

## Características

- Autenticação de usuários via Supabase
- Leitura fluida de versículos bíblicos
- Sistema de anotações vinculado a versículos específicos
- Área de estudos para gerenciar anotações
- Modo escuro/claro
- Design mobile-first responsivo
- Funciona offline como PWA

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth + Database)
- Lucide React (ícones)

## Estrutura do Banco de Dados

O aplicativo utiliza três tabelas principais no Supabase:

### 1. livros
Armazena informações sobre os livros da Bíblia
- id, livro, abbrev, testamento, autor, capitulos, grupo

### 2. versiculos
Armazena o conteúdo dos versículos
- id, id_livro, capitulo, versiculo, texto

### 3. anotacoes
Armazena as anotações dos usuários
- id, user_id, id_livro, capitulo, versiculo, texto_da_nota

## Como Usar

1. Faça login ou crie uma conta
2. Selecione um livro da lista
3. Escolha um capítulo
4. Clique em qualquer versículo para adicionar uma anotação
5. Acesse suas anotações na aba "Anotações"

## Populando o Banco de Dados

O arquivo `seed-sample-data.sql` contém dados de exemplo que você pode executar no Supabase para popular o banco com alguns livros e versículos para teste.

Para adicionar o conteúdo completo da Bíblia, você precisará de um conjunto de dados mais completo ou uma API bíblica.

## Desenvolvimento

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## PWA

O aplicativo está configurado como PWA e pode ser instalado em dispositivos móveis e desktop através do navegador.

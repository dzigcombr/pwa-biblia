/*
  # Criação das Tabelas do App de Leitura Bíblica

  1. Novas Tabelas
    - `livros`
      - `id` (bigint, chave primária, auto-incremento)
      - `livro` (text, nome completo do livro)
      - `abbrev` (text, abreviação do livro)
      - `testamento` (text, AT ou NT)
      - `autor` (text, autor do livro)
      - `capitulos` (integer, número de capítulos)
      - `grupo` (text, categoria do livro)
      - `created_at` (timestamptz, data de criação)
    
    - `versiculos`
      - `id` (bigint, chave primária, auto-incremento)
      - `id_livro` (bigint, referência a livros)
      - `capitulo` (integer, número do capítulo)
      - `versiculo` (integer, número do versículo)
      - `texto` (text, conteúdo do versículo)
      - `created_at` (timestamptz, data de criação)
    
    - `anotacoes`
      - `id` (uuid, chave primária)
      - `user_id` (uuid, referência ao auth.users)
      - `id_livro` (bigint, referência a livros)
      - `capitulo` (integer, capítulo referenciado)
      - `versiculo` (integer, versículo referenciado)
      - `texto_da_nota` (text, conteúdo da anotação)
      - `created_at` (timestamptz, data de criação)
      - `updated_at` (timestamptz, última atualização)

  2. Segurança
    - Enable RLS em todas as tabelas
    - Políticas públicas de leitura para livros e versículos
    - Políticas restritas para anotações (apenas o proprietário)
*/

-- Criar tabela de livros
CREATE TABLE IF NOT EXISTS livros (
  id bigserial PRIMARY KEY,
  livro text NOT NULL,
  abbrev text NOT NULL UNIQUE,
  testamento text NOT NULL,
  autor text,
  capitulos integer NOT NULL DEFAULT 1,
  grupo text,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de versículos
CREATE TABLE IF NOT EXISTS versiculos (
  id bigserial PRIMARY KEY,
  id_livro bigint NOT NULL REFERENCES livros(id) ON DELETE CASCADE,
  capitulo integer NOT NULL,
  versiculo integer NOT NULL,
  texto text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_versiculos_livro_capitulo ON versiculos(id_livro, capitulo);

-- Criar tabela de anotações
CREATE TABLE IF NOT EXISTS anotacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id_livro bigint NOT NULL REFERENCES livros(id) ON DELETE CASCADE,
  capitulo integer NOT NULL,
  versiculo integer,
  texto_da_nota text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar índice para anotações por usuário
CREATE INDEX IF NOT EXISTS idx_anotacoes_user ON anotacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_anotacoes_livro_capitulo ON anotacoes(id_livro, capitulo);

-- Habilitar RLS
ALTER TABLE livros ENABLE ROW LEVEL SECURITY;
ALTER TABLE versiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE anotacoes ENABLE ROW LEVEL SECURITY;

-- Políticas para livros (leitura pública)
CREATE POLICY "Qualquer pessoa pode ler livros"
  ON livros FOR SELECT
  TO authenticated, anon
  USING (true);

-- Políticas para versículos (leitura pública)
CREATE POLICY "Qualquer pessoa pode ler versículos"
  ON versiculos FOR SELECT
  TO authenticated, anon
  USING (true);

-- Políticas para anotações (apenas o proprietário)
CREATE POLICY "Usuários podem ver suas próprias anotações"
  ON anotacoes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias anotações"
  ON anotacoes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias anotações"
  ON anotacoes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias anotações"
  ON anotacoes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_anotacoes_updated_at
  BEFORE UPDATE ON anotacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
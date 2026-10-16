-- Script SQL para popular o banco com dados de exemplo
-- Este script adiciona alguns livros e versículos para teste

-- Inserir livros de exemplo (você pode expandir isso com todos os 66 livros)
INSERT INTO livros (livro, abbrev, testamento, autor, capitulos, grupo) VALUES
  ('Gênesis', 'Gn', 'AT', 'Moisés', 50, 'Pentateuco'),
  ('Êxodo', 'Ex', 'AT', 'Moisés', 40, 'Pentateuco'),
  ('Salmos', 'Sl', 'AT', 'Davi e outros', 150, 'Poéticos'),
  ('Provérbios', 'Pv', 'AT', 'Salomão', 31, 'Poéticos'),
  ('Mateus', 'Mt', 'NT', 'Mateus', 28, 'Evangelhos'),
  ('Marcos', 'Mc', 'NT', 'Marcos', 16, 'Evangelhos'),
  ('Lucas', 'Lc', 'NT', 'Lucas', 24, 'Evangelhos'),
  ('João', 'Jo', 'NT', 'João', 21, 'Evangelhos'),
  ('Atos', 'At', 'NT', 'Lucas', 28, 'História'),
  ('Romanos', 'Rm', 'NT', 'Paulo', 16, 'Epístolas Paulinas'),
  ('1 Coríntios', '1Co', 'NT', 'Paulo', 16, 'Epístolas Paulinas'),
  ('Efésios', 'Ef', 'NT', 'Paulo', 6, 'Epístolas Paulinas'),
  ('Filipenses', 'Fp', 'NT', 'Paulo', 4, 'Epístolas Paulinas'),
  ('Apocalipse', 'Ap', 'NT', 'João', 22, 'Profético')
ON CONFLICT (abbrev) DO NOTHING;

-- Exemplo: Gênesis 1 (primeiros 5 versículos)
INSERT INTO versiculos (id_livro, capitulo, versiculo, texto) VALUES
  ((SELECT id FROM livros WHERE abbrev = 'Gn'), 1, 1, 'No princípio, Deus criou os céus e a terra.'),
  ((SELECT id FROM livros WHERE abbrev = 'Gn'), 1, 2, 'A terra era sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava sobre as águas.'),
  ((SELECT id FROM livros WHERE abbrev = 'Gn'), 1, 3, 'Disse Deus: Haja luz. E houve luz.'),
  ((SELECT id FROM livros WHERE abbrev = 'Gn'), 1, 4, 'Deus viu que a luz era boa; e fez separação entre a luz e as trevas.'),
  ((SELECT id FROM livros WHERE abbrev = 'Gn'), 1, 5, 'Chamou Deus à luz Dia e às trevas, Noite. Houve tarde e manhã, o primeiro dia.')
ON CONFLICT DO NOTHING;

-- Exemplo: João 3:16
INSERT INTO versiculos (id_livro, capitulo, versiculo, texto) VALUES
  ((SELECT id FROM livros WHERE abbrev = 'Jo'), 3, 16, 'Porque Deus amou ao mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.')
ON CONFLICT DO NOTHING;

-- Exemplo: Salmos 23 (completo)
INSERT INTO versiculos (id_livro, capitulo, versiculo, texto) VALUES
  ((SELECT id FROM livros WHERE abbrev = 'Sl'), 23, 1, 'O Senhor é o meu pastor; nada me faltará.'),
  ((SELECT id FROM livros WHERE abbrev = 'Sl'), 23, 2, 'Ele me faz repousar em pastos verdejantes. Leva-me para junto das águas de descanso.'),
  ((SELECT id FROM livros WHERE abbrev = 'Sl'), 23, 3, 'Refrigera-me a alma. Guia-me pelas veredas da justiça por amor do seu nome.'),
  ((SELECT id FROM livros WHERE abbrev = 'Sl'), 23, 4, 'Ainda que eu ande pelo vale da sombra da morte, não temerei mal nenhum, porque tu estás comigo; o teu bordão e o teu cajado me consolam.'),
  ((SELECT id FROM livros WHERE abbrev = 'Sl'), 23, 5, 'Preparas-me uma mesa na presença dos meus adversários, unges-me a cabeça com óleo; o meu cálice transborda.'),
  ((SELECT id FROM livros WHERE abbrev = 'Sl'), 23, 6, 'Bondade e misericórdia certamente me seguirão todos os dias da minha vida; e habitarei na Casa do Senhor para todo o sempre.')
ON CONFLICT DO NOTHING;

-- Exemplo: Filipenses 4:13
INSERT INTO versiculos (id_livro, capitulo, versiculo, texto) VALUES
  ((SELECT id FROM livros WHERE abbrev = 'Fp'), 4, 13, 'Tudo posso naquele que me fortalece.')
ON CONFLICT DO NOTHING;

-- Exemplo: Romanos 8:28
INSERT INTO versiculos (id_livro, capitulo, versiculo, texto) VALUES
  ((SELECT id FROM livros WHERE abbrev = 'Rm'), 8, 28, 'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.')
ON CONFLICT DO NOTHING;

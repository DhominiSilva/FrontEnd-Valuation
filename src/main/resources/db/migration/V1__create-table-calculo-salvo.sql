CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE calculo_salvo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payout_medio NUMERIC(7,4) NOT NULL,
    taxa_desconto NUMERIC(7,4) NOT NULL,
    roe NUMERIC(7,4) NOT NULL,
    taxa_crescimento_esperada NUMERIC(7,4) NOT NULL,
    numero_acoes_ex_tesouraria BIGINT NOT NULL,
    patrimonio_liquido NUMERIC(16,2) NOT NULL,
    preco_acao NUMERIC(10,2) NOT NULL,
    ll2025 NUMERIC(16,2) NOT NULL,
    ll2026 NUMERIC(16,2) NOT NULL,
    crescimento_2027 NUMERIC(7,4) NOT NULL,
    crescimento_2028 NUMERIC(7,4) NOT NULL,
    crescimento_perpetuidade NUMERIC(7,4) NOT NULL,
    preco_teto NUMERIC(10,2) NOT NULL,
    anotacoes TEXT,
    criado_em DATE NOT NULL,
    atualizado_em DATE
);
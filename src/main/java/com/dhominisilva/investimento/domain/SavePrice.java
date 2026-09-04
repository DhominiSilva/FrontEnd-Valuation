package com.dhominisilva.investimento.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Table(name = "calculo_salvo")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@EqualsAndHashCode(of = "id")
public class SavePrice {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "payout_medio")
    private BigDecimal payout;

    @Column(name = "taxa_desconto")
    private BigDecimal taxaDesconto;

    @Column(name = "roe")
    private BigDecimal roe;

    @Column(name = "taxa_crescimento_esperada")
    private BigDecimal taxaCrescimentoEsperado;

    @Column(name = "numero_acoes_ex_tesouraria")
    private Long quantidadeAcoesEx;

    @Column(name = "patrimonio_liquido")
    private BigDecimal patrimonioLiquido;

    @Column(name = "preco_acao")
    private BigDecimal precoAcao;

    @Column(name = "ll2025")
    private BigDecimal ll2025;

    @Column(name = "ll2026")
    private BigDecimal ll2026;

    @Column(name = "crescimento_2027")
    private BigDecimal crescimento2027;

    @Column(name = "crescimento_2028")
    private BigDecimal crescimento2028;

    @Column(name = "crescimento_perpetuidade")
    private BigDecimal crescimentoPerp;

    @Column(name = "preco_teto")
    private BigDecimal precoTeto;

    @Column(name = "anotacoes")
    private String anotacoes;

    @Column(name = "criado_em")
    private LocalDate criadoEm;

    @Column(name = "atualizado_em")
    private LocalDate atualizadoEm;

    // Vê se já existe algum usuario salvo com o id, caso não tenha, salva a data
    @PrePersist
    protected void aoCriar() {
        this.criadoEm = LocalDate.now();
    }

    // Vê se já existe algum usuario salvo com o id, caso tenha, atualiza a data
    @PreUpdate
    protected void aoAtualizar() {
        this.atualizadoEm = LocalDate.now();
    }


    public SavePrice(SavePriceDTO sp) {
        this.payout = sp.payout();
        this.taxaDesconto = sp.taxaDesconto();
        this.roe = sp.roe();
        this.taxaCrescimentoEsperado = sp.taxaCrescimentoEsperado();
        this.quantidadeAcoesEx = sp.quantidadeAcoesEx();
        this.patrimonioLiquido = sp.patrimonioLiquido();
        this.precoAcao = sp.precoAcao();
        this.ll2025 = sp.ll2025();
        this.ll2026 = sp.ll2026();
        this.crescimento2027 = sp.crescimento2027();
        this.crescimento2028 = sp.crescimento2028();
        this.crescimentoPerp = sp.crescimentoPerp();
        this.precoTeto = sp.precoTeto();
        this.anotacoes = sp.anotacoes();
    }
}

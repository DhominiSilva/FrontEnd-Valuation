package com.dhominisilva.investimento.domain;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record SavePriceDTO(

        @NotNull
        BigDecimal payout,

        @NotNull
        BigDecimal taxaDesconto,

        @NotNull
        BigDecimal roe,

        @NotNull
        BigDecimal taxaCrescimentoEsperado,

        @NotNull
        Long quantidadeAcoesEx,

        @NotNull
        BigDecimal patrimonioLiquido,

        @NotNull
        BigDecimal precoAcao,

        @NotNull
        BigDecimal ll2025,

        @NotNull
        BigDecimal ll2026,

        @NotNull
        BigDecimal crescimento2027,

        @NotNull
        BigDecimal crescimento2028,

        @NotNull
        BigDecimal crescimentoPerp,

        @NotNull
        BigDecimal precoTeto,

        @NotNull
        String anotacoes

) {
}

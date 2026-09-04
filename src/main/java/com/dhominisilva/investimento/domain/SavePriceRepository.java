package com.dhominisilva.investimento.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SavePriceRepository extends JpaRepository <SavePrice, UUID> {
}

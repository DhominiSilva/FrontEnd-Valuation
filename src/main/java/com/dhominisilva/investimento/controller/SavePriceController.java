package com.dhominisilva.investimento.controller;

import com.dhominisilva.investimento.domain.SavePrice;
import com.dhominisilva.investimento.domain.SavePriceDTO;
import com.dhominisilva.investimento.domain.SavePriceRepository;
import jakarta.persistence.Entity;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/save")
public class SavePriceController {

    @Autowired
    private SavePriceRepository repository;

    @PostMapping
    @Transactional
    public ResponseEntity savePrice (@RequestBody @Valid SavePriceDTO sp){
        var save = new SavePrice(sp);
        repository.save(save);
        return ResponseEntity.ok().build();
    }

}

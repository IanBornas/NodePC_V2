package com.nodepc.backend.backend.repository;

import com.nodepc.backend.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}


/* this class is used to interact with the database */
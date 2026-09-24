package com.codeassess.repository;

import com.codeassess.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByGatewayOrderId(String gatewayOrderId);
    List<PaymentTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
}

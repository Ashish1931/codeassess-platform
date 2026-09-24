package com.codeassess.dto.subscription;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConfirmPaymentRequest {
    @NotBlank
    private String orderId;

    private String paymentId;
}

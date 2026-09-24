package com.codeassess.dto.subscription;

import com.codeassess.enums.BillingCycle;
import com.codeassess.enums.SubscriptionPlan;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutResponse {
    private String gateway;
    private String orderId;
    private SubscriptionPlan plan;
    private BillingCycle billingCycle;
    private Long amountInPaise;
    private String currency;
    private String paymentUrl;
}

package com.codeassess.dto.subscription;

import com.codeassess.enums.BillingCycle;
import com.codeassess.enums.SubscriptionPlan;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {
    @NotNull
    private SubscriptionPlan plan;

    @NotNull
    private BillingCycle billingCycle;
}

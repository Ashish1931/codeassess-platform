package com.codeassess.dto.subscription;

import com.codeassess.enums.BillingCycle;
import com.codeassess.enums.SubscriptionPlan;
import com.codeassess.enums.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionDto {
    private Long id;
    private SubscriptionPlan plan;
    private String planName;
    private BillingCycle billingCycle;
    private SubscriptionStatus status;
    private Long amountInPaise;
    private String currency;
    private Integer monthlyTestLimit;
    private Boolean advancedAnalytics;
    private Boolean certificates;
    private Boolean prioritySupport;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean autoRenew;
}

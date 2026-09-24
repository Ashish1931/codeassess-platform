package com.codeassess.dto.subscription;

import com.codeassess.enums.SubscriptionPlan;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlanDto {
    private SubscriptionPlan plan;
    private String name;
    private String description;
    private Long monthlyPriceInPaise;
    private Long yearlyPriceInPaise;
    private Integer monthlyTestLimit;
    private Boolean advancedAnalytics;
    private Boolean certificates;
    private Boolean prioritySupport;
    private List<String> features;
}

package com.codeassess.service;

import com.codeassess.dto.subscription.*;

import java.util.List;

public interface SubscriptionService {
    List<PlanDto> getPlans();
    SubscriptionDto getCurrentSubscription(Long userId);
    CheckoutResponse createCheckout(Long userId, CheckoutRequest request);
    SubscriptionDto confirmPayment(Long userId, ConfirmPaymentRequest request);
    SubscriptionDto cancelSubscription(Long userId);
}

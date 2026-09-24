package com.codeassess.controller;

import com.codeassess.config.security.UserPrincipal;
import com.codeassess.dto.subscription.*;
import com.codeassess.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/subscriptions", "/subscriptions"})
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/plans")
    public ResponseEntity<List<PlanDto>> getPlans() {
        return ResponseEntity.ok(subscriptionService.getPlans());
    }

    @GetMapping("/current")
    public ResponseEntity<SubscriptionDto> getCurrentSubscription(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(subscriptionService.getCurrentSubscription(userPrincipal.getId()));
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> createCheckout(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                           @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(subscriptionService.createCheckout(userPrincipal.getId(), request));
    }

    @PostMapping("/confirm")
    public ResponseEntity<SubscriptionDto> confirmPayment(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                          @Valid @RequestBody ConfirmPaymentRequest request) {
        return ResponseEntity.ok(subscriptionService.confirmPayment(userPrincipal.getId(), request));
    }

    @PostMapping("/cancel")
    public ResponseEntity<SubscriptionDto> cancelSubscription(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(subscriptionService.cancelSubscription(userPrincipal.getId()));
    }
}

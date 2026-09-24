package com.codeassess.service.impl;

import com.codeassess.dto.subscription.*;
import com.codeassess.entity.PaymentTransaction;
import com.codeassess.entity.Subscription;
import com.codeassess.entity.User;
import com.codeassess.enums.*;
import com.codeassess.exception.BadRequestException;
import com.codeassess.exception.ResourceNotFoundException;
import com.codeassess.repository.PaymentTransactionRepository;
import com.codeassess.repository.SubscriptionRepository;
import com.codeassess.repository.UserRepository;
import com.codeassess.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private static final String CURRENCY = "INR";
    private static final String GATEWAY_NAME = "LOCAL_DEMO_GATEWAY";

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    private final Map<SubscriptionPlan, PlanDto> planCatalog = Map.of(
            SubscriptionPlan.FREE, PlanDto.builder()
                    .plan(SubscriptionPlan.FREE)
                    .name("Free")
                    .description("Start practicing with essential MCQ access.")
                    .monthlyPriceInPaise(0L)
                    .yearlyPriceInPaise(0L)
                    .monthlyTestLimit(5)
                    .advancedAnalytics(false)
                    .certificates(false)
                    .prioritySupport(false)
                    .features(List.of("5 test attempts per month", "Basic score summary", "Subject browsing", "Community leaderboard"))
                    .build(),
            SubscriptionPlan.PRO, PlanDto.builder()
                    .plan(SubscriptionPlan.PRO)
                    .name("Pro")
                    .description("For consistent learners who need deeper practice.")
                    .monthlyPriceInPaise(49900L)
                    .yearlyPriceInPaise(499900L)
                    .monthlyTestLimit(50)
                    .advancedAnalytics(true)
                    .certificates(true)
                    .prioritySupport(false)
                    .features(List.of("50 test attempts per month", "Detailed performance analytics", "PDF reports and certificates", "Bookmark and mistake practice"))
                    .build(),
            SubscriptionPlan.PREMIUM, PlanDto.builder()
                    .plan(SubscriptionPlan.PREMIUM)
                    .name("Premium")
                    .description("Full access for interview and placement preparation.")
                    .monthlyPriceInPaise(99900L)
                    .yearlyPriceInPaise(999900L)
                    .monthlyTestLimit(-1)
                    .advancedAnalytics(true)
                    .certificates(true)
                    .prioritySupport(true)
                    .features(List.of("Unlimited test attempts", "Advanced analytics and weak-topic insights", "All reports and certificates", "Priority support"))
                    .build()
    );

    @Override
    public List<PlanDto> getPlans() {
        return List.of(
                planCatalog.get(SubscriptionPlan.FREE),
                planCatalog.get(SubscriptionPlan.PRO),
                planCatalog.get(SubscriptionPlan.PREMIUM)
        );
    }

    @Override
    public SubscriptionDto getCurrentSubscription(Long userId) {
        return subscriptionRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, SubscriptionStatus.ACTIVE)
                .map(this::toDto)
                .orElseGet(() -> defaultFreeSubscription());
    }

    @Override
    @Transactional
    public CheckoutResponse createCheckout(Long userId, CheckoutRequest request) {
        User user = findUser(userId);
        PlanDto plan = getPlan(request.getPlan());
        Long amount = amountFor(plan, request.getBillingCycle());

        if (request.getPlan() == SubscriptionPlan.FREE) {
            activateSubscription(user, SubscriptionPlan.FREE, request.getBillingCycle(), amount);
            return CheckoutResponse.builder()
                    .gateway(GATEWAY_NAME)
                    .orderId("FREE-" + UUID.randomUUID())
                    .plan(request.getPlan())
                    .billingCycle(request.getBillingCycle())
                    .amountInPaise(amount)
                    .currency(CURRENCY)
                    .paymentUrl(null)
                    .build();
        }

        PaymentTransaction transaction = paymentTransactionRepository.save(PaymentTransaction.builder()
                .user(user)
                .plan(request.getPlan())
                .billingCycle(request.getBillingCycle())
                .amountInPaise(amount)
                .currency(CURRENCY)
                .status(PaymentStatus.PENDING)
                .gatewayOrderId("ORDER-" + UUID.randomUUID())
                .build());

        return CheckoutResponse.builder()
                .gateway(GATEWAY_NAME)
                .orderId(transaction.getGatewayOrderId())
                .plan(transaction.getPlan())
                .billingCycle(transaction.getBillingCycle())
                .amountInPaise(transaction.getAmountInPaise())
                .currency(transaction.getCurrency())
                .paymentUrl("/student/subscription?orderId=" + transaction.getGatewayOrderId())
                .build();
    }

    @Override
    @Transactional
    public SubscriptionDto confirmPayment(Long userId, ConfirmPaymentRequest request) {
        PaymentTransaction transaction = paymentTransactionRepository.findByGatewayOrderId(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment transaction", "orderId", request.getOrderId()));

        if (!transaction.getUser().getId().equals(userId)) {
            throw new BadRequestException("Payment order does not belong to the authenticated user");
        }

        if (transaction.getStatus() == PaymentStatus.SUCCESS && transaction.getSubscription() != null) {
            return toDto(transaction.getSubscription());
        }

        transaction.setStatus(PaymentStatus.SUCCESS);
        transaction.setGatewayPaymentId(request.getPaymentId() != null ? request.getPaymentId() : "PAY-" + UUID.randomUUID());

        Subscription subscription = activateSubscription(
                transaction.getUser(),
                transaction.getPlan(),
                transaction.getBillingCycle(),
                transaction.getAmountInPaise()
        );
        transaction.setSubscription(subscription);
        paymentTransactionRepository.save(transaction);

        return toDto(subscription);
    }

    @Override
    @Transactional
    public SubscriptionDto cancelSubscription(Long userId) {
        Subscription subscription = subscriptionRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Active subscription", "userId", userId));

        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscription.setAutoRenew(false);
        subscriptionRepository.save(subscription);

        User user = findUser(userId);
        Subscription freeSubscription = activateSubscription(user, SubscriptionPlan.FREE, BillingCycle.MONTHLY, 0L);
        return toDto(freeSubscription);
    }

    private Subscription activateSubscription(User user, SubscriptionPlan plan, BillingCycle billingCycle, Long amountInPaise) {
        subscriptionRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(user.getId(), SubscriptionStatus.ACTIVE)
                .ifPresent(existing -> {
                    existing.setStatus(SubscriptionStatus.CANCELLED);
                    existing.setAutoRenew(false);
                    subscriptionRepository.save(existing);
                });

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate = plan == SubscriptionPlan.FREE
                ? null
                : now.plusMonths(billingCycle == BillingCycle.YEARLY ? 12 : 1);

        return subscriptionRepository.save(Subscription.builder()
                .user(user)
                .plan(plan)
                .billingCycle(billingCycle)
                .status(SubscriptionStatus.ACTIVE)
                .amountInPaise(amountInPaise)
                .startDate(now)
                .endDate(endDate)
                .autoRenew(plan != SubscriptionPlan.FREE)
                .build());
    }

    private PlanDto getPlan(SubscriptionPlan plan) {
        PlanDto planDto = planCatalog.get(plan);
        if (planDto == null) {
            throw new BadRequestException("Unsupported subscription plan");
        }
        return planDto;
    }

    private Long amountFor(PlanDto plan, BillingCycle billingCycle) {
        return billingCycle == BillingCycle.YEARLY ? plan.getYearlyPriceInPaise() : plan.getMonthlyPriceInPaise();
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private SubscriptionDto defaultFreeSubscription() {
        PlanDto plan = planCatalog.get(SubscriptionPlan.FREE);
        return SubscriptionDto.builder()
                .plan(SubscriptionPlan.FREE)
                .planName(plan.getName())
                .billingCycle(BillingCycle.MONTHLY)
                .status(SubscriptionStatus.ACTIVE)
                .amountInPaise(0L)
                .currency(CURRENCY)
                .monthlyTestLimit(plan.getMonthlyTestLimit())
                .advancedAnalytics(plan.getAdvancedAnalytics())
                .certificates(plan.getCertificates())
                .prioritySupport(plan.getPrioritySupport())
                .autoRenew(false)
                .build();
    }

    private SubscriptionDto toDto(Subscription subscription) {
        PlanDto plan = getPlan(subscription.getPlan());
        return SubscriptionDto.builder()
                .id(subscription.getId())
                .plan(subscription.getPlan())
                .planName(plan.getName())
                .billingCycle(subscription.getBillingCycle())
                .status(subscription.getStatus())
                .amountInPaise(subscription.getAmountInPaise())
                .currency(CURRENCY)
                .monthlyTestLimit(plan.getMonthlyTestLimit())
                .advancedAnalytics(plan.getAdvancedAnalytics())
                .certificates(plan.getCertificates())
                .prioritySupport(plan.getPrioritySupport())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .autoRenew(subscription.getAutoRenew())
                .build();
    }
}

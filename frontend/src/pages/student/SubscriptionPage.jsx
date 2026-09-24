import React, { useEffect, useMemo, useState } from 'react';
import { Check, Crown, CreditCard, RotateCcw, ShieldCheck, Sparkles, Zap, Info } from 'lucide-react';
import { subscriptionService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const formatPrice = (amountInPaise) => {
  if (!amountInPaise) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountInPaise / 100);
};

const planIcon = {
  FREE: ShieldCheck,
  PRO: Zap,
  PREMIUM: Crown,
};

const SubscriptionPage = () => {
  const { user, setUser, refreshUserProfile } = useAuth();
  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState('MONTHLY');
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState('');
  const [pendingCheckout, setPendingCheckout] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const activePlan = user?.subscription?.plan || 'FREE';
  const monthlyLimit = user?.subscription?.monthlyTestLimit ?? 5;
  const isUnlimited = monthlyLimit === -1;

  useEffect(() => {
    loadPlans();
  }, []);

  const highlightedPlan = useMemo(() => {
    if (activePlan === 'PREMIUM') return 'PREMIUM';
    return 'PRO';
  }, [activePlan]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await subscriptionService.getPlans();
      setPlans(res.data || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Unable to load subscription plans.' });
    } finally {
      setLoading(false);
    }
  };

  const syncSubscription = async (subscription) => {
    const nextUser = { ...user, subscription };
    setUser(nextUser);
    await refreshUserProfile?.();
  };

  const handleCheckout = async (plan) => {
    setMessage({ type: '', text: '' });
    setPendingCheckout(null);
    setProcessingPlan(plan.plan);

    try {
      const checkout = await subscriptionService.createCheckout({
        plan: plan.plan,
        billingCycle,
      });

      if (plan.plan === 'FREE') {
        const current = await subscriptionService.getCurrentSubscription();
        await syncSubscription(current.data);
        setMessage({ type: 'success', text: 'Your account is now on the Free plan.' });
        return;
      }

      setPendingCheckout(checkout.data);
      setMessage({ type: 'success', text: 'Payment order created. Confirm the demo payment to activate your plan.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Unable to start checkout.' });
    } finally {
      setProcessingPlan('');
    }
  };

  const handleConfirmPayment = async () => {
    if (!pendingCheckout?.orderId) return;

    setProcessingPlan(pendingCheckout.plan);
    setMessage({ type: '', text: '' });

    try {
      const res = await subscriptionService.confirmPayment({
        orderId: pendingCheckout.orderId,
        paymentId: `LOCAL-${Date.now()}`,
      });
      await syncSubscription(res.data);
      setPendingCheckout(null);
      setMessage({ type: 'success', text: `${res.data.planName} plan activated successfully.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Payment confirmation failed.' });
    } finally {
      setProcessingPlan('');
    }
  };

  const handleCancel = async () => {
    setProcessingPlan(activePlan);
    setMessage({ type: '', text: '' });

    try {
      const res = await subscriptionService.cancelSubscription();
      await syncSubscription(res.data);
      setPendingCheckout(null);
      setMessage({ type: 'success', text: 'Subscription cancelled. Your account is now on Free.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Unable to cancel subscription.' });
    } finally {
      setProcessingPlan('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="page-band p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={15} /> Subscription
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-primary">Choose your learning plan</h1>
            <p className="text-theme-secondary max-w-2xl font-semibold">
              Upgrade when you need more attempts, deeper analytics, certificates, and priority support.
            </p>
            {/* Current plan info */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-theme-input border border-theme text-xs font-bold text-theme-secondary">
              <Info size={14} className="text-indigo-500" />
              Current: <span className="text-indigo-500">{user?.subscription?.planName || 'Free'}</span>
              {' — '}
              {isUnlimited ? 'Unlimited attempts/month' : `${monthlyLimit} attempts/month`}
            </div>
          </div>

          <div className="inline-flex p-1 rounded-lg bg-theme-input border border-theme w-fit">
            {['MONTHLY', 'YEARLY'].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                  billingCycle === cycle
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-theme-secondary hover:text-theme-primary'
                }`}
              >
                {cycle === 'MONTHLY' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-semibold border ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
        }`}>
          {message.text}
        </div>
      )}

      {pendingCheckout && (
        <div className="glass-card p-5 border-cyan-500/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-cyan-500 uppercase tracking-wider">Payment Order Ready</p>
            <h2 className="text-xl font-extrabold text-theme-primary">
              {pendingCheckout.plan} {billingCycle.toLowerCase()} plan - {formatPrice(pendingCheckout.amountInPaise)}
            </h2>
            <p className="text-sm text-theme-muted font-semibold">Order ID: {pendingCheckout.orderId}</p>
          </div>
          <button
            onClick={handleConfirmPayment}
            disabled={Boolean(processingPlan)}
            className="btn btn-primary"
          >
            <CreditCard size={18} />
            {processingPlan ? 'Confirming...' : 'Confirm Demo Payment'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = planIcon[plan.plan] || ShieldCheck;
          const amount = billingCycle === 'YEARLY' ? plan.yearlyPriceInPaise : plan.monthlyPriceInPaise;
          const isActive = activePlan === plan.plan;
          const isHighlighted = highlightedPlan === plan.plan;

          return (
            <div
              key={plan.plan}
              className={`pricing-card glass-card p-6 flex flex-col gap-6 ${
                isHighlighted ? 'pricing-card-featured' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-500">
                      <Icon size={22} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-theme-primary">{plan.name}</h2>
                  </div>
                  <p className="text-sm font-semibold text-theme-secondary min-h-[44px]">{plan.description}</p>
                </div>
                {isActive && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                    Active
                  </span>
                )}
              </div>

              <div>
                <div className="text-4xl font-extrabold text-theme-primary">{formatPrice(amount)}</div>
                <p className="text-sm font-semibold text-theme-muted">
                  {amount ? `per ${billingCycle === 'YEARLY' ? 'year' : 'month'}` : 'no card required'}
                </p>
              </div>

              <div className="space-y-3 flex-1">
                {plan.features?.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm font-semibold text-theme-secondary">
                    <Check size={17} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCheckout(plan)}
                disabled={processingPlan === plan.plan || isActive}
                className={`btn w-full ${isActive ? 'btn-secondary opacity-70 cursor-not-allowed' : 'btn-primary'}`}
              >
                <CreditCard size={18} />
                {processingPlan === plan.plan ? 'Processing...' : isActive ? 'Current Plan' : amount ? 'Upgrade Plan' : 'Switch to Free'}
              </button>
            </div>
          );
        })}
      </div>

      {activePlan !== 'FREE' && (
        <div className="flex justify-end">
          <button
            onClick={handleCancel}
            disabled={Boolean(processingPlan)}
            className="btn btn-outline text-rose-500 border-rose-500 hover:bg-rose-500/10"
          >
            <RotateCcw size={18} />
            Cancel Subscription
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;

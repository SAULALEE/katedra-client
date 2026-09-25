import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePlanes } from '../hooks/usePlanes';
import { useSuscripcionStore } from '../store/suscripcionStore';
import LandingGlobalStyles from '../components/landing/LandingGlobalStyles';
import LandingHeader from '../components/LandingHeader';
import LandingHero from '../components/landing/LandingHero';
import LandingProcess from '../components/landing/LandingProcess';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingStats from '../components/landing/LandingStats';
import LandingIntegrations from '../components/landing/LandingIntegrations';
import LandingPricing from '../components/landing/LandingPricing';
import LandingFaq from '../components/landing/LandingFaq';
import LandingFinalCta from '../components/landing/LandingFinalCta';
import LandingFooter from '../components/landing/LandingFooter';
import LandingModalStyles from '../components/landing/LandingModalStyles';
import LandingPlanModal from '../components/landing/LandingPlanModal';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { planes, loading: planesLoading, error: planesError } = usePlanes();
  const abrirCheckout = useSuscripcionStore((state) => state.abrirCheckout);
  const [planModalAbierto, setPlanModalAbierto] = useState(false);
  const [billing, setBilling] = useState('monthly');

  const planesVisibles = planes.filter((plan) => !plan.ciclo || plan.ciclo === (billing === 'monthly' ? 'mensual' : 'anual'));

  const comprarPlan = (plan) => {
    if (plan.id === 'free') {
      navigate(isAuthenticated ? '/dashboard' : '/register');
      return;
    }
    if (isAuthenticated) {
      // Same entry point as every locked feature elsewhere (Generator, Dashboard, Users):
      // the comparison modal first, checkout only after "Mejorar a Pro" inside it.
      setPlanModalAbierto(true);
      return;
    }
    const ciclo = plan.ciclo || (billing === 'monthly' ? 'mensual' : 'anual');
    const checkoutIntent = { planId: plan.id, ciclo };
    sessionStorage.setItem('katedra_checkout_intent', JSON.stringify(checkoutIntent));
    navigate('/login', { state: { checkoutIntent } });
  };

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#ffffff', color: '#0F172A', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* GLOBAL CUSTOM KEYFRAMES & STYLES */}
      <LandingGlobalStyles />

      {/* ============ NAVBAR ============ */}
      <LandingHeader navigate={navigate} />

      {/* ============ HERO SECTION ============ */}
      <LandingHero navigate={navigate} />

      {/* ============ PROCESS SECTION ============ */}
      <LandingProcess />

      {/* ============ FEATURE SHOWCASE SECTION ============ */}
      <LandingFeatures />

      {/* ============ STATS SECTION ============ */}
      <LandingStats />

      {/* ============ INTEGRATIONS SECTION ============ */}
      <LandingIntegrations />

      {/* ============ PRICING SECTION ============ */}
      <LandingPricing billing={billing} setBilling={setBilling} planesLoading={planesLoading} planesError={planesError} planesVisibles={planesVisibles} comprarPlan={comprarPlan} />

      {/* ============ FAQS SECTION ============ */}
      <LandingFaq />

      {/* ============ CTA BANNER SECTION ============ */}
      <LandingFinalCta navigate={navigate} />

      {/* ============ FOOTER ============ */}
      <LandingFooter />

      {/*
        Landing has no [data-root]/dark-mode toggle of its own, so PlanModal's `--kt-*`
        variables would otherwise resolve to nothing here. Mirror the light-theme values
        the panel pages declare, scoped to this wrapper only.
      */}
      <LandingModalStyles />
      <LandingPlanModal planModalAbierto={planModalAbierto} setPlanModalAbierto={setPlanModalAbierto} abrirCheckout={abrirCheckout} navigate={navigate} />
    </div>
  );
}

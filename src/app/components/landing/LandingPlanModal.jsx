import { PlanModal } from '../PlanModal';

export default function LandingPlanModal({ planModalAbierto, setPlanModalAbierto, abrirCheckout, navigate }) {
  return (
      <div data-kt-landing-modal>
        <PlanModal
          abierto={planModalAbierto}
          onCerrar={() => setPlanModalAbierto(false)}
          onMejorar={(ciclo) => { setPlanModalAbierto(false); abrirCheckout(ciclo); navigate('/dashboard'); }}
        />
      </div>
  );
}

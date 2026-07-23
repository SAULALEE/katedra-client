import { AlertCircle } from 'lucide-react';

export default function DeleteConfirmationModal({ open, title, name, loading, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div onClick={() => !loading && onCancel()} style={{ position:'absolute', inset:0, background:'var(--kt-modal-backdrop)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)' }}></div>
      <div role="alertdialog" aria-modal="true" aria-labelledby="delete-title" style={{ position:'relative', width:'100%', maxWidth:'440px', background:'linear-gradient(180deg,var(--kt-modal-bg1),var(--kt-modal-bg2))', border:'1px solid var(--kt-modal-border)', borderRadius:'20px', boxShadow:'var(--kt-shadow-modal)', padding:'26px 28px' }}>
        <div style={{ width:'46px', height:'46px', display:'grid', placeItems:'center', borderRadius:'13px', background:'rgba(244,63,94,.12)', color:'#FB7185', marginBottom:'16px' }}><AlertCircle size={22} /></div>
        <h3 id="delete-title" style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'20px', letterSpacing:'-.6px', color:'var(--kt-heading)', margin:0 }}>{title}</h3>
        <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13.5px', lineHeight:1.6, color:'var(--kt-muted)', margin:'9px 0 22px' }}>
          ¿Deseas eliminar “{name}”? Esta acción no se puede deshacer.
        </p>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px' }}>
          <button type="button" onClick={onCancel} disabled={loading} style={{ height:'40px', padding:'0 16px', border:'1px solid var(--kt-input-border)', borderRadius:'10px', background:'var(--kt-chip-bg)', color:'var(--kt-muted)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700 }}>Cancelar</button>
          <button type="button" onClick={onConfirm} disabled={loading} style={{ height:'40px', padding:'0 18px', border:'none', borderRadius:'10px', background:'linear-gradient(150deg,#F43F5E,#E11D48)', color:'#fff', cursor:loading ? 'wait' : 'pointer', fontFamily:"'Manrope'", fontWeight:800 }}>{loading ? 'Eliminando...' : 'Eliminar'}</button>
        </div>
      </div>
    </div>
  );
}

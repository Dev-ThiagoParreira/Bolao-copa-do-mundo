import { formatarMoeda } from '../utils/pagamento.js';
import { getConfrontoLabel, getOpcaoLabel } from '../utils/campanhaJogo.js';

export default function ComprovanteViewer({
  comprovante,
  aposta,
  isAdmin = false,
  onConfirm,
  onCancel,
  onClose,
}) {
  if (!comprovante) return null;

  const campanha = aposta?.campanhaOpcao?.campanha;
  const valorBolao = campanha?.valorBolao;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 3000 }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="card card-shadow p-3"
        style={{ maxWidth: '92vw', maxHeight: '92vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Comprovante de pagamento"
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            {isAdmin ? 'Validar comprovante PIX' : 'Comprovante PIX'}
          </h5>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>

        {aposta && (
          <div className="border rounded p-3 mb-3 bg-light">
            {isAdmin && (
              <p className="mb-1"><strong>Usuário:</strong> {aposta.usuario?.nome}</p>
            )}
            <p className="mb-1"><strong>Jogo:</strong> {getConfrontoLabel(campanha)}</p>
            <p className="mb-1">
              <strong>Palpite:</strong> {getOpcaoLabel(aposta.campanhaOpcao, campanha)}
            </p>
            <p className="mb-0">
              <strong>Valor do bolão:</strong> {formatarMoeda(valorBolao)}
            </p>
            {isAdmin && (
              <p className="text-muted small mb-0 mt-2">
                Confira na imagem se o pagamento PIX corresponde ao valor do bolão e aos dados da aposta.
              </p>
            )}
          </div>
        )}

        <img
          src={comprovante}
          alt="Comprovante de pagamento PIX"
          style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }}
          className="d-block mx-auto border rounded"
        />

        {isAdmin && aposta?.status === 'PENDENTE' && (
          <div className="d-flex gap-2 justify-content-end mt-3">
            <button type="button" className="btn btn-outline-danger" onClick={onCancel}>
              Rejeitar aposta
            </button>
            <button type="button" className="btn btn-success" onClick={onConfirm}>
              Confirmar pagamento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

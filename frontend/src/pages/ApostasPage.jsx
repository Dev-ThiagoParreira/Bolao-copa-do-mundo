import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getConfrontoLabel,
  getOpcaoLabel,
} from '../utils/campanhaJogo.js';
import { apostaService } from '../services/resources.js';
import { getErrorMessage } from '../services/api.js';
import { useNotification } from '../context/NotificationContext.jsx';
import { formatarMoeda } from '../utils/pagamento.js';
import ComprovanteViewer from '../components/ComprovanteViewer.jsx';

function formatDateTime(value) {
  return new Date(value).toLocaleString('pt-BR');
}

function TabelaApostas({
  apostas,
  isAdmin,
  carregandoComprovante,
  onVerComprovante,
  onAtualizarStatus,
  mostrarAcoesAdmin,
}) {
  if (!apostas.length) {
    return <p className="text-muted mb-0">Nenhuma aposta nesta lista.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table mb-0 align-middle">
        <thead>
          <tr>
            <th>ID</th>
            {isAdmin && <th>Usuário</th>}
            <th>Jogo</th>
            <th>Palpite</th>
            <th>Pagamento</th>
            <th>Valor bolão</th>
            <th>Status</th>
            <th>Criada em</th>
            <th>Comprovante</th>
            {mostrarAcoesAdmin && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {apostas.map((aposta) => (
            <tr key={aposta.id}>
              <td>{aposta.id}</td>
              {isAdmin && <td>{aposta.usuario.nome}</td>}
              <td>{getConfrontoLabel(aposta.campanhaOpcao.campanha)}</td>
              <td>{getOpcaoLabel(aposta.campanhaOpcao, aposta.campanhaOpcao.campanha)}</td>
              <td>{aposta.meioPagamento.descricao}</td>
              <td>{formatarMoeda(aposta.campanhaOpcao.campanha.valorBolao)}</td>
              <td>
                <span className={`badge ${aposta.status === 'CONFIRMADA' ? 'text-bg-success' : aposta.status === 'CANCELADA' ? 'text-bg-danger' : 'text-bg-warning text-dark'}`}>
                  {aposta.status}
                </span>
              </td>
              <td>{formatDateTime(aposta.dtCriacao)}</td>
              <td>
                {aposta.temComprovante ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    disabled={carregandoComprovante}
                    onClick={() => onVerComprovante(aposta.id)}
                  >
                    {isAdmin && aposta.status === 'PENDENTE' ? 'Validar' : 'Ver imagem'}
                  </button>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
              {mostrarAcoesAdmin && (
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    {aposta.status === 'PENDENTE' && aposta.temComprovante && (
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => onVerComprovante(aposta.id)}
                      >
                        Abrir e validar
                      </button>
                    )}
                    {aposta.status !== 'CANCELADA' && aposta.status !== 'CONFIRMADA' && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onAtualizarStatus(aposta.id, 'CANCELADA')}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ApostasPage() {
  const { isAdmin } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [apostas, setApostas] = useState([]);
  const [apostaSelecionada, setApostaSelecionada] = useState(null);
  const [comprovanteAberto, setComprovanteAberto] = useState(null);
  const [carregandoComprovante, setCarregandoComprovante] = useState(false);

  async function loadApostas() {
    try {
      const { data } = await apostaService.list();
      setApostas(data.data);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  useEffect(() => {
    loadApostas();
  }, []);

  const handleVerComprovante = async (apostaId) => {
    setCarregandoComprovante(true);
    try {
      const { data } = await apostaService.getById(apostaId);
      if (!data.data.comprovante) {
        showError('Esta aposta não possui comprovante');
        return;
      }
      setApostaSelecionada(data.data);
      setComprovanteAberto(data.data.comprovante);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setCarregandoComprovante(false);
    }
  };

  const handleAtualizarStatus = async (apostaId, status) => {
    try {
      const { data } = await apostaService.updateStatus(apostaId, status);
      showSuccess(data.message);
      setComprovanteAberto(null);
      setApostaSelecionada(null);
      loadApostas();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const fecharComprovante = () => {
    setComprovanteAberto(null);
    setApostaSelecionada(null);
  };

  const pendentes = apostas.filter((aposta) => aposta.status === 'PENDENTE');
  const demais = isAdmin ? apostas.filter((aposta) => aposta.status !== 'PENDENTE') : apostas;

  return (
    <div>
      <h2>{isAdmin ? 'Validação de apostas' : 'Minhas apostas'}</h2>
      <p className="text-muted">
        {isAdmin
          ? 'Abra o comprovante PIX, confira o pagamento manualmente e confirme ou rejeite a aposta.'
          : 'Acompanhe suas apostas. O comprovante será analisado por um administrador.'}
      </p>

      {isAdmin && (
        <div className="card card-shadow mb-4">
          <div className="card-header bg-warning-subtle">
            <strong>Pendentes de validação ({pendentes.length})</strong>
          </div>
          <div className="card-body p-0">
            <TabelaApostas
              apostas={pendentes}
              isAdmin={isAdmin}
              carregandoComprovante={carregandoComprovante}
              onVerComprovante={handleVerComprovante}
              onAtualizarStatus={handleAtualizarStatus}
              mostrarAcoesAdmin
            />
          </div>
        </div>
      )}

      <div className="card card-shadow">
        <div className="card-body p-0">
          {isAdmin && demais.length > 0 && (
            <div className="px-3 pt-3">
              <strong>Histórico</strong>
            </div>
          )}
          <TabelaApostas
            apostas={isAdmin ? demais : apostas}
            isAdmin={isAdmin}
            carregandoComprovante={carregandoComprovante}
            onVerComprovante={handleVerComprovante}
            onAtualizarStatus={handleAtualizarStatus}
            mostrarAcoesAdmin={false}
          />
        </div>
      </div>

      {comprovanteAberto && apostaSelecionada && (
        <ComprovanteViewer
          comprovante={comprovanteAberto}
          aposta={apostaSelecionada}
          isAdmin={isAdmin}
          onConfirm={() => handleAtualizarStatus(apostaSelecionada.id, 'CONFIRMADA')}
          onCancel={() => handleAtualizarStatus(apostaSelecionada.id, 'CANCELADA')}
          onClose={fecharComprovante}
        />
      )}
    </div>
  );
}

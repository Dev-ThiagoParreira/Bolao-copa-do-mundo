import { useEffect, useState } from 'react';
import { campanhaService, meioPagamentoService, apostaService } from '../services/resources.js';
import { getErrorMessage } from '../services/api.js';
import { useNotification } from '../context/NotificationContext.jsx';

function formatDate(value) {
  return new Date(value).toLocaleDateString('pt-BR');
}

export default function CampanhasPage() {
  const { showSuccess, showError } = useNotification();
  const [campanhas, setCampanhas] = useState([]);
  const [meiosPagamento, setMeiosPagamento] = useState([]);
  const [selectedCampanha, setSelectedCampanha] = useState(null);
  const [opcoes, setOpcoes] = useState([]);
  const [form, setForm] = useState({
    campanhaOpcaoId: '',
    meioPagamentoId: '',
    comprovante: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [campanhasResp, meiosResp] = await Promise.all([
          campanhaService.list(),
          meioPagamentoService.list(),
        ]);
        setCampanhas(campanhasResp.data.data);
        setMeiosPagamento(meiosResp.data.data);
      } catch (error) {
        showError(getErrorMessage(error));
      }
    }

    loadData();
  }, [showError]);

  const handleSelectCampanha = async (campanha) => {
    setSelectedCampanha(campanha);
    try {
      const { data } = await campanhaService.listOpcoes(campanha.id);
      setOpcoes(data.data);
      setForm({ campanhaOpcaoId: '', meioPagamentoId: '', comprovante: '' });
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleCreateAposta = async (event) => {
    event.preventDefault();

    try {
      const { data } = await apostaService.create({
        campanhaOpcaoId: Number(form.campanhaOpcaoId),
        meioPagamentoId: Number(form.meioPagamentoId),
        comprovante: form.comprovante || undefined,
      });
      showSuccess(data.message);
      setForm({ campanhaOpcaoId: '', meioPagamentoId: '', comprovante: '' });
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div>
      <h2>Campanhas disponíveis</h2>
      <p className="text-muted">Escolha uma campanha aberta, selecione a opção e registre sua aposta.</p>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="row g-3">
            {campanhas.map((campanha) => (
              <div className="col-md-6" key={campanha.id}>
                <button
                  type="button"
                  className={`card card-shadow p-3 w-100 text-start ${selectedCampanha?.id === campanha.id ? 'border border-primary' : ''}`}
                  onClick={() => handleSelectCampanha(campanha)}
                >
                  <h5>{campanha.nome}</h5>
                  <small>{campanha.codigoCampanha}</small>
                  <p className="mb-1 mt-2">Status: {campanha.status}</p>
                  <p className="mb-0">{formatDate(campanha.dtInicio)} - {formatDate(campanha.dtFim)}</p>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card card-shadow p-4">
            <h4>Criar aposta</h4>
            {!selectedCampanha ? (
              <p className="text-muted">Selecione uma campanha para continuar.</p>
            ) : (
              <form onSubmit={handleCreateAposta}>
                <p className="fw-semibold">{selectedCampanha.nome}</p>
                <div className="mb-3">
                  <label className="form-label">Opção</label>
                  <select
                    className="form-select"
                    value={form.campanhaOpcaoId}
                    onChange={(e) => setForm({ ...form, campanhaOpcaoId: e.target.value })}
                    required
                  >
                    <option value="">Selecione</option>
                    {opcoes.map((opcao) => (
                      <option key={opcao.id} value={opcao.id}>
                        {opcao.descricao} ({opcao.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Meio de pagamento</label>
                  <select
                    className="form-select"
                    value={form.meioPagamentoId}
                    onChange={(e) => setForm({ ...form, meioPagamentoId: e.target.value })}
                    required
                  >
                    <option value="">Selecione</option>
                    {meiosPagamento.map((meio) => (
                      <option key={meio.id} value={meio.id}>
                        {meio.descricao}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Comprovante</label>
                  <input
                    className="form-control"
                    value={form.comprovante}
                    onChange={(e) => setForm({ ...form, comprovante: e.target.value })}
                    placeholder="Obrigatório para PIX"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Registrar aposta
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

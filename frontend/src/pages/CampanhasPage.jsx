import { useEffect, useState } from 'react';
import { campanhaService, meioPagamentoService, apostaService } from '../services/resources.js';
import { getErrorMessage } from '../services/api.js';
import { useNotification } from '../context/NotificationContext.jsx';
import { fileToBase64 } from '../utils/imageBase64.js';
import { formatarMoeda } from '../utils/pagamento.js';
import {
  getConfrontoLabel,
  getOpcaoLabel,
  getOpcaoResumo,
  ordenarOpcoesJogo,
} from '../utils/campanhaJogo.js';

function formatDate(value) {
  return new Date(value).toLocaleDateString('pt-BR');
}

export default function CampanhasPage() {
  const { showSuccess, showError } = useNotification();
  const [campanhas, setCampanhas] = useState([]);
  const [meiosPagamento, setMeiosPagamento] = useState([]);
  const [selectedCampanha, setSelectedCampanha] = useState(null);
  const [opcoes, setOpcoes] = useState([]);
  const [comprovantePreview, setComprovantePreview] = useState('');
  const [form, setForm] = useState({
    campanhaOpcaoId: '',
    meioPagamentoId: '',
    comprovante: '',
  });

  const valorBolao = selectedCampanha ? Number(selectedCampanha.valorBolao) : 0;

  const meioSelecionado = meiosPagamento.find(
    (meio) => String(meio.id) === String(form.meioPagamentoId)
  );
  const exigeComprovante = Boolean(meioSelecionado?.comprovanteObrigatorio);

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
      setOpcoes(ordenarOpcoesJogo(data.data));
      setForm({ campanhaOpcaoId: '', meioPagamentoId: '', comprovante: '' });
      setComprovantePreview('');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleComprovanteChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setForm({ ...form, comprovante: '' });
      setComprovantePreview('');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setForm({ ...form, comprovante: base64 });
      setComprovantePreview(base64);
    } catch (error) {
      showError(error.message);
      event.target.value = '';
      setForm({ ...form, comprovante: '' });
      setComprovantePreview('');
    }
  };

  const handleCreateAposta = async (event) => {
    event.preventDefault();

    try {
      if (exigeComprovante && !form.comprovante) {
        showError('Envie a imagem do comprovante PIX');
        return;
      }

      const { data } = await apostaService.create({
        campanhaOpcaoId: Number(form.campanhaOpcaoId),
        meioPagamentoId: Number(form.meioPagamentoId),
        comprovante: form.comprovante || undefined,
      });
      showSuccess(data.message);
      setForm({ campanhaOpcaoId: '', meioPagamentoId: '', comprovante: '' });
      setComprovantePreview('');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const opcoesOrdenadas = ordenarOpcoesJogo(opcoes);

  return (
    <div>
      <h2>Campanhas disponíveis</h2>
      <p className="text-muted">Escolha um jogo e marque seu palpite: vitória de um time, empate ou vitória do adversário.</p>

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
                  <h5 className="mb-1">{getConfrontoLabel(campanha)}</h5>
                  <small className="text-muted">{campanha.codigoCampanha}</small>
                  <p className="mb-1 mt-2">
                    <span className={`badge ${campanha.status === 'ABERTA' ? 'text-bg-success' : 'text-bg-secondary'}`}>
                      {campanha.status}
                    </span>
                  </p>
                  <p className="mb-0 small">{formatDate(campanha.dtInicio)} - {formatDate(campanha.dtFim)}</p>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card card-shadow p-4">
            <h4>Registrar aposta</h4>
            {!selectedCampanha ? (
              <p className="text-muted">Selecione um jogo para continuar.</p>
            ) : (
              <form onSubmit={handleCreateAposta}>
                <p className="fw-semibold mb-1">{getConfrontoLabel(selectedCampanha)}</p>
                <p className="text-muted small mb-3">Qual será o resultado do jogo?</p>

                <div className="mb-3 d-flex flex-column gap-2">
                  {opcoesOrdenadas.map((opcao) => {
                    const selected = String(form.campanhaOpcaoId) === String(opcao.id);
                    const resumo = getOpcaoResumo(opcao, selectedCampanha);

                    return (
                      <label
                        key={opcao.id}
                        className={`border rounded p-3 d-flex align-items-start gap-2 ${selected ? 'border-primary bg-light' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <input
                          type="radio"
                          name="campanhaOpcaoId"
                          className="form-check-input mt-1"
                          value={opcao.id}
                          checked={selected}
                          onChange={(e) => setForm({ ...form, campanhaOpcaoId: e.target.value })}
                          required
                        />
                        <span>
                          <strong>{getOpcaoLabel(opcao, selectedCampanha)}</strong>
                          {resumo && <small className="d-block text-muted">{resumo}</small>}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="mb-3">
                  <label className="form-label">Meio de pagamento</label>
                  <select
                    className="form-select"
                    value={form.meioPagamentoId}
                    onChange={(e) => {
                      setForm({ ...form, meioPagamentoId: e.target.value, comprovante: '' });
                      setComprovantePreview('');
                    }}
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
                {exigeComprovante && (
                  <>
                    <div className="alert alert-info py-2 mb-3">
                      Valor do bolão: <strong>{formatarMoeda(valorBolao)}</strong>.
                      Envie o comprovante PIX. Um administrador irá validar o pagamento.
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Comprovante PIX (imagem)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleComprovanteChange}
                      required
                    />
                    <small className="text-muted">JPEG, PNG ou WebP — máximo 3MB</small>
                    {comprovantePreview && (
                      <div className="mt-3 border rounded p-2 text-center">
                        <img
                          src={comprovantePreview}
                          alt="Prévia do comprovante"
                          style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                        />
                      </div>
                    )}
                  </div>
                  </>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={!form.campanhaOpcaoId || (exigeComprovante && !form.comprovante)}
                >
                  Confirmar aposta
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

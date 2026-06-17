import { useEffect, useMemo, useState } from 'react';
import { campanhaService, tipoCampanhaService } from '../services/resources.js';
import { getErrorMessage } from '../services/api.js';
import { useNotification } from '../context/NotificationContext.jsx';
import { getConfrontoLabel, getOpcaoLabel, ordenarOpcoesJogo } from '../utils/campanhaJogo.js';

const initialCampanha = {
  timeA: '',
  timeB: '',
  dtInicio: '',
  dtFim: '',
  taxaOperacional: '',
  valorBolao: '',
  codigoCampanha: '',
  tipoCampanhaId: '',
};

function formatDate(value) {
  return new Date(value).toLocaleDateString('pt-BR');
}

export default function AdminCampanhasPage() {
  const { showSuccess, showError } = useNotification();
  const [tipos, setTipos] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [campanhaForm, setCampanhaForm] = useState(initialCampanha);

  const previewNome = useMemo(() => {
    if (!campanhaForm.timeA || !campanhaForm.timeB) return '';
    return `${campanhaForm.timeA} x ${campanhaForm.timeB}`;
  }, [campanhaForm.timeA, campanhaForm.timeB]);

  async function loadData() {
    try {
      const [tiposResp, campanhasResp] = await Promise.all([
        tipoCampanhaService.list(),
        campanhaService.list(),
      ]);
      setTipos(tiposResp.data.data);
      setCampanhas(campanhasResp.data.data);

      if (tiposResp.data.data.length && !campanhaForm.tipoCampanhaId) {
        setCampanhaForm((prev) => ({
          ...prev,
          tipoCampanhaId: String(tiposResp.data.data[0].id),
        }));
      }
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCampanha = async (event) => {
    event.preventDefault();

    try {
      const { data } = await campanhaService.create({
        ...campanhaForm,
        taxaOperacional: Number(campanhaForm.taxaOperacional),
        valorBolao: Number(campanhaForm.valorBolao),
        tipoCampanhaId: Number(campanhaForm.tipoCampanhaId),
      });
      showSuccess(`${data.message} Opções criadas: vitória ${campanhaForm.timeA}, empate e vitória ${campanhaForm.timeB}.`);
      setCampanhaForm((prev) => ({
        ...initialCampanha,
        tipoCampanhaId: prev.tipoCampanhaId,
      }));
      loadData();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleForceError = async () => {
    try {
      await campanhaService.create({
        timeA: 'Brasil',
        timeB: 'Brasil',
        dtInicio: '2026-12-31',
        dtFim: '2026-01-01',
        taxaOperacional: 1,
        valorBolao: 10,
        codigoCampanha: 'ERRO-DEMO',
        tipoCampanhaId: Number(campanhaForm.tipoCampanhaId) || 1,
      });
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Administração de jogos</h2>
          <p className="text-muted mb-0">
            Cadastre um confronto e o sistema cria automaticamente as opções: vitória, empate e derrota do adversário.
          </p>
        </div>
        <button type="button" className="btn btn-outline-danger" onClick={handleForceError}>
          Forçar erro de validação
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card card-shadow p-4">
            <h5 className="mb-3">Novo jogo da campanha</h5>
            <form onSubmit={handleCreateCampanha}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Time A (mandante)</label>
                  <input
                    className="form-control"
                    placeholder="Ex: Brasil"
                    value={campanhaForm.timeA}
                    onChange={(e) => setCampanhaForm({ ...campanhaForm, timeA: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Time B (visitante)</label>
                  <input
                    className="form-control"
                    placeholder="Ex: Argentina"
                    value={campanhaForm.timeB}
                    onChange={(e) => setCampanhaForm({ ...campanhaForm, timeB: e.target.value })}
                    required
                  />
                </div>

                {previewNome && (
                  <div className="col-12">
                    <div className="alert alert-info mb-0 py-2">
                      Confronto: <strong>{previewNome}</strong>
                    </div>
                  </div>
                )}

                <div className="col-md-6">
                  <label className="form-label">Código da campanha</label>
                  <input
                    className="form-control"
                    placeholder="Ex: COPA-BRA-ARG-01"
                    value={campanhaForm.codigoCampanha}
                    onChange={(e) => setCampanhaForm({ ...campanhaForm, codigoCampanha: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tipo de campanha</label>
                  <select
                    className="form-select"
                    value={campanhaForm.tipoCampanhaId}
                    onChange={(e) => setCampanhaForm({ ...campanhaForm, tipoCampanhaId: e.target.value })}
                    required
                  >
                    <option value="">Selecione</option>
                    {tipos.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>{tipo.descricao}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Início das apostas</label>
                  <input
                    type="date"
                    className="form-control"
                    value={campanhaForm.dtInicio}
                    onChange={(e) => setCampanhaForm({ ...campanhaForm, dtInicio: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Fim das apostas</label>
                  <input
                    type="date"
                    className="form-control"
                    value={campanhaForm.dtFim}
                    onChange={(e) => setCampanhaForm({ ...campanhaForm, dtFim: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Taxa operacional (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={campanhaForm.taxaOperacional}
                    onChange={(e) => setCampanhaForm({ ...campanhaForm, taxaOperacional: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Valor do bolão (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={campanhaForm.valorBolao}
                    onChange={(e) => setCampanhaForm({ ...campanhaForm, valorBolao: e.target.value })}
                    required
                  />
                </div>
              </div>

              {previewNome && (
                <div className="mt-4">
                  <p className="fw-semibold mb-2">Opções que serão criadas automaticamente:</p>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-success">Vitória {campanhaForm.timeA}</span>
                    <span className="badge text-bg-warning text-dark">Empate</span>
                    <span className="badge text-bg-primary">Vitória {campanhaForm.timeB}</span>
                  </div>
                  <small className="text-muted d-block mt-2">
                    A vitória de um time equivale à derrota do outro.
                  </small>
                </div>
              )}

              <button type="submit" className="btn btn-primary mt-4">
                Criar jogo e opções de aposta
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card card-shadow p-4 h-100">
            <h5 className="mb-3">Jogos cadastrados</h5>
            {campanhas.length === 0 ? (
              <p className="text-muted mb-0">Nenhum jogo cadastrado ainda.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {campanhas.map((campanha) => (
                  <div key={campanha.id} className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <h6 className="mb-1">{getConfrontoLabel(campanha)}</h6>
                        <small className="text-muted">{campanha.codigoCampanha}</small>
                      </div>
                      <span className={`badge ${campanha.status === 'ABERTA' ? 'text-bg-success' : 'text-bg-secondary'}`}>
                        {campanha.status}
                      </span>
                    </div>
                    <p className="small text-muted mb-2 mt-2">
                      {formatDate(campanha.dtInicio)} até {formatDate(campanha.dtFim)} · R$ {Number(campanha.valorBolao).toFixed(2)}
                    </p>
                    <div className="d-flex flex-wrap gap-1">
                      {ordenarOpcoesJogo(campanha.opcoes).map((opcao) => (
                        <span key={opcao.id} className="badge text-bg-light text-dark border">
                          {getOpcaoLabel(opcao, campanha)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

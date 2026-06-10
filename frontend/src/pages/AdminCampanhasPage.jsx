import { useEffect, useState } from 'react';
import {
  campanhaService,
  tipoCampanhaService,
  opcaoService,
} from '../services/resources.js';
import { getErrorMessage } from '../services/api.js';
import { useNotification } from '../context/NotificationContext.jsx';

const initialCampanha = {
  nome: '',
  dtInicio: '',
  dtFim: '',
  taxaOperacional: '',
  valorBolao: '',
  codigoCampanha: '',
  tipoCampanhaId: '',
  status: 'ABERTA',
};

const initialOpcao = {
  descricao: '',
  campanhaId: '',
  status: 'ATIVO',
};

export default function AdminCampanhasPage() {
  const { showSuccess, showError } = useNotification();
  const [tipos, setTipos] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [campanhaForm, setCampanhaForm] = useState(initialCampanha);
  const [opcaoForm, setOpcaoForm] = useState(initialOpcao);
  const [tipoForm, setTipoForm] = useState({ descricao: '' });

  async function loadData() {
    try {
      const [tiposResp, campanhasResp] = await Promise.all([
        tipoCampanhaService.list(),
        campanhaService.list(),
      ]);
      setTipos(tiposResp.data.data);
      setCampanhas(campanhasResp.data.data);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTipo = async (event) => {
    event.preventDefault();
    try {
      const { data } = await tipoCampanhaService.create(tipoForm);
      showSuccess(data.message);
      setTipoForm({ descricao: '' });
      loadData();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleCreateCampanha = async (event) => {
    event.preventDefault();
    try {
      const { data } = await campanhaService.create({
        ...campanhaForm,
        taxaOperacional: Number(campanhaForm.taxaOperacional),
        valorBolao: Number(campanhaForm.valorBolao),
        tipoCampanhaId: Number(campanhaForm.tipoCampanhaId),
      });
      showSuccess(data.message);
      setCampanhaForm(initialCampanha);
      loadData();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleCreateOpcao = async (event) => {
    event.preventDefault();
    try {
      const { data } = await opcaoService.create({
        ...opcaoForm,
        campanhaId: Number(opcaoForm.campanhaId),
      });
      showSuccess(data.message);
      setOpcaoForm(initialOpcao);
      loadData();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleForceError = async () => {
    try {
      await campanhaService.create({
        nome: 'Campanha inválida',
        dtInicio: '2026-12-31',
        dtFim: '2026-01-01',
        taxaOperacional: 1,
        valorBolao: 10,
        codigoCampanha: 'ERRO-DEMO',
        tipoCampanhaId: 9999,
      });
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Administração de campanhas</h2>
          <p className="text-muted mb-0">Crie tipos, campanhas e opções de apostas.</p>
        </div>
        <button type="button" className="btn btn-outline-danger" onClick={handleForceError}>
          Forçar erro de validação
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card card-shadow p-3">
            <h5>Novo tipo de campanha</h5>
            <form onSubmit={handleCreateTipo}>
              <input
                className="form-control mb-3"
                placeholder="Descrição"
                value={tipoForm.descricao}
                onChange={(e) => setTipoForm({ descricao: e.target.value })}
                required
              />
              <button className="btn btn-primary w-100">Criar tipo</button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card card-shadow p-3">
            <h5>Nova campanha</h5>
            <form onSubmit={handleCreateCampanha}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input className="form-control" placeholder="Nome" value={campanhaForm.nome} onChange={(e) => setCampanhaForm({ ...campanhaForm, nome: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Código" value={campanhaForm.codigoCampanha} onChange={(e) => setCampanhaForm({ ...campanhaForm, codigoCampanha: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <input type="date" className="form-control" value={campanhaForm.dtInicio} onChange={(e) => setCampanhaForm({ ...campanhaForm, dtInicio: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <input type="date" className="form-control" value={campanhaForm.dtFim} onChange={(e) => setCampanhaForm({ ...campanhaForm, dtFim: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <input type="number" step="0.01" className="form-control" placeholder="Taxa operacional" value={campanhaForm.taxaOperacional} onChange={(e) => setCampanhaForm({ ...campanhaForm, taxaOperacional: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <input type="number" step="0.01" className="form-control" placeholder="Valor bolão" value={campanhaForm.valorBolao} onChange={(e) => setCampanhaForm({ ...campanhaForm, valorBolao: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <select className="form-select" value={campanhaForm.tipoCampanhaId} onChange={(e) => setCampanhaForm({ ...campanhaForm, tipoCampanhaId: e.target.value })} required>
                    <option value="">Tipo de campanha</option>
                    {tipos.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>{tipo.descricao}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary mt-3">Criar campanha</button>
            </form>
          </div>
        </div>

        <div className="col-12">
          <div className="card card-shadow p-3">
            <h5>Nova opção de campanha</h5>
            <form onSubmit={handleCreateOpcao} className="row g-3">
              <div className="col-md-5">
                <input className="form-control" placeholder="Descrição da opção" value={opcaoForm.descricao} onChange={(e) => setOpcaoForm({ ...opcaoForm, descricao: e.target.value })} required />
              </div>
              <div className="col-md-5">
                <select className="form-select" value={opcaoForm.campanhaId} onChange={(e) => setOpcaoForm({ ...opcaoForm, campanhaId: e.target.value })} required>
                  <option value="">Campanha</option>
                  {campanhas.map((campanha) => (
                    <option key={campanha.id} value={campanha.id}>{campanha.nome}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100">Criar opção</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

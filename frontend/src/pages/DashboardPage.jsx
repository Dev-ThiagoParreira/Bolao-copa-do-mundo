import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { campanhaService, apostaService } from '../services/resources.js';
import { getErrorMessage } from '../services/api.js';
import { useNotification } from '../context/NotificationContext.jsx';

function formatDate(value) {
  return new Date(value).toLocaleDateString('pt-BR');
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { showError } = useNotification();
  const [campanhas, setCampanhas] = useState([]);
  const [apostas, setApostas] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [campanhasResp, apostasResp] = await Promise.all([
          campanhaService.list(),
          apostaService.list(),
        ]);
        setCampanhas(campanhasResp.data.data);
        setApostas(apostasResp.data.data);
      } catch (error) {
        showError(getErrorMessage(error));
      }
    }

    loadData();
  }, [showError]);

  const abertas = campanhas.filter((item) => item.status === 'ABERTA');

  return (
    <div>
      <div className="hero-banner">
        <h1>Bem-vindo, {user?.nome}</h1>
        <p className="mb-0">
          Acompanhe campanhas da Copa, faça apostas e gerencie seu perfil.
          {isAdmin && ' Como administrador, você também pode criar campanhas e opções.'}
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card card-shadow p-3">
            <h5>Campanhas abertas</h5>
            <p className="display-6 mb-0">{abertas.length}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-shadow p-3">
            <h5>Minhas apostas</h5>
            <p className="display-6 mb-0">{apostas.length}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-shadow p-3">
            <h5>Perfil</h5>
            <p className="mb-2">{user?.tipoUsuario}</p>
            <Link to="/perfil" className="btn btn-sm btn-outline-primary">
              Ver perfil
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4>Agenda de campanhas</h4>
        <p className="text-muted">
          A interface usa o período da campanha como referência de participação, substituindo a ideia de agendamento do roteiro original.
        </p>
        <div className="row g-3">
          {campanhas.map((campanha) => (
            <div className="col-md-6" key={campanha.id}>
              <div className="card card-shadow calendar-card p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-1">{campanha.nome}</h5>
                    <small className="text-muted">{campanha.codigoCampanha}</small>
                  </div>
                  <span className={`badge bg-${campanha.status === 'ABERTA' ? 'success' : 'secondary'} badge-status`}>
                    {campanha.status}
                  </span>
                </div>
                <p className="mt-3 mb-0">
                  Período: {formatDate(campanha.dtInicio)} até {formatDate(campanha.dtFim)}
                </p>
                <p className="mb-0">Valor do bolão: R$ {Number(campanha.valorBolao).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

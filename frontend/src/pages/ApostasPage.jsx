import { useEffect, useState } from 'react';
import { apostaService } from '../services/resources.js';
import { getErrorMessage } from '../services/api.js';
import { useNotification } from '../context/NotificationContext.jsx';

function formatDateTime(value) {
  return new Date(value).toLocaleString('pt-BR');
}

export default function ApostasPage() {
  const { showError } = useNotification();
  const [apostas, setApostas] = useState([]);

  useEffect(() => {
    async function loadApostas() {
      try {
        const { data } = await apostaService.list();
        setApostas(data.data);
      } catch (error) {
        showError(getErrorMessage(error));
      }
    }

    loadApostas();
  }, [showError]);

  return (
    <div>
      <h2>Minhas apostas</h2>
      <div className="card card-shadow">
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Campanha</th>
                <th>Opção</th>
                <th>Meio pagamento</th>
                <th>Status</th>
                <th>Criada em</th>
              </tr>
            </thead>
            <tbody>
              {apostas.map((aposta) => (
                <tr key={aposta.id}>
                  <td>{aposta.id}</td>
                  <td>{aposta.campanhaOpcao.campanha.nome}</td>
                  <td>{aposta.campanhaOpcao.descricao}</td>
                  <td>{aposta.meioPagamento.descricao}</td>
                  <td>{aposta.status}</td>
                  <td>{formatDateTime(aposta.dtCriacao)}</td>
                </tr>
              ))}
              {!apostas.length && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    Nenhuma aposta registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

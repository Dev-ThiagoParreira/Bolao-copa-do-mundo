import { useEffect, useState } from 'react';
import { usuarioService } from '../services/resources.js';
import { getErrorMessage } from '../services/api.js';
import { useNotification } from '../context/NotificationContext.jsx';

export default function AdminUsuariosPage() {
  const { showSuccess, showError } = useNotification();
  const [usuarios, setUsuarios] = useState([]);

  async function loadUsuarios() {
    try {
      const { data } = await usuarioService.list();
      setUsuarios(data.data);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleToggleStatus = async (usuario) => {
    try {
      const novoStatus = usuario.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
      const { data } = await usuarioService.update(usuario.id, { status: novoStatus });
      showSuccess(data.message);
      loadUsuarios();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div>
      <h2>Usuários</h2>
      <div className="card card-shadow">
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>CPF</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.cpf}</td>
                  <td>{usuario.tipoUsuario}</td>
                  <td>{usuario.status}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => handleToggleStatus(usuario)}>
                      Alternar status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

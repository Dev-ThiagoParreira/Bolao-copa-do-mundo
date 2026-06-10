import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { authService, usuarioService } from '../services/resources.js';
import { getErrorMessage } from '../services/api.js';

export default function PerfilPage() {
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await authService.me();
        setForm({
          nome: data.data.nome,
          email: data.data.email,
          telefone: data.data.telefone || '',
          cpf: data.data.cpf,
        });
        setUser(data.data);
      } catch (error) {
        showError(getErrorMessage(error));
      }
    }

    loadProfile();
  }, [setUser, showError]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await usuarioService.update(user.id, {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
      });
      setUser(data.data);
      showSuccess(data.message);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card card-shadow p-4">
          <h2>Perfil do usuário</h2>
          <p className="text-muted">Gerencie seus dados pessoais e visualize seu perfil de acesso.</p>

          <div className="mb-3">
            <span className="badge bg-primary me-2">{user?.tipoUsuario}</span>
            <span className="badge bg-success">{user?.status}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input className="form-control" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">CPF</label>
              <input className="form-control" value={form.cpf} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Telefone</label>
              <input className="form-control" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary">
              Salvar perfil
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

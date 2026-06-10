import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { authService } from '../services/resources.js';
import { getErrorMessage } from '../services/api.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await authService.register(form);
      login(data.data);
      showSuccess(data.message);
      navigate('/dashboard');
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card card-shadow p-4" style={{ width: '100%', maxWidth: 520 }}>
        <h2 className="mb-3">Criar usuário</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nome</label>
              <input className="form-control" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">CPF</label>
              <input className="form-control" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">E-mail</label>
              <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Telefone</label>
              <input className="form-control" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label">Senha</label>
              <input type="password" className="form-control" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="mt-3 mb-0 text-center">
          Já possui conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
}

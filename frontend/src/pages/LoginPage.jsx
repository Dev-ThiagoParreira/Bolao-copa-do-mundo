import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { authService } from '../services/resources.js';
import { getErrorMessage } from '../services/api.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await authService.login(form);
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
      <div className="card card-shadow p-4" style={{ width: '100%', maxWidth: 420 }}>
        <h2 className="mb-1">Bolão Copa</h2>
        <p className="text-muted mb-4">Entre para participar dos bolões da Copa</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-3 mb-0 text-center">
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
        <small className="text-muted d-block mt-3">
          Demo: admin@bolao.com / admin123 ou joao@bolao.com / usuario123
        </small>
      </div>
    </div>
  );
}

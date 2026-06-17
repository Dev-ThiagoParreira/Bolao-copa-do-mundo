import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showSuccess } = useNotification();

  const handleLogout = () => {
    logout();
    showSuccess('Logout realizado com sucesso');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#003c4b' }}>
        <div className="container-fluid page-container py-0">
          <Link className="navbar-brand fw-bold" to="/dashboard">
            Bolão Copa
          </Link>
          <div className="navbar-nav ms-auto gap-2 flex-row align-items-center">
            <NavLink className="nav-link" to="/dashboard">
              Dashboard
            </NavLink>
            <NavLink className="nav-link" to="/campanhas">
              Campanhas
            </NavLink>
            <NavLink className="nav-link" to="/apostas">
              {isAdmin ? 'Validar apostas' : 'Apostas'}
            </NavLink>
            <NavLink className="nav-link" to="/perfil">
              Perfil
            </NavLink>
            {isAdmin && (
              <>
            <NavLink className="nav-link" to="/admin/campanhas">
              Jogos
            </NavLink>
                <NavLink className="nav-link" to="/admin/usuarios">
                  Usuários
                </NavLink>
              </>
            )}
            <span className="nav-link text-white-50">{user?.nome}</span>
            <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}

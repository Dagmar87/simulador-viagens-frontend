import { NavLink, Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="brand-icon">↗</span>
          <span>
            <strong>Rota Brasil</strong>
            <small>Simulador de viagens</small>
          </span>
        </NavLink>

        <nav className="navigation">
          <NavLink to="/" end>
            Visão geral
          </NavLink>
          <NavLink to="/simular">Nova simulação</NavLink>
          <NavLink to="/historico">Histórico</NavLink>
          <NavLink to="/veiculos">Veículos</NavLink>
        </nav>

        <div className="sidebar-footer">Planeje sua próxima viagem.</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span>Planejamento rodoviário</span>
          <span className="status-indicator">API Django</span>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

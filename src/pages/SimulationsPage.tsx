import { useEffect, useState } from 'react';
import { deleteSimulation, getSimulations } from '../api/simulations';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import type { TripSimulation } from '../types/api';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';

export default function SimulationsPage() {
  const [items, setItems] = useState<TripSimulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      setItems(await getSimulations());
    } catch {
      setError('Não foi possível carregar o histórico de simulações.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm('Deseja excluir esta simulação?')) {
      return;
    }

    try {
      await deleteSimulation(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch {
      setError('Não foi possível excluir a simulação.');
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">REGISTROS</p>
          <h1>Histórico de simulações</h1>
          <p>Consulte as simulações registradas pelo backend.</p>
        </div>
        <button className="button button-secondary" onClick={() => void load()}>
          Atualizar
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => void load()} />}
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <div className="panel empty-state">Nenhuma simulação encontrada.</div>
      ) : (
        <div className="panel table-container">
          <table>
            <thead>
              <tr>
                <th>Origem</th>
                <th>Destino</th>
                <th>Distância</th>
                <th>Combustível</th>
                <th>Custo total</th>
                <th>Data</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.origin}</td>
                  <td>{item.destination}</td>
                  <td>{formatNumber(item.distance_km)} km</td>
                  <td>{formatCurrency(item.fuel_cost)}</td>
                  <td>
                    <strong>{formatCurrency(item.total_cost)}</strong>
                  </td>
                  <td>{formatDate(item.created_at)}</td>
                  <td>
                    <button
                      className="button button-danger"
                      onClick={() => void handleDelete(item.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

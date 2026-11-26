import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';
import { createSimulation } from '../api/simulations';
import { getVehicles } from '../api/vehicles';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import RouteMap from '../components/RouteMap';
import StatCard from '../components/StatCard';
import type { TripSimulation, Vehicle } from '../types/api';
import {
  formatCurrency,
  formatDuration,
  formatNumber,
} from '../utils/formatters';

export default function NewSimulationPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TripSimulation | null>(null);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [fuelPrice, setFuelPrice] = useState('6.20');
  const [averageSpeed, setAverageSpeed] = useState('80');
  const [roundTrip, setRoundTrip] = useState(false);

  async function loadVehicles() {
    setLoadingVehicles(true);
    setError('');

    try {
      const data = await getVehicles();
      setVehicles(data.filter((vehicle) => vehicle.active));

      if (data.length === 0) {
        setError('Cadastre um veículo antes de criar uma simulação.');
      }
    } catch {
      setError(
        'Não foi possível carregar os veículos. Verifique se o backend está funcionando.',
      );
    } finally {
      setLoadingVehicles(false);
    }
  }

  useEffect(() => {
    void loadVehicles();
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setResult(null);

    const price = Number(fuelPrice);
    const speed = Number(averageSpeed);
    const selectedVehicleId = Number(vehicleId);

    if (!origin.trim() || !destination.trim()) {
      setError('Informe a origem e o destino.');
      return;
    }

    if (!Number.isFinite(price) || price <= 0 || price > 20) {
      setError(
        'Informe um preço de combustível maior que zero e até R$ 20,00.',
      );
      return;
    }

    if (!Number.isFinite(speed) || speed <= 0 || speed > 200) {
      setError('Informe uma velocidade média maior que zero e até 200 km/h.');
      return;
    }

    if (!Number.isInteger(selectedVehicleId) || selectedVehicleId <= 0) {
      setError('Selecione um veículo válido.');
      return;
    }

    setSubmitting(true);

    try {
      const simulation = await createSimulation({
        origin: origin.trim(),
        destination: destination.trim(),
        vehicle_id: selectedVehicleId,
        fuel_price: price,
        average_speed_kmh: speed,
        round_trip: roundTrip,
      });

      setResult(simulation);
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { detail?: string } };
        message?: string;
      };

      setError(
        axiosError.response?.data?.detail ??
          axiosError.message ??
          'Não foi possível calcular a viagem.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PLANEJAMENTO</p>
          <h1>Nova simulação</h1>
          <p>Informe os dados para estimar o custo da sua viagem.</p>
        </div>
      </div>

      {loadingVehicles ? (
        <Loading />
      ) : (
        <form className="panel simulation-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Origem
              <input
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
                placeholder="Ex.: Recife, PE, Brasil"
                maxLength={255}
                required
              />
            </label>

            <label>
              Destino
              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="Ex.: Salvador, BA, Brasil"
                maxLength={255}
                required
              />
            </label>

            <label>
              Veículo
              <select
                value={vehicleId}
                onChange={(event) => setVehicleId(event.target.value)}
                required
              >
                <option value="">Selecione um veículo</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} —{' '}
                    {formatNumber(vehicle.consumption_km_per_liter)} km/L
                  </option>
                ))}
              </select>
            </label>

            <label>
              Preço do combustível (R$/L)
              <input
                type="number"
                min="0.01"
                max="20"
                step="0.01"
                value={fuelPrice}
                onChange={(event) => setFuelPrice(event.target.value)}
                required
              />
            </label>

            <label>
              Velocidade média (km/h)
              <input
                type="number"
                min="1"
                max="200"
                step="1"
                value={averageSpeed}
                onChange={(event) => setAverageSpeed(event.target.value)}
                required
              />
            </label>

            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={roundTrip}
                onChange={(event) => setRoundTrip(event.target.checked)}
              />
              Considerar ida e volta
            </label>
          </div>

          {error && <ErrorMessage message={error} onRetry={loadVehicles} />}

          <button
            type="submit"
            className="button button-primary"
            disabled={submitting || vehicles.length === 0}
          >
            {submitting ? 'Calculando rota...' : 'Calcular viagem'}
          </button>

          <p className="form-note">
            O cálculo depende da disponibilidade dos serviços externos de
            geocodificação e roteamento.
          </p>
        </form>
      )}

      {result && (
        <section className="result-section">
          <div className="page-heading">
            <div>
              <p className="eyebrow">RESULTADO</p>
              <h2>
                {result.origin} → {result.destination}
              </h2>
            </div>
          </div>

          <div className="stats-grid">
            <StatCard
              label="Distância"
              value={`${formatNumber(result.distance_km)} km`}
              description={result.round_trip ? 'Ida e volta' : 'Somente ida'}
            />
            <StatCard
              label="Combustível"
              value={`${formatNumber(result.fuel_liters)} L`}
            />
            <StatCard
              label="Custo do combustível"
              value={formatCurrency(result.fuel_cost)}
            />
            <StatCard
              label="Duração estimada"
              value={formatDuration(result.duration_minutes)}
            />
            <StatCard
              label="Pedágios"
              value={formatCurrency(result.toll_cost)}
              description="Valor informado pela API"
            />
            <StatCard
              label="Custo total"
              value={formatCurrency(result.total_cost)}
            />
          </div>

          <RouteMap geometry={result.route_geometry} />

          <button
            type="button"
            className="button button-secondary"
            onClick={() => window.print()}
          >
            Imprimir resultado
          </button>
        </section>
      )}
    </section>
  );
}

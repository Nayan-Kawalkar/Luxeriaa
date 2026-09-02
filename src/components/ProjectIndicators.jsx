import { VEHICLES } from '../data/vehicles.js';

/**
 * A stack of ticks down the right edge — one per car, the live one drawn long
 * and in the accent. A car still downloading shows a dimmed tick.
 */
export default function ProjectIndicators({ activeIndex, readyIds, onSelect, disabled }) {
  return (
    <nav className="indicators" aria-label="Projects" data-anim="chrome" data-cinematic-hide data-menu-hide>
      <ul className="indicators__list">
        {VEHICLES.map((vehicle, index) => {
          const active = index === activeIndex;
          const ready = readyIds.has(vehicle.id);
          return (
            <li key={vehicle.id}>
              <button
                type="button"
                className={`indicator${active ? ' is-active' : ''}${ready ? '' : ' is-pending'}`}
                onClick={() => onSelect(index)}
                aria-disabled={disabled || undefined}
                aria-current={active ? 'true' : undefined}
              >
                <span className="visually-hidden">
                  {`${vehicle.name}, project ${index + 1}`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

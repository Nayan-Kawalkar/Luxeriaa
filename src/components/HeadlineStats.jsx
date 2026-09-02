/**
 * The two figures the car is sold on, stacked at the bottom-left corner of the
 * composition. Value and unit share a baseline; the label sits under a rule, so
 * the pair reads as an instrument rather than a table.
 */
export default function HeadlineStats({ vehicle }) {
  return (
    <dl className="stats" data-anim="rail">
      {vehicle.headline.map((stat) => (
        <div className="stat" key={stat.label}>
          <dd className="stat__value">
            {stat.value}
            <span className="stat__unit">{stat.unit}</span>
          </dd>
          <dt className="stat__label">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}

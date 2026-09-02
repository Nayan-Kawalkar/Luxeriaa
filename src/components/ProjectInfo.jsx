/** The car's name, set large and centred, with its story alongside. */
export default function ProjectInfo({ vehicle }) {
  return (
    <section className="info" aria-labelledby="project-title" aria-live="polite">
      <h1 className="info__title" id="project-title" data-anim="info">
        {vehicle.name}
      </h1>
      <p className="info__body" data-anim="info">
        {vehicle.description}
      </p>
    </section>
  );
}

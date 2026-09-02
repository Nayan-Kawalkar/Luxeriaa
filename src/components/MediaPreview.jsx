/**
 * The preview card and the call to action.
 *
 * There is no photography for these cars, so the card carries a still lifted
 * from the scene itself the first time the car is staged — the same car the
 * hero is showing, at the moment it settled. Until that frame exists the card
 * holds its own place with the model number rather than collapsing the layout.
 *
 * Two controls, and they do different things: the play button on the card
 * hands the frame to the car itself — the interface clears and the camera takes
 * a slow pass around it — while "Explore" moves on to the next car.
 */
export default function MediaPreview({ vehicle, still, onPlay, onExplore, disabled }) {
  return (
    <div className="preview" data-anim="rail">
      <figure className="preview__card">
        {still ? (
          <img className="preview__image" src={still} alt={`${vehicle.name}, in the studio`} draggable="false" />
        ) : (
          <span className="preview__placeholder" aria-hidden="true">{vehicle.code}</span>
        )}

        <button type="button" className="preview__play" onClick={onPlay} disabled={disabled}>
          <span className="visually-hidden">{vehicle.mediaLabel}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M9 6.2 18.4 12 9 17.8Z" fill="currentColor" />
          </svg>
        </button>
      </figure>

      <button type="button" className="cta" onClick={onExplore} disabled={disabled}>
        <span>Explore</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

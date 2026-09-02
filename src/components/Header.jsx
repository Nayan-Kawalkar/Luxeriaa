import BrandMark from './BrandMark.jsx';

/**
 * Three marks on one line: the menu on the left, the marque centred, the
 * sections on the right. Nothing heavier — the top of the frame belongs to the
 * model number behind the car.
 */
const SECTIONS = ['Models', 'Racing', 'Features'];

export default function Header({ menuOpen, onMenuToggle, onHome }) {
  return (
    <header className="header" data-cinematic-hide>
      <button
        type="button"
        className={`menu-button${menuOpen ? ' is-open' : ''}`}
        data-anim="chrome"
        onClick={onMenuToggle}
        aria-expanded={menuOpen}
        aria-controls="menu-overlay"
      >
        <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        <span className="menu-button__lines" aria-hidden="true">
          <i /><i /><i />
        </span>
      </button>

      <a
        className="header__brand"
        href="#/"
        aria-label="Luxeria — first car"
        data-anim="chrome"
        onClick={(event) => {
          event.preventDefault();
          onHome?.();
        }}
      >
        <BrandMark className="header__brand-mark" />
        <span className="header__brand-name">Luxeria</span>
      </a>

      <nav className="header__sections" data-anim="chrome" data-menu-hide>
        {SECTIONS.map((section) => (
          <a className="header__section-link" href="#/" key={section} onClick={(e) => e.preventDefault()}>
            {section}
          </a>
        ))}
      </nav>
    </header>
  );
}

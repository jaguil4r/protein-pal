import './Header.css';

interface Props {
  onSettingsClick: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

export function Header({ onSettingsClick, darkMode, onToggleDark }: Props) {
  return (
    <header className="header">
      <h1 className="header__title">{darkMode ? 'Brotein Pal' : 'Protein Pal'}</h1>
      <div className="header__actions">
        <button
          className="header__btn"
          onClick={onToggleDark}
          data-testid="dark-mode-toggle"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to brotein mode'}
        >
          {darkMode ? (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm0 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm9-9a1 1 0 010 2h-1a1 1 0 110-2h1zM5 11a1 1 0 010 2H4a1 1 0 110-2h1zm14.07-6.07a1 1 0 010 1.41l-.71.71a1 1 0 11-1.41-1.41l.71-.71a1 1 0 011.41 0zM7.05 17.66a1 1 0 010 1.41l-.71.71a1 1 0 11-1.41-1.41l.71-.71a1 1 0 011.41 0zm11.9 0a1 1 0 01-1.41 1.41l-.71-.71a1 1 0 011.41-1.41l.71.71zM7.05 6.34a1 1 0 01-1.41 0l-.71-.71A1 1 0 016.34 4.22l.71.71a1 1 0 010 1.41zM12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
            </svg>
          )}
        </button>
        <button
          className="header__btn"
          onClick={onSettingsClick}
          data-testid="settings-button"
          aria-label="Open settings"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 3.12a.49.49 0 00-.48-.41h-3.84a.49.49 0 00-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.72 9.81a.49.49 0 00.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z" />
          </svg>
        </button>
      </div>
    </header>
  );
}

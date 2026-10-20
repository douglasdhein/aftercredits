export function Footer() {
  return (
    <footer className="mt-10 border-t border-(--border) bg-(--header-background) transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-6">
        <p className="text-center text-sm text-(--text-secondary)">
          © {new Date().getFullYear()}{' '}
          <a
            href="https://douglasdhein.dev"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-(--text-primary)"
          >
            Douglas Dhein
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}

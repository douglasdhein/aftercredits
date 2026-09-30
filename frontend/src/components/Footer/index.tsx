export function Footer() {
  return (
    <footer className="mt-10 border-t border-[#242124] bg-[#121012]">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-6">
        <p className="text-center text-sm text-[#99949C]">
          © {new Date().getFullYear()}{' '}
          <a
            href="https://douglasdhein.dev"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[#F2EEF0] transition-colors hover:text-[#D6A640]"
          >
            Douglas Dhein
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}

import { Link, useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
      <div className="max-w-md space-y-5">
        <p className="font-heading text-7xl text-muted-foreground/50">404</p>
        <h1 className="font-heading text-2xl text-foreground">Página não encontrada</h1>
        <p className="text-muted-foreground">
          O endereço “{location.pathname}” não corresponde a uma página deste aplicativo.
        </p>
        <Link to="/" className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground hover:bg-muted">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}

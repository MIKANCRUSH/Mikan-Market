import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-black text-white font-[Inter]">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen">

      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-black border-r border-white/10 p-6 hidden md:block">

        {/* Logo + Title */}
        <div className="flex items-center gap-3 mb-10">
          <img
            src="https://e7.pngegg.com/pngimages/329/550/png-clipart-black-market-black-and-white-hummus-white-text.png"
            alt="Logo"
            className="w-18 h-18 object-contain invert"
          />
          <h1 className="text-2xl font-bold tracking-wide">
            Mikan Market
          </h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition font-medium ${
                isActive
                  ? "bg-white text-black"
                  : "text-white hover:bg-white hover:text-black"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition font-medium ${
                isActive
                  ? "bg-white text-black"
                  : "text-white hover:bg-white hover:text-black"
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/sales"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition font-medium ${
                isActive
                  ? "bg-white text-black"
                  : "text-white hover:bg-white hover:text-black"
              }`
            }
          >
            Sales
          </NavLink>

        </nav>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="flex-1 p-6 md:p-10 bg-black">
        <Outlet />
      </main>

    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">{message}</h1>
      <p className="text-gray-400 mb-6">{details}</p>
      {stack && (
        <pre className="w-full max-w-2xl p-4 bg-gray-900 rounded-lg overflow-x-auto text-left text-sm">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
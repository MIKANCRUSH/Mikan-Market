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
import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black">

      {/* ================= Mobile Header ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img
            src="https://e7.pngegg.com/pngimages/329/550/png-clipart-black-market-black-and-white-hummus-white-text.png"
            alt="Logo"
            className="w-8 h-8 invert"
          />
          <span className="font-bold text-lg">Mikan Market</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-xl"
        >
          ☰
        </button>
      </div>

      {/* ================= Sidebar ================= */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-black border-r border-white/10 p-6 transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Logo Desktop */}
        <div className="hidden md:flex items-center gap-3 mb-10">
          <img
            src="https://e7.pngegg.com/pngimages/329/550/png-clipart-black-market-black-and-white-hummus-white-text.png"
            alt="Logo"
            className="w-10 h-10 invert"
          />
          <h1 className="text-2xl font-bold tracking-wide">
            Mikan Market
          </h1>
        </div>

        <nav className="space-y-3 mt-10 md:mt-0">

          <NavLink
            to="/"
            end
            onClick={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
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

      {/* ================= Overlay Mobile ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= Main Content ================= */}
      <main className="flex-1 p-6 md:p-10 bg-black w-full pt-20 md:pt-10">
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
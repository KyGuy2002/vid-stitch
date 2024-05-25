import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css?url";
import Header from "./components/Header/Header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href={stylesheet} />
        <link rel="icon" href="logo.svg" />
        <Meta />
        <Links />
      </head>
      <body className="p-2 pb-5 min-h-dvh">
      
        <Header/>

        <div className="max-w-xl mx-auto mt-8">
          {children}
        </div>

        <p className="text-center mt-5 text-gray-500 text-sm">Created by <a className="underline" href="https://github.com/KyGuy2002" target="_blank">IEatBeans</a></p>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

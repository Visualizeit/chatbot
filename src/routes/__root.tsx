import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

import mantineTheme from "@/configs/mantine-theme";

import appCSSURL from "@/app.css?url";

const Component = () => (
  <html lang="en" {...mantineHtmlProps}>
    <head>
      <HeadContent />
      <ColorSchemeScript />
    </head>
    <body>
      <MantineProvider theme={mantineTheme}>
        <Outlet />
      </MantineProvider>
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "chatbot",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/vite.svg" },
      { rel: "stylesheet", href: appCSSURL },
    ],
  }),
  component: Component,
});

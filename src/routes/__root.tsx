import {
    ColorSchemeScript,
    MantineProvider,
    mantineHtmlProps,
    v8CssVariablesResolver,
} from '@mantine/core'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'

import mantineTheme from '@/configs/mantine-theme'

import appCSSURL from '@/app.css?url'

const Component = () => (
    <html lang="en" {...mantineHtmlProps}>
        <head>
            <HeadContent />
            <ColorSchemeScript />
        </head>
        <body>
            <MantineProvider cssVariablesResolver={v8CssVariablesResolver} theme={mantineTheme}>
                <Outlet />
            </MantineProvider>
            <Scripts />
        </body>
    </html>
)

export const Route = createRootRoute({
    component: Component,
    head: () => ({
        links: [
            {
                href: '/vite.svg',
                rel: 'icon',
                type: 'image/svg+xml',
            },
            {
                href: appCSSURL,
                rel: 'stylesheet',
            },
        ],
        meta: [
            {
                charSet: 'utf8',
            },
            {
                content: 'width=device-width, initial-scale=1',
                name: 'viewport',
            },
            {
                title: 'Chatbot',
            },
        ],
    }),
})

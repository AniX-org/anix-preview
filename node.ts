import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import app from "./src/index.tsx"

app.use(`/static/*`, serveStatic({ root: './' }))
serve({
  fetch: app.fetch,
  port: process.env.PORT ? Number(process.env.PORT) : 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
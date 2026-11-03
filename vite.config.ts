import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-only: serves the Vercel function api/chat.ts at /api/chat so `npm run dev` behaves like production.
function devApiChat(): Plugin {
  return {
    name: 'dev-api-chat',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      for (const key of ['BASE_URL', 'API_KEY', 'MODEL']) {
        if (env[key] && !process.env[key]) process.env[key] = env[key];
      }

      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          (req as any).body = Buffer.concat(chunks).toString();
          const mod = await server.ssrLoadModule('/api/chat.ts');
          await mod.default(req, res);
        } catch (err) {
          server.config.logger.error(String(err));
          res.statusCode = 500;
          res.end('Internal error');
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), devApiChat()],
  server: {
    port: 3000,
    open: true
  }
});

import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function bootstrap() {
  await connectDB();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});

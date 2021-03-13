import { Application } from "https://deno.land/x/oak/mod.ts";

import todosRoutes from './routes/todos.ts';
import { connect } from './helpers/db_client.ts'
connect()

const app = new Application();

app.use(async (ctx, next) => {
  console.log('Middleware!');
  await next();
});

app.use(async (ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', '*') // эта настройка для того, чтоб определить какие 
  // домены мы разрешаем подключать к ресурсам (в данном случае - "*", - означает, что любые домены)

  ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE') // эта настройка для того, чтоб работали 
  // соответствующие методы запросов на сервер

  ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type') // эта настройка определяет, какие хедеры могут быть на фронте

  await next()
})

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 8000 });

// deno run --allow-net --unstable --allow-read --allow-write --allow-plugin app.ts
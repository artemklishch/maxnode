import { Router } from 'https://deno.land/x/oak/mod.ts';
import { ObjectId } from "https://deno.land/x/mongo@v0.22.0/mod.ts"
import { getDb } from '../helpers/db_client.ts'

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

let todos: Todo[] = [];

router.get('/todos', async (ctx) => {
  const todos = await getDb().collection('denotodos').find()
  const transformedTodos = todos.map((todo: { _id: ObjectId; text: string })  => {
    return { id: todo._id.$oid, text: todo.text } // трансформируем массив, данных, 
    // так как айдишник имеет не тот формат, что нам нужен 
    // метод $oid - предоставлен MongoDB
  })
  ctx.response.body = { todos: transformedTodos };
});

router.post('/todos', async (ctx) => {
  // const data = await ctx.request.body(); // так не работает
  const { value } = ctx.request.body({ type: 'json' });
  const { text } = await value;
  const newTodo: Todo = {
    text: text
  };
  const id = await getDb().collection('denotodos').insertOne(newTodo)
  newTodo.id = id.$oid // достаем и переформатируем айдишник, и присваиваем новое свойство в объект
  ctx.response.body = { message: 'Created todo!', todo: newTodo };
});

router.put('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId;
  // const data = await ctx.request.body(); // так не работает
  const { value } = ctx.request.body({ type: 'json' });
  const { text } = await value;
  const todoIndex = todos.findIndex((todo) => {
    return todo.id === tid;
  });
  todos[todoIndex] = { id: todos[todoIndex].id, text: text };
  ctx.response.body = { message: 'Updated todo' };
});

router.delete('/todos/:todoId', (ctx) => {
  const tid = ctx.params.todoId;
  todos = todos.filter((todo) => todo.id !== tid);
  ctx.response.body = { message: 'Deleted todo' };
});

export default router;

import Database from "@tauri-apps/plugin-sql";
import { GameItem } from "@chron/lib/game";
import { TaskItem } from "@chron/lib/task";

async function loadDb(): Promise<Database> {
  return Database.load("sqlite:chron.db");
}

export async function getAllGames(): Promise<GameItem[]> {
  const db = await loadDb();

  return db.select<GameItem[]>("SELECT * FROM `games`");
}

export async function getTasksByGameId(gameId: string): Promise<TaskItem[]> {
  const db = await loadDb();

  return db.select<TaskItem[]>("SELECT * FROM `tasks` WHERE `gameId` = $1", [
    gameId,
  ]);
}

export async function createGame(game: GameItem): Promise<void> {
  const db = await loadDb();

  await db.execute(
    "INSERT INTO `games` (`id`, `title`, `dailyHour`, `dailyMinute`, `weeklyDay`, `order`, `open`) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [
      game.id,
      game.title,
      game.dailyHour,
      game.dailyMinute,
      game.weeklyDay,
      game.order,
      game.open,
    ]
  );
}

export async function deleteGame(gameId: string): Promise<void> {
  const db = await loadDb();

  await db.execute("DELETE FROM `games` WHERE `id` = $1", [gameId]);
}

export async function updateGameOrder(
  gameId: string,
  order: number
): Promise<void> {
  const db = await loadDb();

  await db.execute("UPDATE `games` SET `order` = $1 WHERE `id` = $2", [
    order,
    gameId,
  ]);
}

export async function updateGameOpenState(
  gameId: string,
  open: boolean
): Promise<void> {
  const db = await loadDb();

  await db.execute("UPDATE `games` SET `open` = $1 WHERE `id` = $2", [
    open ? 1 : 0,
    gameId,
  ]);
}

export async function createTask(
  task: Omit<TaskItem, "done" | "nextReset">,
  gameId: string
): Promise<void> {
  const db = await loadDb();

  await db.execute(
    "INSERT INTO `tasks` (`id`, `gameId`, `title`, `type`, `description`, `order`) VALUES ($1, $2, $3, $4, $5, $6)",
    [task.id, gameId, task.title, task.type, task.description, task.order]
  );
}

export async function deleteTask(taskId: string): Promise<void> {
  const db = await loadDb();

  await db.execute("DELETE FROM `tasks` WHERE `id` = $1", [taskId]);
}

export async function updateTaskOrder(
  taskId: string,
  order: number
): Promise<void> {
  const db = await loadDb();

  await db.execute("UPDATE `tasks` SET `order` = $1 WHERE `id` = $2", [
    order,
    taskId,
  ]);
}

export async function updateTaskDone(
  taskId: string,
  done: boolean,
  nextReset: Date | null
): Promise<void> {
  const db = await loadDb();

  await db.execute(
    "UPDATE `tasks` SET `done` = $1, `nextReset` = $2 WHERE `id` = $3",
    [done ? 1 : 0, nextReset?.getTime(), taskId]
  );
}

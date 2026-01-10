"use client";

import Game from "@chron/components/chron/game";
import { useCallback, useEffect, useState } from "react";
import { GameItem } from "@chron/lib/game";
import { v4 } from "uuid";
import { GameDialog } from "@chron/components/chron/add-game";
import { Spinner } from "@chron/components/ui/spinner";
import {
  getAllGames,
  createGame,
  deleteGame,
  updateGameOrder,
} from "@chron/lib/database";
import { error } from "@tauri-apps/plugin-log";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<GameItem[]>([]);

  const reorderGames = useCallback((a: GameItem[]) => {
    return a.map<GameItem>((item, i) => ({ ...item, order: i }));
  }, []);

  const addGame = useCallback(
    (
      title: string,
      dailyHour: number,
      dailyMinute: number,
      weeklyDay: number
    ) => {
      const newItem: GameItem = {
        id: v4(),
        order: (games[games.length - 1]?.order ?? 0) + 1,
        title,
        dailyHour,
        dailyMinute,
        weeklyDay,
        closed: false,
      };

      setGames((prev) => prev.concat([newItem]));

      createGame(newItem).catch(error);
    },
    [games]
  );

  const removeGame = useCallback(
    (id: string) => {
      const newGames = reorderGames(games.filter((game) => game.id !== id));
      setGames(newGames);

      deleteGame(id)
        .then(() =>
          Promise.all(
            newGames.map(async (game, i) => updateGameOrder(game.id, i))
          )
        )
        .catch(error);
    },
    [games, reorderGames]
  );

  useEffect(() => {
    getAllGames()
      .then((games) => setGames(games))
      .catch(error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="flex fex-row place-content-end px-7">
        <GameDialog addGame={addGame} />
      </div>
      <div className="flex flex-col gap-4 px-7 w-full"></div>
      {games.map((game, i) => (
        <Game key={`game-${i}`} game={game} deleteGame={removeGame} />
      ))}
    </>
  );
}

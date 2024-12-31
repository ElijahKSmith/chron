"use client";

import Game from "@chron/components/chron/game";
import { TimerProvider } from "@chron/components/chron/timer-context";
import { useCallback, useState } from "react";
import { GameItem } from "@chron/lib/game";
import { v4 } from "uuid";
import { GameDialog } from "@chron/components/chron/add-game";

export default function Dashboard() {
  const [games, setGames] = useState<GameItem[]>([
    {
      id: v4(),
      order: 0,
      title: "Example Game",
      dailyHour: 0,
      dailyMinute: 0,
      weeklyDay: 0,
    },
    {
      id: v4(),
      order: 1,
      title: "Example Game",
      dailyHour: 0,
      dailyMinute: 0,
      weeklyDay: 0,
    },
  ]);

  const reorderItems = useCallback((a: GameItem[]) => {
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
      };

      setGames((prev) => prev.concat([newItem]));
    },
    [games]
  );

  const deleteGame = useCallback(
    (id: string) => {
      setGames((prev) => reorderItems(prev.filter((game) => game.id !== id)));
    },
    [reorderItems]
  );

  return (
    <>
      <div className="flex fex-row place-content-end px-7">
        <GameDialog addGame={addGame} />
      </div>
      <TimerProvider className="flex flex-col gap-4 px-7 w-full">
        {games.map((game, i) => (
          <Game key={`game-${i}`} game={game} deleteGame={deleteGame} />
        ))}
      </TimerProvider>
    </>
  );
}

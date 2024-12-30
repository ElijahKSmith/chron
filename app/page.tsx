"use client";

import Game from "@chron/components/chron/game";
import { SidebarTrigger } from "@chron/components/ui/sidebar";

export default function Dashboard() {
  const games = [
    { title: "Example Game", dailyTime: "00:00:00.000Z", weeklyDay: 0 },
    { title: "Example Game", dailyTime: "00:00:00.000Z", weeklyDay: 0 },
  ];

  return (
    <>
      <SidebarTrigger />
      <div className="flex flex-col gap-4 p-7 w-full">
        {games.map((game, i) => (
          <Game
            key={`game-${i}`}
            title={game.title}
            dailyTime={game.dailyTime}
            weeklyDay={game.weeklyDay}
          />
        ))}
      </div>
    </>
  );
}

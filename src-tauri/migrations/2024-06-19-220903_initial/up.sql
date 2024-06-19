-- games definition
CREATE TABLE
  games (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    dailyResetTime INTEGER NOT NULL,
    weeklyResetDay TEXT,
    deletedAt INTEGER
  );

CREATE TABLE
  tasks (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    gameId INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    completedTime INTEGER,
    nextReset INTEGER,
    deletedAt INTEGER,
    CONSTRAINT tasks_games_FK FOREIGN KEY (gameId) REFERENCES games (id)
  );
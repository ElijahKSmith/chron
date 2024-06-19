-- games definition
CREATE TABLE
  games (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    dailyResetTime VARCHAR(5) NOT NULL,
    weeklyResetDay VARCHAR(9),
    deletedAt TIMESTAMP
  );

CREATE TABLE
  tasks (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    gameId INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    resetType VARCHAR(6) NOT NULL,
    completedTime TIMESTAMP,
    nextReset TIMESTAMP,
    deletedAt TIMESTAMP,
    CONSTRAINT tasks_games_FK FOREIGN KEY (gameId) REFERENCES games (id)
  );
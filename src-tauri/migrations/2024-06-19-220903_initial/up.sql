-- games definition
CREATE TABLE
  games (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    daily_reset_time VARCHAR(5) NOT NULL,
    weekly_reset_day VARCHAR(9),
    deleted_at TIMESTAMP
  );

CREATE TABLE
  tasks (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    reset_type VARCHAR(6) NOT NULL,
    completed_time TIMESTAMP,
    next_reset TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT tasks_games_FK FOREIGN KEY (game_id) REFERENCES games (id)
  );
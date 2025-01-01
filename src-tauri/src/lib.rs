use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "Create base database",
        sql: "CREATE TABLE IF NOT EXISTS games (
                  id TEXT(36) NOT NULL,
                  title TEXT NOT NULL,
                  dailyHour INTEGER DEFAULT (0) NOT NULL,
                  dailyMinute INTEGER DEFAULT (0) NOT NULL,
                  weeklyDay INTEGER DEFAULT (0) NOT NULL,
                  \"order\" INTEGER DEFAULT (0) NOT NULL,
                  CONSTRAINT games_pk PRIMARY KEY (id)
              );
              CREATE TABLE tasks (
                  id TEXT(36) NOT NULL,
                  gameId TEXT(36) NOT NULL,
                  title TEXT NOT NULL,
                  \"type\" TEXT DEFAULT ('daily') NOT NULL,
                  description TEXT NOT NULL,
                  done INTEGER DEFAULT (0) NOT NULL,
                  nextReset INTEGER,
                  \"order\" INTEGER DEFAULT (0) NOT NULL,
                  CONSTRAINT tasks_pk PRIMARY KEY (id),
                  CONSTRAINT tasks_games_FK FOREIGN KEY (gameId) REFERENCES games(id) ON DELETE CASCADE
              );",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:chron.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

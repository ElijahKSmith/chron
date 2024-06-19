use crate::schema::games;
use chrono::NaiveDateTime;
use diesel::{Insertable, Queryable};
use serde::Serialize;

#[derive(Queryable, Serialize)]
pub struct Game {
    pub id: i32,
    pub name: String,
    pub dailyResetTime: String,
    pub weeklyResetDay: Option<String>,
    pub deletedAt: Option<NaiveDateTime>,
}

#[derive(Insertable)]
#[diesel(table_name = games)]
pub struct NewGame {
    pub id: i32,
    pub name: String,
    pub dailyResetTime: String,
    pub weeklyResetDay: String,
}

impl From<NewGame> for Game {
    fn from(new_game: NewGame) -> Self {
        Game {
            id: new_game.id,
            name: new_game.name,
            dailyResetTime: new_game.dailyResetTime,
            weeklyResetDay: Some(new_game.weeklyResetDay),
            deletedAt: None,
        }
    }
}

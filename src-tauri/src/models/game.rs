use crate::schema::games;
use chrono::NaiveDateTime;
use diesel::{Insertable, Queryable};
use serde::Serialize;

#[derive(Queryable, Serialize)]
pub struct Game {
    pub id: i32,
    pub name: String,
    pub daily_reset_time: String,
    pub weekly_reset_day: Option<String>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Insertable)]
#[diesel(table_name = games)]
pub struct NewGame {
    pub id: i32,
    pub name: String,
    pub daily_reset_time: String,
    pub weekly_reset_day: String,
}

impl From<NewGame> for Game {
    fn from(new_game: NewGame) -> Self {
        Game {
            id: new_game.id,
            name: new_game.name,
            daily_reset_time: new_game.daily_reset_time,
            weekly_reset_day: Some(new_game.weekly_reset_day),
            deleted_at: None,
        }
    }
}

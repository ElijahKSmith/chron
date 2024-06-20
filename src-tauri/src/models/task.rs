use crate::models::game::Game;
use crate::schema::tasks;
use chrono::NaiveDateTime;
use diesel::{Associations, Insertable, Queryable, Selectable};
use serde::Serialize;

#[derive(Associations, Queryable, Selectable, Serialize)]
#[diesel(belongs_to(Game))]
pub struct Task {
    pub id: i32,
    pub game_id: i32,
    pub name: String,
    pub reset_type: String,
    pub completed_time: Option<NaiveDateTime>,
    pub next_reset: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Insertable)]
#[diesel(table_name = tasks)]
pub struct NewTask {
    pub id: i32,
    pub game_id: i32,
    pub name: String,
    pub reset_type: String,
    pub completed_time: NaiveDateTime,
    pub next_reset: NaiveDateTime,
}

impl From<NewTask> for Task {
    fn from(new_task: NewTask) -> Self {
        Task {
            id: new_task.id,
            game_id: new_task.game_id,
            name: new_task.name,
            reset_type: new_task.reset_type,
            completed_time: Some(new_task.completed_time),
            next_reset: Some(new_task.next_reset),
            deleted_at: None,
        }
    }
}

#[derive(Serialize)]
pub struct GameWithTasks {
    #[serde(flatten)]
    pub game: Game,
    pub tasks: Vec<Task>,
}

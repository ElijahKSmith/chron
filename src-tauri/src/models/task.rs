use crate::schema::tasks;
use chrono::NaiveDateTime;
use diesel::{Insertable, Queryable};
use serde::Serialize;

#[derive(Queryable, Serialize)]
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
            game_id: new_task.gameId,
            name: new_task.name,
            reset_type: new_task.resetType,
            completed_time: Some(new_task.completedTime),
            next_reset: Some(new_task.nextReset),
            deleted_at: None,
        }
    }
}

use crate::schema::tasks;
use chrono::NaiveDateTime;
use diesel::{Insertable, Queryable};
use serde::Serialize;

#[derive(Queryable, Serialize)]
pub struct Task {
    pub id: i32,
    pub gameId: i32,
    pub name: String,
    pub resetType: String,
    pub completedTime: Option<NaiveDateTime>,
    pub nextReset: Option<NaiveDateTime>,
    pub deletedAt: Option<NaiveDateTime>,
}

#[derive(Insertable)]
#[diesel(table_name = tasks)]
pub struct NewTask {
    pub id: i32,
    pub gameId: i32,
    pub name: String,
    pub resetType: String,
    pub completedTime: NaiveDateTime,
    pub nextReset: NaiveDateTime,
}

impl From<NewTask> for Task {
    fn from(new_task: NewTask) -> Self {
        Task {
            id: new_task.id,
            gameId: new_task.gameId,
            name: new_task.name,
            resetType: new_task.resetType,
            completedTime: Some(new_task.completedTime),
            nextReset: Some(new_task.nextReset),
            deletedAt: None,
        }
    }
}

use crate::{
    db::establish_db_connection,
    models::task::{GameWithTasks, NewTask, Task},
    schema::tasks,
    schema::tasks::dsl,
    services::games_service,
};
use chrono::Utc;
use diesel::prelude::*;

pub fn get_games_and_tasks() -> Vec<GameWithTasks> {
    let games = games_service::get_games();

    let connection = &mut establish_db_connection();

    Task::belonging_to(&games)
        .select(Task::as_select())
        .filter(dsl::deleted_at.is_null())
        .load(connection)
        .expect("Error loading tasks")
        .grouped_by(&games)
        .into_iter()
        .zip(games)
        .map(|(tasks, game)| GameWithTasks { game, tasks })
        .collect::<Vec<GameWithTasks>>()
}

pub fn get_tasks_by_game(game_id: &i32) -> Vec<Task> {
    let connection = &mut establish_db_connection();

    dsl::tasks
        .filter(dsl::game_id.eq(game_id))
        .order_by(dsl::id.asc())
        .load::<Task>(connection)
        .expect("Error loading tasks")
}

pub fn create_task(new_task: &NewTask) {
    let connection = &mut establish_db_connection();

    diesel::insert_into(tasks::table)
        .values(new_task)
        .execute(connection)
        .expect("Error saving new task");
}

pub fn delete_task(task_id: &i32) {
    let connection = &mut establish_db_connection();

    diesel::update(dsl::tasks)
        .filter(dsl::id.eq(task_id))
        .set(dsl::deleted_at.eq(Some(Utc::now().naive_local())))
        .execute(connection)
        .expect("Error deleting task");
}

pub fn delete_tasks_by_game(game_id: &i32) {
    let connection = &mut establish_db_connection();

    diesel::update(dsl::tasks)
        .filter(dsl::game_id.eq(game_id))
        .set(dsl::deleted_at.eq(Some(Utc::now().naive_local())))
        .execute(connection)
        .expect("Error deleting tasks");
}

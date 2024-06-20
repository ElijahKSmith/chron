use crate::{
    db::establish_db_connection,
    models::game::{Game, NewGame},
    schema::games,
    schema::games::dsl,
};
use chrono::Utc;
use diesel::prelude::*;

pub fn get_games() -> Vec<Game> {
    let connection = &mut establish_db_connection();

    dsl::games
        .filter(dsl::deleted_at.is_null())
        .order_by(dsl::id.asc())
        .load::<Game>(connection)
        .expect("Error loading games")
}

pub fn create_game(new_game: &NewGame) {
    let connection = &mut establish_db_connection();

    diesel::insert_into(games::table)
        .values(new_game)
        .execute(connection)
        .expect("Error saving new game");
}

pub fn delete_game(game_id: &i32) {
    let connection = &mut establish_db_connection();

    diesel::update(dsl::games)
        .filter(dsl::id.eq(game_id))
        .set(dsl::deleted_at.eq(Some(Utc::now().naive_local())))
        .execute(connection)
        .expect("Error deleting game");
}

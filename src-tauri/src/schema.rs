// @generated automatically by Diesel CLI.

diesel::table! {
    games (id) {
        id -> Integer,
        name -> Text,
        daily_reset_time -> Text,
        weekly_reset_day -> Nullable<Text>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    tasks (id) {
        id -> Integer,
        game_id -> Integer,
        name -> Text,
        reset_type -> Text,
        completed_time -> Nullable<Timestamp>,
        next_reset -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::joinable!(tasks -> games (game_id));

diesel::allow_tables_to_appear_in_same_query!(
    games,
    tasks,
);

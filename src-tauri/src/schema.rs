// @generated automatically by Diesel CLI.

diesel::table! {
    games (id) {
        id -> Integer,
        name -> Text,
        dailyResetTime -> Text,
        weeklyResetDay -> Nullable<Text>,
        deletedAt -> Nullable<Timestamp>,
    }
}

diesel::table! {
    tasks (id) {
        id -> Integer,
        gameId -> Integer,
        name -> Text,
        resetType -> Text,
        completedTime -> Nullable<Timestamp>,
        nextReset -> Nullable<Timestamp>,
        deletedAt -> Nullable<Timestamp>,
    }
}

diesel::joinable!(tasks -> games (gameId));

diesel::allow_tables_to_appear_in_same_query!(
    games,
    tasks,
);

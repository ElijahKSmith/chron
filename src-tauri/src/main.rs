// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;

use tauri::{Manager, Window};

#[tauri::command]
async fn close_splashscreen(window: Window) {
  window.get_window("splashscreen").expect("no window labeled 'splashscreen' found").close().unwrap();
  window.get_window("main").expect("no window labeled 'main' found").show().unwrap();
}


fn main() {
  tauri::Builder::default()
    .setup(|app| {
      db::init();

      // https://github.com/tauri-apps/tauri/discussions/6384#discussioncomment-5418794
      #[cfg(dev)]
      {
        let main = app.get_window("main").unwrap();
        let splash = app.get_window("splashscreen").unwrap();
        let _ = main.show();
        _ = splash.close();
      }

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![close_splashscreen])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

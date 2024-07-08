// use tauri::{Window};

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Manager, Window};
#[tauri::command]
fn set_window_always_on_top(window: Window, always_on_top: bool) {
    window.set_always_on_top(always_on_top).unwrap();
}


fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .plugin(
            tauri_plugin_sql::Builder::default().build(),
        )
        .invoke_handler(tauri::generate_handler![set_window_always_on_top])
        .run(tauri::generate_context!())
        .expect("error while running pinote application");
}

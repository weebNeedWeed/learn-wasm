use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// extern "C" {
//     #[wasm_bindgen(js_namespace=console, js_name=log)]
//     fn log(s: &str);
// }

// macro_rules! console_log {
//     ($($t:tt)*) => {
//         log(&format_args!($($t)*).to_string())
//     };
// }

// macro_rules! log_sys {
//     ($($t:tt)*) => (console::log_1(&format_args!($($t)*).to_string().into()))
// }

// #[wasm_bindgen(start)]
// fn start() {
//     log_sys!("hello {}", "world")
// }

// #[wasm_bindgen(module = "/defined-in-js.js")]
// extern "C" {
//     fn name() -> String;

//     type MyClass;

//     #[wasm_bindgen(constructor)]
//     fn new() -> MyClass;

//     #[wasm_bindgen(method, getter)]
//     fn number(this: &MyClass) -> u32;
//     #[wasm_bindgen(method, setter)]
//     fn set_number(this: &MyClass, u: u32);
//     #[wasm_bindgen(method)]
//     fn render(this: &MyClass) -> String;
// }

// #[wasm_bindgen]
// extern "C" {
//     #[wasm_bindgen(js_namespace=console)]
//     fn log(s: &str);
// }

// #[wasm_bindgen(start)]
// fn start() {
//     log(&name());

//     let x = MyClass::new();
//     assert_eq!(x.number(), 42);
//     x.set_number(10);
//     log(&x.render());
// }

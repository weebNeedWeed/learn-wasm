#![allow(unused_variables)]
#![allow(dead_code)]

use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_namespace=console)]
extern "C" {
    fn log(s: &str);
}

#[derive(Debug)]
#[wasm_bindgen]
struct Counter {
    key: char,
    count: i32,
}

#[wasm_bindgen]
impl Counter {
    pub fn default() -> Counter {
        log("Counter::default");
        Counter::new('a', 0)
    }

    pub fn new(key: char, count: i32) -> Counter {
        log(&format!("Counter::new({}, {})", key, count));
        Counter { key, count }
    }

    pub fn key(&self) -> char {
        log("Counter.key()");
        self.key
    }

    pub fn count(&self) -> i32 {
        log("Counter.count");
        self.count
    }

    pub fn increment(&mut self) {
        log("Counter.increment");
        self.count += 1;
    }

    pub fn update_key(&mut self, key: char) {
        self.key = key;
    }
}

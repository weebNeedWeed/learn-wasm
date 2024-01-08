#![cfg(test)]

use crate::Universe;
use wasm_bindgen_test::wasm_bindgen_test;
use wasm_bindgen_test::wasm_bindgen_test_configure;

wasm_bindgen_test_configure!(run_in_browser);

fn prepare() -> Universe {
    let mut universe = Universe::new();
    universe.set_height(5);
    universe.set_width(5);
    universe.set_cells(&[(2, 1), (3, 2), (1, 3), (2, 3), (3, 3)]);

    universe
}

fn expected() -> Universe {
    let mut universe = Universe::new();
    universe.set_height(5);
    universe.set_width(5);
    universe.set_cells(&[(1, 2), (3, 2), (2, 3), (3, 3), (2, 4)]);

    universe
}

#[wasm_bindgen_test]
fn test() {
    let mut pre = prepare();
    pre.tick();
    let exp = expected();
    assert_eq!(pre.get_cells(), exp.get_cells());
}

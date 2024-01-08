use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
fn start() -> Result<(), JsValue> {
    let window = web_sys::window().expect("No window here");
    let document = window.document().expect("No document here");
    let body = document.body().expect("No body here");

    let new_el = document.create_element("p")?;
    new_el.set_text_content(Some("hello"));

    body.append_child(&new_el)?;

    Ok(())
}

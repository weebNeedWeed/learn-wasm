use wasm_bindgen::prelude::*;
use web_sys::js_sys::{Array, Date};
use web_sys::{Document, Element, HtmlElement, Window};

mod utils;

#[wasm_bindgen(start)]
pub fn run() -> Result<(), JsValue> {
    utils::set_panic_hook();
    let window = web_sys::window().expect("Should have window");
    let document = window
        .document()
        .expect("Should have document inside window");

    let array = Array::new();
    array.push(&"hello".into());
    array.push(&1.into());

    let mut first = None;
    array.for_each(&mut |obj, idx, _| match idx {
        0 => {
            assert_eq!(obj, "hello");
            first = obj.as_string();
        }
        1 => {
            assert_eq!(obj, 1);
        }
        _ => panic!("lmao"),
    });

    assert_eq!(first, Some("hello".into()));

    document
        .get_element_by_id("loading")
        .expect("Should have loading in document")
        .dyn_ref::<HtmlElement>()
        .expect("Should be a html element")
        .style()
        .set_property("display", "none")?;

    setup_clock(&window, &document)?;
    setup_click(&window, &document);

    Ok(())
}

fn setup_clock(window: &Window, document: &Document) -> Result<(), JsValue> {
    let current_time = document
        .get_element_by_id("current-time")
        .expect("should have #current-time on the page");
    update_time(&current_time);

    let a = Closure::wrap(Box::new(move || update_time(&current_time)) as Box<dyn Fn()>);
    window
        .set_interval_with_callback_and_timeout_and_arguments_0(a.as_ref().unchecked_ref(), 1000)?;

    fn update_time(current_time: &Element) {
        current_time.set_inner_html(&String::from(
            Date::new_0().to_locale_string("vi-VN", &JsValue::undefined()),
        ))
    }

    a.forget();

    Ok(())
}

fn setup_click(window: &Window, document: &Document) {
    let num_click = document
        .get_element_by_id("num-click")
        .expect("Should have num-click on the page");
    let mut click = 0;
    let cb = Closure::wrap(Box::new(move || {
        click += 1;
        num_click.set_inner_html(&click.to_string());
    }) as Box<dyn FnMut()>);

    document
        .get_element_by_id("btn")
        .expect("Should have btn")
        .dyn_ref::<HtmlElement>()
        .expect("Should be a html element")
        .set_onclick(Some(cb.as_ref().unchecked_ref()));

    cb.forget()
}

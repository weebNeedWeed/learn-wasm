#![allow(dead_code)]
#![allow(unused_variables)]

use js_sys::Math;
use wasm_bindgen::prelude::*;

pub mod tests;

#[repr(u8)]
#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
    width: usize,
    height: usize,
    cells: Vec<Cell>,
}

#[wasm_bindgen]
impl Universe {
    fn get_index(&self, row: usize, col: usize) -> usize {
        (row * self.width) + col
    }

    fn live_neighbor_count(&self, row: usize, col: usize) -> u32 {
        let mut count = 0;

        for delta_row in [self.height - 1, 0, 1] {
            for delta_col in [self.width - 1, 0, 1] {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let nei_row = (delta_row + row) % self.height;
                let nei_col = (delta_col + col) % self.width;
                let idx = self.get_index(nei_row, nei_col);

                count += self.cells[idx] as u32;
            }
        }

        count
    }

    pub fn new() -> Universe {
        let width = 128;
        let height = 128;

        let mut cells = vec![];
        for i in 0..width * height {
            let cell = match Math::random() {
                x if x >= 0.5f64 => Cell::Alive,
                _ => Cell::Dead,
            };
            cells.push(cell)
        }

        Universe {
            width,
            height,
            cells,
        }
    }

    pub fn tick(&mut self) {
        let mut cells = self.cells.clone();

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let neighbors = self.live_neighbor_count(row, col);

                let next_cell = match (self.cells[idx], neighbors) {
                    (Cell::Alive, x) if x < 2 => Cell::Dead,
                    (Cell::Alive, 2) | (Cell::Alive, 3) => Cell::Alive,
                    (Cell::Alive, x) if x > 3 => Cell::Dead,
                    (Cell::Dead, 3) => Cell::Alive,
                    (otherwise, _) => otherwise,
                };

                cells[idx] = next_cell;
            }
        }

        self.cells = cells;
    }

    pub fn cells(&self) -> *const Cell {
        self.cells.as_ptr()
    }
}

// for testing only
impl Universe {
    pub fn set_width(&mut self, width: usize) {
        self.width = width;
        self.cells = (0..self.width * self.height).map(|_| Cell::Dead).collect();
    }

    pub fn set_height(&mut self, height: usize) {
        self.height = height;
        self.cells = (0..self.width * self.height).map(|_| Cell::Dead).collect();
    }

    pub fn set_cells(&mut self, cells: &[(usize, usize)]) {
        for &(row, col) in cells {
            let idx = self.get_index(row, col);
            self.cells[idx] = Cell::Alive;
        }
    }

    pub fn get_cells(&self) -> Vec<Cell> {
        self.cells.clone()
    }
}

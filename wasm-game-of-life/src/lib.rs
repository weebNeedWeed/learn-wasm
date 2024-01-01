use std::fmt::{Display, Formatter};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
}

#[wasm_bindgen]
impl Universe {
    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    fn live_neighbor_count(&self, row: u32, col: u32) -> u8 {
        let mut count = 0;

        for delta_row in [self.height - 1, 0, 1] {
            for delta_col in [self.width - 1, 0, 1] {
                if delta_row == 0 && delta_col == 0 {
                    continue
                }

                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_height = (col + delta_col) % self.width;
                let index = self.get_index(neighbor_row, neighbor_height);
                let cell = self.cells[index];

                count += cell as u8;
            }
        }

        count
    }

    pub fn tick(&mut self) {
        let mut next_cells = self.cells.clone();

        for row in 0..self.height {
            for col in 0..self.width {
                let index = self.get_index(row, col);
                let cell = &self.cells[index];
                let live_neighbors = self.live_neighbor_count(row, col);

                let next = match (*cell, live_neighbors) {
                    (Cell::Alive, x) if x < 2 => Cell::Dead,
                    (Cell::Alive, 2) | (Cell::Alive, 3) => Cell::Alive,
                    (Cell::Alive, x) if x > 3 => Cell::Dead,
                    (Cell::Dead, 3) => Cell::Alive,
                    (otherwise, _) => otherwise
                };

                next_cells[index] = next;
            }
        }

        self.cells = next_cells;
    }

    pub fn new(width: u32, height: u32) -> Self {
        let cells = (0..width * height)
            .map(|x| {
                if x % 2 == 0 || x % 7 == 0 {
                    Cell::Alive
                } else {
                    Cell::Dead
                }
            }).collect();

        Self {
            width,
            height,
            cells
        }
    }

    pub fn cells(&self) -> *const Cell {
        self.cells.as_ptr()
    }
}

impl Display for Universe {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        for line in self.cells.iter().as_slice().chunks(self.width as usize) {
            for cell in line {
                let symbol = if Cell::Dead == *cell { '◻' } else { '◼' };
                write!(f, "{}", symbol)?
            }
            write!(f, "\n")?
        }
        Ok(())
    }
}

#[derive(Clone, Debug)]
pub struct TransactionSent {
    pub from: String,
    pub to: String,
    pub amount: f64,
}

impl TransactionSent {
    pub fn new(from: String, to: String, amount: f64) -> Self {
        Self { from, to, amount }
    }
}
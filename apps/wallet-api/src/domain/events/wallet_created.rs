#[derive(Clone, Debug)]
pub struct WalletCreated {
    pub wallet_id: String,
    pub owner_id: String,
}

impl WalletCreated {
    pub fn new(wallet_id: String, owner_id: String) -> Self {
        Self { wallet_id, owner_id }
    }
}
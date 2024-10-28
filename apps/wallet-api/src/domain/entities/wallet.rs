#[derive(Clone, Debug)]
pub struct Wallet {
    pub id: String,
    pub address: String,
    pub network_id: i32,
    pub owner_id: String,
}

impl Wallet {
    pub fn new(id: String, address: String, network_id: i32, owner_id: String) -> Self {
        Self {
            id,
            address,
            network_id,
            owner_id,
        }
    }
}
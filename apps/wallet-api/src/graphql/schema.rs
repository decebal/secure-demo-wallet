use juniper::graphql_object;
use serde::{Deserialize, Serialize};

// Example data models for Wallet and User
#[derive(Debug, Clone, Serialize, Deserialize)]
pub(crate) struct Wallet {
    pub(crate) id: String,
    pub(crate) address: String,
    pub(crate) network_id: i32,
    pub(crate) owner_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub(crate) struct User {
    pub(crate) id: String,
    pub(crate) name: String,
    pub(crate) email: String,
}

// Define GraphQL Object for Wallet
#[graphql_object]
impl Wallet {
    fn id(&self) -> &str {
        &self.id
    }

    fn address(&self) -> &str {
        &self.address
    }

    fn network_id(&self) -> i32 {
        self.network_id
    }

    fn owner_id(&self) -> &str {
        &self.owner_id
    }
}

// Define GraphQL Object for User
#[graphql_object]
impl User {
    fn id(&self) -> &str {
        &self.id
    }

    fn name(&self) -> &str {
        &self.name
    }

    fn email(&self) -> &str {
        &self.email
    }
}

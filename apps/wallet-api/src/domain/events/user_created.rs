#[derive(Debug, Clone)]
pub struct UserCreated {
    pub user_id: String,
}

impl UserCreated {
    pub fn new(user_id: String) -> Self {
        UserCreated { user_id }
    }
}
#[derive(Clone, Debug)]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: String,
}

impl User {
    pub fn new(id: String, name: String, email: String) -> Self {
        Self { id, name, email }
    }
}
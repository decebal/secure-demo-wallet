use crate::app::services::user::UserService;
use crate::infrastructure::jwt::{Claims, Jwt};
use anyhow::{Error, Result};

#[derive(Clone)]
pub struct GraphQLContext {
    pub user_service: UserService,
    pub jwt: Jwt,
    pub token: Option<String>, // Store token from headers
}

impl juniper::Context for GraphQLContext {}

impl GraphQLContext {
    pub fn new(user_service: UserService, jwt: Jwt, token: Option<String>) -> Self {
        GraphQLContext { user_service, jwt, token }
    }

    pub fn validate_token(&self) -> Result<Claims, Error> {
        let token = self.token.as_ref().ok_or_else(|| anyhow::anyhow!("Token missing"))?;
        self.jwt.validate_token(token).map_err(|e| e.into())
    }
}

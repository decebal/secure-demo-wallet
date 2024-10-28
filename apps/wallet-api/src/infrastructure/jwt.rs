use jsonwebtoken::{decode, encode, errors::Result as JwtResult, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct Claims {
    pub(crate) sub: String, // User ID
    exp: usize,  // Expiration timestamp
}

pub(crate) struct Jwt {
    secret: String,
}

impl Clone for Jwt {
    fn clone(&self) -> Self {
        Jwt {
            secret: self.secret.clone(),
        }
    }
}

impl Jwt {
    pub fn new(secret: String) -> Self {
        Jwt { secret }
    }

    pub fn create_token(&self, user_id: &str) -> Result<String, jsonwebtoken::errors::Error> {
        let claims = Claims {
            sub: user_id.to_string(),
            exp: (chrono::Utc::now() + chrono::Duration::hours(1)).timestamp() as usize,
        };
        encode(&Header::default(), &claims, &EncodingKey::from_secret(self.secret.as_ref()))
    }

    pub fn validate_token(&self, token: &str) -> JwtResult<Claims> {
        let validation = Validation::default();
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.secret.as_ref()),
            &validation,
        )
            .map(|data| data.claims)
    }
}
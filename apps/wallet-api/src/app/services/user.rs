use crate::infrastructure::jwt::Jwt;
use crate::infrastructure::repositories::user::UserRepository;
use anyhow::Result;
use chrono::{Duration, Utc};
use mongodb::bson::oid::ObjectId;
use rand::{distributions::Alphanumeric, Rng};

pub struct UserService {
    repository: UserRepository,
    jwt: Jwt,
}

impl Clone for UserService {
    fn clone(&self) -> Self {
        UserService {
            repository: self.repository.clone(),
            jwt: self.jwt.clone(),
        }
    }
}

impl UserService {
    pub fn new(repository: UserRepository, jwt: Jwt) -> Self {
        UserService { repository, jwt }
    }

    pub async fn login_or_create_user(&self, email: &str) -> Result<(String, String)> {
        let user = match self.repository.find_by_email(email).await? {
            Some(user) => user,
            None => {
                let new_user = self.repository.create(email).await?;
                new_user
            }
        };

        let user_id = user.id.unwrap().to_hex();
        let access_token = self.jwt.create_token(&user_id)?;
        let refresh_token = self.generate_refresh_token(user.id.unwrap()).await?;

        Ok((access_token, refresh_token))
    }

    async fn generate_refresh_token(&self, user_id: ObjectId) -> Result<String> {
        let token: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(30)
            .map(char::from)
            .collect();

        let expires_at = Utc::now() + Duration::days(7);
        self.repository.create_refresh_token(user_id, token.clone(), expires_at).await?;

        Ok(token)
    }

    pub async fn refresh_access_token(&self, refresh_token: &str) -> Result<String> {
        let token_data = self.repository.find_refresh_token(refresh_token).await?
            .ok_or_else(|| anyhow::anyhow!("Invalid or expired refresh token"))?;

        if Utc::now() > token_data.expires_at {
            self.repository.delete_refresh_token(refresh_token).await?;
            return Err(anyhow::anyhow!("Refresh token expired"));
        }

        let access_token = self.jwt.create_token(&token_data.user_id.to_hex())?;
        Ok(access_token)
    }
}
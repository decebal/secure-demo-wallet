use crate::infrastructure::models::refresh_token::RefreshToken;
use crate::infrastructure::models::user::User;
use anyhow::Result;
use chrono::{DateTime, Utc};
use mongodb::error::Error as MongoError;
use mongodb::{bson::{doc, oid::ObjectId}, Collection};

pub(crate) struct UserRepository {
    user_collection: Collection<User>,
    refresh_token_collection: Collection<RefreshToken>,
}

impl Clone for UserRepository {
    fn clone(&self) -> Self {
        UserRepository {
            user_collection: self.user_collection.clone(),
            refresh_token_collection: self.refresh_token_collection.clone(),
        }
    }
}

impl UserRepository {
    pub fn new(user_collection: Collection<User>, refresh_token_collection: Collection<RefreshToken>) -> Self {
        UserRepository { user_collection, refresh_token_collection }
    }
}

impl UserRepository {
    pub async fn find_by_email(&self, email: &str) -> Result<Option<User>, MongoError> {
        let filter = doc! { "email": email };
        let user = self.user_collection.find_one(filter).await?;
        Ok(user)
    }

    pub async fn create(&self, email: &str) -> Result<User, MongoError> {
        let new_user = User {
            id: None,
            email: email.to_string(),
        };
        let inserted = self.user_collection.insert_one(new_user.clone()).await?;
        Ok(User {
            id: Some(inserted.inserted_id.as_object_id().unwrap()),
            ..new_user
        })
    }

    pub async fn create_refresh_token(&self, user_id: ObjectId, token: String, expires_at: DateTime<Utc>) -> Result<RefreshToken, MongoError> {
        let new_token = RefreshToken {
            id: None,
            user_id,
            token,
            expires_at,
        };
        self.refresh_token_collection.insert_one(new_token.clone()).await?;
        Ok(new_token)
    }

    pub async fn find_refresh_token(&self, token: &str) -> Result<Option<RefreshToken>, MongoError> {
        let filter = doc! { "token": token };
        let refresh_token = self.refresh_token_collection.find_one(filter).await?;
        Ok(refresh_token)
    }

    pub async fn delete_refresh_token(&self, token: &str) -> Result<(), MongoError> {
        let filter = doc! { "token": token };
        self.refresh_token_collection.delete_one(filter).await?;
        Ok(())
    }
}
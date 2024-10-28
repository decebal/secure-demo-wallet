use config::{Config, ConfigError, Environment};
use dotenv::dotenv;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Settings {
    pub database_url: String,
    pub database_name: String,
    pub jwt_secret: String,
}

impl Settings {
    pub fn new() -> Result<Self, ConfigError> {
        dotenv().ok(); // Load environment variables from .env file

        let builder = Config::builder()
            .add_source(Environment::default());

        let settings: Config = builder.build()?;
        settings.try_deserialize()
    }
}
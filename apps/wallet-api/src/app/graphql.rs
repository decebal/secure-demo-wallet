use crate::app::auth::GraphQLContext;
use crate::app::resolvers::{MutationRoot, QueryRoot};
use crate::app::services::user::UserService;
use crate::config::Settings;
use crate::infrastructure::jwt::Jwt;
use crate::infrastructure::models::refresh_token::RefreshToken;
use crate::infrastructure::models::user::User;
use crate::infrastructure::repositories::user::UserRepository;
use juniper::EmptySubscription;
use juniper::RootNode;
use juniper_warp::make_graphql_filter;
use mongodb::options::ClientOptions;
use mongodb::{Client, Database};
use std::error::Error;
use warp::{Filter, Rejection};

pub async fn start_graphql_server() -> Result<(), Box<dyn Error>> {
    let settings = Settings::new()?;

    // Initialize MongoDB Client
    let client_options = ClientOptions::parse(&settings.database_url).await?;
    let client = Client::with_options(client_options)?;
    let database: Database = client.database(&settings.database_name);

    // Initialize Repositories
    let user_collection = database.collection::<User>("users");
    let refresh_token_collection = database.collection::<RefreshToken>("refresh_tokens");
    let user_repository = UserRepository::new(user_collection, refresh_token_collection);

    // Setup GraphQL and server
    let schema = RootNode::new(QueryRoot {}, MutationRoot {}, EmptySubscription::new());

    // Initialize JWT and event dispatcher
    let jwt = Jwt::new(settings.jwt_secret.clone());

    // Create the UserService with injected dependencies
    let user_service = UserService::new(user_repository, jwt.clone());

    // Define a filter to extract the token from headers
    let context_filter = warp::header::optional("authorization").and_then({
        let user_service = user_service.clone();
        let jwt = jwt.clone();
        move |auth_header: Option<String>| {
            let user_service = user_service.clone();
            let jwt = jwt.clone();

            async move {
                // Parse the token, stripping "Bearer " if it exists
                let token = auth_header
                    .as_deref()
                    .and_then(|header| header.strip_prefix("Bearer "))
                    .map(String::from);

                // Create the GraphQL context with user_service and jwt
                let context = GraphQLContext::new(user_service, jwt, token);
                Ok::<_, Rejection>(context)
            }
        }
    });

    // Combine the context filter with the GraphQL filter
    let graphql_filter = make_graphql_filter(schema, context_filter);

    println!("🚀 GraphQL server running at http://localhost:8000/graphql");

    warp::serve(warp::path("graphql").and(graphql_filter))
        .run(([0, 0, 0, 0], 8000))
        .await;

    Ok(())
}
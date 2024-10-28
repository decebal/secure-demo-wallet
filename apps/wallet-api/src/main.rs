mod app;
mod domain;
mod graphql;
mod infrastructure;
mod config;

#[tokio::main]
async fn main() {
    if let Err(err) = app::graphql::start_graphql_server().await {
        eprintln!("Error starting GraphQL server: {}", err);
    }
}

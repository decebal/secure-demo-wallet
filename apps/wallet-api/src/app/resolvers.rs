use crate::app::auth::GraphQLContext;
use crate::graphql::schema::{User, Wallet};
use juniper::{graphql_object, FieldError, FieldResult};

// Mock database functions and authentication
async fn fetch_user_profile(id: &str) -> Option<User> {
    Some(User {
        id: id.to_string(),
        name: "".to_string(),
        email: "user@example.com".to_string(),
    })
}

async fn get_wallet_by_id(id: &str) -> Option<Wallet> {
    Some(Wallet {
        id: id.to_string(),
        address: "0xWalletAddress".to_string(),
        network_id: 1,
        owner_id: "user123".to_string(),
    })
}

async fn get_wallets_for_user(user_id: &str, page: i32, per_page: i32) -> Vec<Wallet> {
    vec![
        Wallet {
            id: "wallet1".to_string(),
            address: "0xWalletAddress1".to_string(),
            network_id: 1,
            owner_id: user_id.to_string(),
        },
        Wallet {
            id: "wallet2".to_string(),
            address: "0xWalletAddress2".to_string(),
            network_id: 1,
            owner_id: user_id.to_string(),
        },
    ]
}

async fn send_eth_transaction(to: &str, value: f64, token: &str) -> bool {
    println!("Sending {} ETH to {}", value, to);
    true
}

async fn remove_user_data(user_id: &str) -> bool {
    println!("Removing data for user: {}", user_id);
    true
}


// Query Root
pub(crate) struct QueryRoot;

#[graphql_object(context = GraphQLContext)]
impl QueryRoot {
    // Returns a wallet using its ID
    async fn wallet(context: &GraphQLContext, id: String) -> FieldResult<Option<Wallet>> {
        let claims = context.validate_token()?; // Validates token and retrieves claims
        let wallet = get_wallet_by_id(&id).await;
        //TODO check that the wallet belongs to the current user
        Ok(wallet)
    }

    // Paginated query to return all wallets of a user identified by an access token
    async fn wallets(context: &GraphQLContext, page: i32, per_page: i32) -> FieldResult<Vec<Wallet>> {
        let claims = context.validate_token()?;

        let wallets = get_wallets_for_user(&claims.sub, page, per_page).await;
        Ok(wallets)
    }

    // // Returns the current logged-in user based on the access token
    // async fn me(context: &GraphQLContext) -> FieldResult<Option<User>> {
    //     let claims = context.validate_token()?;
    //     let user = fetch_user_profile(&claims.sub)?;
    //     Ok(user)
    // }
}

// Mutation Root
pub(crate) struct MutationRoot;

#[graphql_object(context = GraphQLContext)]
impl MutationRoot {
    async fn login(context: &GraphQLContext, email: String) -> FieldResult<(String, String)> {
        context
            .user_service
            .login_or_create_user(&email)
            .await
            .map_err(FieldError::from)
    }

    // async fn refresh_token(context: &GraphQLContext, refresh_token: String) -> FieldResult<String> {
    //     let access_token_result = context.user_service.refresh_access_token(&refresh_token).await?;
    //
    //     match access_token_result {
    //         Ok(access_token) => Ok(access_token),
    //         Err(e) => Err(FieldError::from(e)),
    //     }
    // }

    // Add a new wallet for the user identified through the access token
    async fn add_wallet(context: &GraphQLContext, network_id: i32) -> FieldResult<Wallet> {
        let claims = context.validate_token()?;

        //todo trigger wallet generation
        let wallet = Wallet {
            id: "wallet3".to_string(),
            address: "0xNewWalletAddress".to_string(),
            network_id,
            owner_id: claims.sub,
        };

        Ok(wallet)
    }

    // Remove all user data for the user identified through the access token
    async fn remove_user_data(context: &GraphQLContext) -> FieldResult<bool> {
        let claims = context.validate_token()?;

        let result = remove_user_data(&claims.sub).await;
        Ok(result)
    }

    // Send an Ethereum transaction to a specified address with value and token
    async fn send_transaction(context: &GraphQLContext, to: String, value: f64, token: String) -> FieldResult<bool> {
        context.validate_token()?;
        // let claims = context.validate_token()?; //todo

        let result = send_eth_transaction(&to, value, &token).await;

        Ok(result)
    }
}
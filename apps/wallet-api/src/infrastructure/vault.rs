use ethers::core::types::{transaction::eip2718::TypedTransaction, TransactionRequest, U256};
use ethers::signers::{Signer, Wallet};
use ethers_core::k256::SecretKey as K256SecretKey;
use secp256k1::SecretKey;
use serde::{Deserialize, Serialize};
use std::error::Error;
use std::str::FromStr;
use vaultrs::{client::{VaultClient, VaultClientSettingsBuilder}, kv2};

#[derive(Serialize, Deserialize)]
pub(crate)struct KeySecret {
    private_key: String,
}

pub(crate) struct VaultService {
    client: VaultClient,
}

impl VaultService {
    pub fn new(vault_url: &str, token: &str) -> Result<Self, Box<dyn Error>> {
        let client = VaultClient::new(
            VaultClientSettingsBuilder::default()
                .address(vault_url)
                .token(token)
                .build()?
        )?;
        Ok(Self { client })
    }

    pub async fn store_private_key(&self, key_path: &str, private_key: &str) -> Result<(), Box<dyn std::error::Error>> {
        let secret = KeySecret {
            private_key: private_key.to_string(),
        };

        kv2::set(&self.client, "secret", key_path, &secret).await?;
        Ok(())
    }

    async fn retrieve_private_key(&self, key_path: &str) -> Result<String, Box<dyn Error>> {
        let secret: serde_json::Value = kv2::read(&self.client, "secret", key_path).await?;
        Ok(secret["data"]["private_key"].as_str().unwrap().to_string())
    }

    async fn sign_transaction(&self, private_key: &str, to: &str, value: f64) -> Result<Vec<u8>, Box<dyn Error>> {
        // Step 1: Parse the private key
        let secret_key = SecretKey::from_str(private_key)?;

        //Debug public key derivation
        // let secp = Secp256k1::new();
        // let public_key = PublicKey::from_secret_key(&secp, &secret_key);
        //
        // // Display derived public key
        // println!("Public key: {:?}", public_key);

        // Step 2: Initialize an Ethereum Wallet
        // Convert secp256k1 SecretKey to bytes
        let secp_bytes = secret_key.secret_bytes();

        // Convert to ethers-compatible K256SecretKey
        let k256_secret_key = K256SecretKey::from_bytes(&secp_bytes).expect("Invalid key bytes");

        // Initialize the ethers Wallet
        let wallet = Wallet::from(k256_secret_key);

        // Step 3: Create the transaction
        let tx = TransactionRequest {
            to: Some(to.parse()?),
            value: Some(U256::exp10(18) * U256::from(value as u64)), // Convert ETH to Wei
            ..Default::default()
        };
        let typed_tx: TypedTransaction = tx.into();

        // Step 4: Sign the transaction and serialize it
        let signature = wallet.sign_transaction(&typed_tx).await?;
        let signed_tx = typed_tx.rlp_signed(&signature).to_vec(); // Serialize transaction with signature

        Ok(signed_tx)
    }
}
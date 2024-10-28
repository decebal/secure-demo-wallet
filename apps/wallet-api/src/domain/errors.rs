#[derive(Debug)]
pub enum DomainError {
    VaultError(Box<dyn std::error::Error>),
    WalletError(Box<dyn std::error::Error>),
    UserError(Box<dyn std::error::Error>),
    // Other domain-specific errors can be added here
}
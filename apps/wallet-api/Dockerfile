# Step 1: Builder Stage
FROM rust:1.71 as builder

# Set the working directory in the container
WORKDIR /app

# Copy only the Cargo files to cache dependencies
COPY Cargo.toml Cargo.lock ./

# Build dependencies to cache them
RUN cargo build --release
RUN rm src/*.rs

# Copy the source code
COPY . .

# Compile the application in release mode
RUN cargo build --release

# Step 2: Runtime Stage
FROM debian:bullseye-slim

# Install necessary packages to run Rust binaries
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy the compiled binary from the builder stage
COPY --from=builder /app/target/release/wallet_api /usr/local/bin/wallet_api

# Expose the port the app will run on
EXPOSE 8080

# Run the application
CMD ["wallet_api"]
from dotenv import load_dotenv
import  psycopg2
import os


load_dotenv()


def create_connection():
    """Establishes a connection with the PostgreSQL database."""
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        print("Connection to the database successful")
        return conn
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None
    
def initialize_db():
    conn = create_connection()
    cur = conn.cursor()

    # Transactions table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            blockNumber BIGINT NOT NULL,
            timeStamp TIMESTAMP NOT NULL,
            hash TEXT UNIQUE NOT NULL,
            nonce TEXT NOT NULL,
            blockHash TEXT NOT NULL,
            from_address TEXT NOT NULL,
            contractAddress TEXT NOT NULL,
            to_address TEXT NOT NULL,
            value NUMERIC NOT NULL,
            tokenName TEXT NOT NULL,
            tokenSymbol TEXT NOT NULL,
            tokenDecimal INT NOT NULL,
            transactionIndex INT NOT NULL,
            gas BIGINT NOT NULL,
            gasPrice BIGINT NOT NULL,
            gasUsed BIGINT NOT NULL,
            cumulativeGasUsed BIGINT NOT NULL,
            input TEXT,
            confirmations BIGINT NOT NULL
        );
    """)

    # Gas prices table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS gas_prices (
            id SERIAL PRIMARY KEY,
            gas_price NUMERIC NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # User preferences table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS user_preferences (
            id SERIAL PRIMARY KEY,
            user_id TEXT UNIQUE NOT NULL,
            favorite_addresses TEXT[]
        );
    """)

    conn.commit()
    cur.close()
    conn.close()

# Call this function after establishing a database connection
initialize_db()
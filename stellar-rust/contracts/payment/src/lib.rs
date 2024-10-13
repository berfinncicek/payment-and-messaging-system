#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, Symbol, Vec, vec,
    String as SdkString,
};

#[derive(Debug, Clone, Copy)]
#[contracterror]
pub enum PaymentError {
    InsufficientBalance = 1,      // Yetersiz bakiye
    InvalidAmount = 2,            // Geçersiz miktar
    CannotPaySelf = 3,            // Kendine ödeme yapmaya çalışılıyor
}

#[derive(Debug, Clone)]
#[contracttype]
pub struct Transaction {
    pub from: Address,
    pub to: Address,
    pub amount: u64,
    pub message: SdkString,
    pub timestamp: u64,
}

#[contract]
pub struct PaymentContract;

#[contractimpl]
impl PaymentContract {
    // XLM transferi ve mesaj ekleme
    pub fn send_payment(
        env: Env,
        from: Address,
        to: Address,
        amount: u64,
        message: SdkString,
    ) -> Result<(), PaymentError> {
        // Bakiye kontrolü ve diğer kurallar
        if from == to {
            return Err(PaymentError::CannotPaySelf);
        }
        
        if amount == 0 {
            return Err(PaymentError::InvalidAmount);
        }

        // Ödeme ve mesajı işleme
        let timestamp = env.ledger().timestamp();

        let mut storage = env.storage().persistent();
        let from_key = (from.clone(), symbol_short!("balance"));
        let to_key = (to.clone(), symbol_short!("balance"));
        let from_balance: u64 = storage.get(&from_key).unwrap_or(0);
        let to_balance: u64 = storage.get(&to_key).unwrap_or(0);

        if from_balance < amount {
            return Err(PaymentError::InsufficientBalance);
        }

        storage.set(&from_key, &(from_balance - amount));
        storage.set(&to_key, &(to_balance + amount));

        let transaction = Transaction {
            from: from.clone(),
            to: to.clone(),
            amount,
            message,
            timestamp,
        };

        let transaction_id = env.ledger().timestamp();  // Benzersiz bir ID üretilir

        storage.set(&(from.clone(), transaction_id), &transaction);
        storage.set(&(to.clone(), transaction_id), &transaction);

        Ok(())
    }

    // Bakiye sorgulama
    pub fn get_balance(env: Env, address: Address) -> u64 {
        let storage = env.storage().persistent();
        let key = (address, symbol_short!("balance"));
        storage.get(&key).unwrap_or(0)
    }

    // İşlem geçmişi görüntüleme
    pub fn get_transaction_history(env: Env, address: Address) -> Vec<Transaction> {
        let storage = env.storage().persistent();
        let mut transactions = Vec::new(&env);

        // Anahtarları dolaşarak işlem geçmişini toplamak
        for id in 1..=env.ledger().timestamp() {
            let key = (address.clone(), id);
            if let Some(transaction) = storage.get::<(Address, u64), Transaction>(&key) {
                transactions.push_back(transaction);
            }
        }
        
        transactions
    }

    // Düzenli ödemeler
    pub fn schedule_payment(
        env: Env,
        from: Address,
        to: Address,
        amount: u64,
        message: SdkString,
        interval: u64,
    ) -> Result<(), PaymentError> {
        // Bakiye kontrolü ve diğer kurallar
        if from == to {
            return Err(PaymentError::CannotPaySelf);
        }
        
        if amount == 0 {
            return Err(PaymentError::InvalidAmount);
        }

        // Düzenli ödemeyi işleme
        let timestamp = env.ledger().timestamp();
        let next_payment_time = timestamp + interval;

        let mut storage = env.storage().persistent();
        let transaction = Transaction {
            from: from.clone(),
            to: to.clone(),
            amount,
            message,
            timestamp: next_payment_time,
        };

        let schedule_id = env.ledger().timestamp();  // Benzersiz bir ID üretilir

        storage.set(&(from, schedule_id), &transaction);
        Ok(())
    }
} 

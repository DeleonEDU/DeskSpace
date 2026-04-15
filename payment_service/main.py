from fastapi import FastAPI

app = FastAPI(title="Payment Service")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Payment Service"}

@app.post("/create-payment-intent")
async def create_payment_intent():
    return {"client_secret": "pi_123_secret_456"}

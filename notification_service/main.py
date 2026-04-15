from fastapi import FastAPI

app = FastAPI(title="Notification Service")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Notification Service"}

@app.post("/send-email")
async def send_email():
    # Placeholder for async email sending task
    return {"status": "email queued"}

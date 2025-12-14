from fastapi import FastAPI
from pydantic import BaseModel
from generate_pdf import create_pdf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow extension to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Report(BaseModel):
    offender: str
    message: str
    timestamp: str
    chatUrl: str
    snippet: str
    screenshot: str  # base64 string

@app.post("/generate_pdf")
def generate_pdf(report: Report):
    filename = create_pdf(
        offender=report.offender,
        message=report.message,
        timestamp=report.timestamp,
        chatUrl=report.chatUrl,
        snippet=report.snippet,
        screenshot_base64=report.screenshot
    )

    return {"filename": filename}

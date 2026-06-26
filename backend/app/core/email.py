import os
import resend
from dotenv import load_dotenv
from app.core.config import settings

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "onboarding@resend.dev")

def send_reset_password_email(email_to: str, token: str):
    """
    Dispatches a password reset email using Resend.
    """
    if not resend.api_key or resend.api_key == "re_put_your_resend_api_key_here":
        print(f"⚠️ Warning: RESEND_API_KEY not configured. Would have sent email to {email_to} with token {token}")
        return

    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #040911; color: #f1f5f9; padding: 40px; margin: 0; }}
            .container {{ max-w: 600px; margin: 0 auto; background: #060d18; border: 1px solid rgba(255,255,255,0.04); border-radius: 16px; padding: 40px; text-align: center; }}
            .brand {{ font-size: 24px; font-weight: 900; letter-spacing: 0.1em; color: #e2e8f0; margin-bottom: 30px; }}
            .brand span {{ color: #818cf8; }}
            .title {{ font-size: 20px; font-weight: 700; margin-bottom: 16px; }}
            .text {{ font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px; }}
            .button {{ display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff !important; font-weight: 600; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 14px rgba(99,102,241,0.3); }}
            .footer {{ margin-top: 40px; font-size: 12px; color: #475569; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="brand">GUARD<span>RAIL</span></div>
            <div class="title">Password Reset Request</div>
            <div class="text">
                We received a request to reset your password. Click the button below to choose a new password. 
                If you did not make this request, you can safely ignore this email.
            </div>
            <a href="{reset_url}" class="button">Reset Password</a>
            <div class="footer">
                This link will expire in 1 hour.<br>
                For security reasons, this link can only be used once.
            </div>
        </div>
    </body>
    </html>
    """

    try:
        r = resend.Emails.send({
            "from": f"GuardRail <{SENDER_EMAIL}>",
            "to": email_to,
            "subject": "Password Reset - GuardRail",
            "html": html_content
        })
        print(f"📧 Email dispatched successfully to {email_to}")
        return r
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        raise e

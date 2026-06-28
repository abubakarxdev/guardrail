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

def send_support_ticket_email(user_email: str, subject: str, message: str):
    """
    Sends a support ticket using Resend.
    Sends one email to the admin team, and a confirmation email to the user.
    """
    if not resend.api_key or resend.api_key == "re_put_your_resend_api_key_here":
        print(f"⚠️ Warning: RESEND_API_KEY not configured. Would have sent support ticket '{subject}' from {user_email}")
        return

    admin_email = settings.ADMIN_EMAIL

    # 1. Email to Admin Team
    admin_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Inter', sans-serif; background-color: #040911; color: #f1f5f9; padding: 40px; }}
            .container {{ max-w: 600px; margin: 0 auto; background: #060d18; border: 1px solid rgba(255,255,255,0.04); border-radius: 16px; padding: 40px; }}
            .brand {{ font-size: 24px; font-weight: 900; letter-spacing: 0.1em; color: #e2e8f0; margin-bottom: 30px; text-align: center; }}
            .brand span {{ color: #818cf8; }}
            .title {{ font-size: 20px; font-weight: 700; margin-bottom: 16px; }}
            .meta {{ font-size: 14px; color: #94a3b8; margin-bottom: 20px; border-bottom: 1px solid #27272a; padding-bottom: 20px; }}
            .meta strong {{ color: #f1f5f9; }}
            .message {{ font-size: 15px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap; background: #0f172a; padding: 20px; border-radius: 8px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="brand">GUARD<span>RAIL</span></div>
            <div class="title">New Support Ticket</div>
            <div class="meta">
                <strong>From:</strong> {user_email}<br>
                <strong>Subject:</strong> {subject}
            </div>
            <div class="message">{message}</div>
        </div>
    </body>
    </html>
    """

    # 2. Confirmation Email to User
    user_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Inter', sans-serif; background-color: #040911; color: #f1f5f9; padding: 40px; }}
            .container {{ max-w: 600px; margin: 0 auto; background: #060d18; border: 1px solid rgba(255,255,255,0.04); border-radius: 16px; padding: 40px; text-align: center; }}
            .brand {{ font-size: 24px; font-weight: 900; letter-spacing: 0.1em; color: #e2e8f0; margin-bottom: 30px; }}
            .brand span {{ color: #818cf8; }}
            .title {{ font-size: 20px; font-weight: 700; margin-bottom: 16px; }}
            .text {{ font-size: 15px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="brand">GUARD<span>RAIL</span></div>
            <div class="title">Support Request Received</div>
            <div class="text">
                Hi there,<br><br>
                We've received your support request regarding <strong>"{subject}"</strong>. <br>
                Our security engineering team is reviewing it and will get back to you shortly.
            </div>
        </div>
    </body>
    </html>
    """

    try:
        # Send to Admin
        resend.Emails.send({
            "from": f"GuardRail Support <{SENDER_EMAIL}>",
            "to": admin_email,
            "reply_to": user_email,
            "subject": f"[Support Ticket] {subject}",
            "html": admin_html
        })
        
        # Send Confirmation to User
        resend.Emails.send({
            "from": f"GuardRail Support <{SENDER_EMAIL}>",
            "to": user_email,
            "subject": f"We've received your support request: {subject}",
            "html": user_html
        })
        print(f"📧 Support tickets dispatched successfully for {user_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send support ticket: {e}")
        raise e

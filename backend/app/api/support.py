from fastapi import APIRouter, Depends, HTTPException, status
from app.api.auth import get_current_user
from app.schemas import UserResponse, SupportTicketCreate
from app.core.email import send_support_ticket_email

router = APIRouter(prefix="/support", tags=["support"])

@router.post("/ticket", status_code=status.HTTP_200_OK)
def submit_support_ticket(
    ticket: SupportTicketCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Submits a support ticket which triggers an email via Resend to the support team.
    """
    try:
        send_support_ticket_email(
            user_email=current_user.email,
            subject=ticket.subject,
            message=ticket.message
        )
        return {"message": "Support ticket submitted successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send support ticket. Please try again later."
        )

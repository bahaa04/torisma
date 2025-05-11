from apscheduler.schedulers.background import BackgroundScheduler
from .tasks import check_completed_reservations, check_expired_pending_reservations
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def start():
    """
    Start the background scheduler to check reservation statuses
    """
    scheduler = BackgroundScheduler()
    
    # Schedule tasks to run every hour
    scheduler.add_job(check_completed_reservations, 'interval', hours=1)
    scheduler.add_job(check_expired_pending_reservations, 'interval', hours=1)
    
    # Start the scheduler
    try:
        scheduler.start()
        logger.info("Reservation status scheduler started successfully.")
    except Exception as e:
        logger.error(f"Error starting reservation status scheduler: {e}") 
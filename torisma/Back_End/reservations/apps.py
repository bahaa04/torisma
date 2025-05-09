from django.apps import AppConfig


class ReservationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'reservations'

    def ready(self):
        """
        Start the background scheduler when the app is ready
        """
        # Import here to avoid AppRegistryNotReady exception
        from . import scheduler
        scheduler.start()

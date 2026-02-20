from django.apps import AppConfig


class PhrmacyappConfig(AppConfig):
    name = 'phrmacyapp'
    def ready(self):
        # register signals
        try:
            import phrmacyapp.signals  # noqa: F401
        except Exception:
            pass

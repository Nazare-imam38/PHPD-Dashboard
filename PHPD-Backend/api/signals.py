from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from api.models import Project, ProjectActivity


def _clear_dashboard_cache():
    for page in ("zones", "circles", "tehsils", "projects"):
        cache.delete(f"dashboard_page_data_{page}")


@receiver(post_save, sender=Project)
@receiver(post_delete, sender=Project)
def invalidate_dashboard_cache_on_project_change(sender, **kwargs):
    _clear_dashboard_cache()


@receiver(post_save, sender=ProjectActivity)
@receiver(post_delete, sender=ProjectActivity)
def invalidate_dashboard_cache_on_activity_change(sender, **kwargs):
    _clear_dashboard_cache()
"""
CHE·NU™ Decision Point Background Tasks

Background tasks for:
- Periodic aging level updates
- Auto-archive for items > 10 days
- Reminder notifications
- Summary stats updates

Can be run via:
- Celery beat (production)
- APScheduler (development)
- Cron job calling API endpoint
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Optional

logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════════════════════
# AGING PROCESSOR TASK
# ═══════════════════════════════════════════════════════════════════════════════

async def process_decision_point_aging():
    """
    Process aging for all active decision points.
    
    Should run every minute (or every 5 minutes in low-traffic).
    
    Actions:
    1. Update aging levels based on created_at
    2. Auto-archive items > 10 days
    3. Generate reminder notifications for escalated items
    """
    from backend.services.governance.decision_point_service import DecisionPointService
    
    service = DecisionPointService()
    
    try:
        result = await service.process_aging()
        
        logger.info(
            f"Aging processed: "
            f"updated={result.get('updated', 0)}, "
            f"archived={result.get('archived', 0)}, "
            f"reminders={result.get('reminders_due', 0)}"
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error processing aging: {e}")
        raise


# ═══════════════════════════════════════════════════════════════════════════════
# REMINDER NOTIFICATION TASK
# ═══════════════════════════════════════════════════════════════════════════════

async def send_reminder_notifications():
    """
    Send reminder notifications for decision points that need attention.
    
    Reminder frequency by aging level:
    - GREEN: No reminders
    - YELLOW: Every 6 hours
    - RED: Every 2 hours
    - BLINK: Every 30 minutes
    """
    from backend.services.governance.decision_point_service import DecisionPointService
    
    service = DecisionPointService()
    
    try:
        # Get points needing reminders
        due_reminders = await service.aging_manager.get_due_reminders()
        
        notifications_sent = 0
        
        for point in due_reminders:
            # Send notification (integrate with notification service)
            await send_decision_point_reminder(point)
            
            # Update reminder tracking
            point.last_reminded_at = datetime.utcnow()
            point.reminder_count += 1
            await service.repository.update(point)
            
            notifications_sent += 1
        
        logger.info(f"Sent {notifications_sent} reminder notifications")
        
        return {"notifications_sent": notifications_sent}
        
    except Exception as e:
        logger.error(f"Error sending reminders: {e}")
        raise


async def send_decision_point_reminder(point):
    """
    Send a reminder notification for a decision point.
    
    Integrates with notification service / websocket.
    """
    from backend.schemas.governance_schemas import AgingLevel
    
    # Build notification message based on urgency
    urgency_messages = {
        AgingLevel.YELLOW: "needs attention soon",
        AgingLevel.RED: "requires urgent attention",
        AgingLevel.BLINK: "⚠️ CRITICAL - action required immediately",
    }
    
    message = urgency_messages.get(point.aging_level, "needs attention")
    
    notification = {
        "type": "decision_point_reminder",
        "point_id": point.id,
        "title": point.title,
        "message": f"Decision point '{point.title}' {message}",
        "aging_level": point.aging_level.value,
        "thread_id": point.thread_id,
        "user_id": point.created_by,
        "timestamp": datetime.utcnow().isoformat(),
    }
    
    # TODO: Integrate with actual notification service
    # await notification_service.send(point.created_by, notification)
    
    logger.debug(f"Reminder notification: {notification}")
    
    return notification


# ═══════════════════════════════════════════════════════════════════════════════
# SUMMARY STATS TASK
# ═══════════════════════════════════════════════════════════════════════════════

async def update_decision_point_stats():
    """
    Update cached statistics for decision points.
    
    Useful for dashboard badges and alerts.
    Should run every 5-10 minutes.
    """
    from backend.services.governance.decision_point_service import DecisionPointService
    
    service = DecisionPointService()
    
    try:
        # Get global summary
        summary = await service.get_aging_summary()
        
        # Cache in Redis (if available)
        # await redis.set("decision_points:summary:global", json.dumps(summary), ex=600)
        
        logger.info(
            f"Stats updated: "
            f"total={summary['total_active']}, "
            f"urgent={summary['urgent_count']}, "
            f"critical={summary['has_critical']}"
        )
        
        return summary
        
    except Exception as e:
        logger.error(f"Error updating stats: {e}")
        raise


# ═══════════════════════════════════════════════════════════════════════════════
# CLEANUP TASK
# ═══════════════════════════════════════════════════════════════════════════════

async def cleanup_old_archived_points(days_to_keep: int = 90):
    """
    Clean up archived decision points older than specified days.
    
    Should run daily or weekly.
    
    Note: Keeps audit trail in decision_point_history.
    """
    from backend.services.governance.decision_point_service import DecisionPointService
    
    service = DecisionPointService()
    
    try:
        cutoff = datetime.utcnow() - timedelta(days=days_to_keep)
        
        deleted_count = 0
        
        # Get archived points older than cutoff
        archived = await service.repository.list_archived()
        
        for point in archived:
            if point.archived_at and point.archived_at < cutoff:
                # Archive to cold storage / delete
                # await cold_storage.archive(point)
                await service.repository.delete(point.id)
                deleted_count += 1
        
        logger.info(f"Cleaned up {deleted_count} old archived points")
        
        return {"deleted": deleted_count}
        
    except Exception as e:
        logger.error(f"Error cleaning up: {e}")
        raise


# ═══════════════════════════════════════════════════════════════════════════════
# SCHEDULER SETUP
# ═══════════════════════════════════════════════════════════════════════════════

def setup_apscheduler():
    """
    Setup APScheduler for development/testing.
    
    For production, use Celery beat or external cron.
    """
    try:
        from apscheduler.schedulers.asyncio import AsyncIOScheduler
        from apscheduler.triggers.interval import IntervalTrigger
        
        scheduler = AsyncIOScheduler()
        
        # Process aging every minute
        scheduler.add_job(
            process_decision_point_aging,
            IntervalTrigger(minutes=1),
            id='process_aging',
            name='Process decision point aging',
            replace_existing=True,
        )
        
        # Send reminders every 5 minutes
        scheduler.add_job(
            send_reminder_notifications,
            IntervalTrigger(minutes=5),
            id='send_reminders',
            name='Send reminder notifications',
            replace_existing=True,
        )
        
        # Update stats every 10 minutes
        scheduler.add_job(
            update_decision_point_stats,
            IntervalTrigger(minutes=10),
            id='update_stats',
            name='Update decision point stats',
            replace_existing=True,
        )
        
        # Cleanup daily at 3 AM
        scheduler.add_job(
            cleanup_old_archived_points,
            'cron',
            hour=3,
            id='cleanup',
            name='Cleanup old archived points',
            replace_existing=True,
        )
        
        scheduler.start()
        logger.info("APScheduler started for decision point tasks")
        
        return scheduler
        
    except ImportError:
        logger.warning("APScheduler not installed, skipping scheduler setup")
        return None


# ═══════════════════════════════════════════════════════════════════════════════
# CELERY TASKS (Production)
# ═══════════════════════════════════════════════════════════════════════════════

# Uncomment if using Celery
"""
from celery import Celery, shared_task

@shared_task(name='decision_points.process_aging')
def celery_process_aging():
    '''Celery task for aging processing.'''
    import asyncio
    return asyncio.run(process_decision_point_aging())


@shared_task(name='decision_points.send_reminders')
def celery_send_reminders():
    '''Celery task for sending reminders.'''
    import asyncio
    return asyncio.run(send_reminder_notifications())


@shared_task(name='decision_points.update_stats')
def celery_update_stats():
    '''Celery task for updating stats.'''
    import asyncio
    return asyncio.run(update_decision_point_stats())


@shared_task(name='decision_points.cleanup')
def celery_cleanup():
    '''Celery task for cleanup.'''
    import asyncio
    return asyncio.run(cleanup_old_archived_points())


# Celery beat schedule
CELERYBEAT_SCHEDULE = {
    'process-aging-every-minute': {
        'task': 'decision_points.process_aging',
        'schedule': 60.0,  # Every minute
    },
    'send-reminders-every-5-minutes': {
        'task': 'decision_points.send_reminders',
        'schedule': 300.0,  # Every 5 minutes
    },
    'update-stats-every-10-minutes': {
        'task': 'decision_points.update_stats',
        'schedule': 600.0,  # Every 10 minutes
    },
    'cleanup-daily': {
        'task': 'decision_points.cleanup',
        'schedule': crontab(hour=3, minute=0),  # Daily at 3 AM
    },
}
"""


# ═══════════════════════════════════════════════════════════════════════════════
# CLI RUNNER
# ═══════════════════════════════════════════════════════════════════════════════

async def run_task(task_name: str):
    """
    Run a specific task by name.
    
    Usage:
        python -m backend.tasks.decision_point_tasks process_aging
        python -m backend.tasks.decision_point_tasks send_reminders
        python -m backend.tasks.decision_point_tasks update_stats
        python -m backend.tasks.decision_point_tasks cleanup
    """
    tasks = {
        'process_aging': process_decision_point_aging,
        'send_reminders': send_reminder_notifications,
        'update_stats': update_decision_point_stats,
        'cleanup': cleanup_old_archived_points,
    }
    
    if task_name not in tasks:
        print(f"Unknown task: {task_name}")
        print(f"Available tasks: {', '.join(tasks.keys())}")
        return
    
    result = await tasks[task_name]()
    print(f"Task {task_name} completed: {result}")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python -m backend.tasks.decision_point_tasks <task_name>")
        print("Tasks: process_aging, send_reminders, update_stats, cleanup")
        sys.exit(1)
    
    task_name = sys.argv[1]
    asyncio.run(run_task(task_name))

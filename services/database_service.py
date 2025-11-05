"""
Database service for handling database operations.
"""

import logging
from typing import Optional
from sqlalchemy import and_
from models.models import db, RequestedUser, UserContext


class DatabaseService:
    """Service for database operations."""

    @staticmethod
    def init_db() -> None:
        """Initialize the database."""
        db.create_all()
        DatabaseService._cleanup_orphaned_users()

    @staticmethod
    def _cleanup_orphaned_users() -> None:
        """Clean up users without context data."""
        missing_users = (
            db.session.query(RequestedUser)
            .outerjoin(
                UserContext,
                (RequestedUser.username == UserContext.username)
                & (RequestedUser.year == UserContext.year),
            )
            .filter(UserContext.username.is_(None))
            .all()
        )
        for user in missing_users:
            logging.info("Removing orphaned user: %s", user.username)
            db.session.query(RequestedUser).filter_by(
                username=user.username, year=user.year
            ).delete()
        db.session.commit()

    @staticmethod
    def get_user_context(username: str, year: int) -> Optional[UserContext]:
        """Get user context from database."""
        return UserContext.query.filter(
            and_(UserContext.username == username, UserContext.year == year)
        ).first()

    @staticmethod
    def get_requested_user(username: str, year: int) -> Optional[RequestedUser]:
        """Get requested user from database."""
        return RequestedUser.query.filter(
            and_(RequestedUser.username == username, RequestedUser.year == year)
        ).first()

    @staticmethod
    def add_requested_user(username: str, year: int) -> bool:
        """Add a new requested user."""
        try:
            requested_user = RequestedUser(username=username, year=year)
            db.session.add(requested_user)
            db.session.commit()
            return True
        except Exception as e:
            logging.error("Error saving requested user: %s", e)
            db.session.rollback()
            return False

    @staticmethod
    def add_user_context(username: str, year: int, context: str) -> bool:
        """Add user context to database."""
        try:
            user_context = UserContext(username=username, context=context, year=year)
            db.session.add(user_context)
            db.session.commit()
            return True
        except Exception as e:
            logging.error("Error saving user context: %s", e)
            db.session.rollback()
            return False

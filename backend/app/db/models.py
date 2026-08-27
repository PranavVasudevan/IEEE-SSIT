import datetime
import uuid
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    JSON,
    String,
    Text,
)
from app.db.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    team_type = Column(String(100), nullable=False, default="Office Bearers")
    department = Column(String(255), nullable=True)
    year = Column(String(100), nullable=False)
    email = Column(String(255), nullable=True)
    chapter = Column(String(100), default="SSIT_2026")
    quote = Column(Text, nullable=True)
    photo = Column(Text, nullable=True)
    linkedin = Column(String(500), nullable=True)
    github = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    order = Column(Integer, default=10)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String(500), nullable=False)
    category = Column(String(100), nullable=False, default="Workshop")
    date = Column(String(100), nullable=False)
    start_time = Column(String(50), nullable=True)
    end_time = Column(String(50), nullable=True)
    time = Column(String(100), nullable=True)
    location = Column(String(255), nullable=False, default="SSN College of Engineering")
    mode = Column(String(50), nullable=False, default="In-Person")
    description = Column(Text, nullable=False)
    image = Column(Text, nullable=True)
    register_url = Column(String(1000), nullable=True)
    external_url = Column(String(1000), nullable=True)
    speaker = Column(String(255), nullable=True)
    speaker_role = Column(String(255), nullable=True)
    deadline = Column(String(100), nullable=True)
    featured = Column(Boolean, default=False)
    status = Column(String(50), default="upcoming")
    published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class GalleryPhoto(Base):
    __tablename__ = "gallery_photos"

    id = Column(String, primary_key=True, default=generate_uuid)
    url = Column(Text, nullable=False)
    alt = Column(String(500), nullable=True)
    label = Column(String(255), nullable=False)
    caption = Column(Text, nullable=True)
    event_name = Column(String(255), nullable=True)
    category = Column(String(100), default="Workshop")
    date = Column(String(100), nullable=True)
    featured = Column(Boolean, default=False)
    order = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(String, primary_key=True, default=generate_uuid)
    text = Column(Text, nullable=False)
    cta_text = Column(String(100), nullable=True)
    cta_url = Column(String(1000), nullable=True)
    priority = Column(String(50), default="normal")
    status = Column(String(50), default="active")
    start_date = Column(String(100), nullable=True)
    expiry_date = Column(String(100), nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    department = Column(String(100), nullable=True)
    year = Column(String(50), nullable=True)
    inquiry_type = Column(String(50), default="general")
    interest = Column(String(500), nullable=True)
    ieee_member = Column(String(50), nullable=True)
    ssit_member = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="new")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class MembershipApplication(Base):
    __tablename__ = "membership_applications"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    register_number = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    department = Column(String(100), nullable=False)
    year = Column(String(50), nullable=False)
    ieee_membership_number = Column(String(100), nullable=True)
    vertical_choice_1 = Column(String(100), nullable=True)
    why_suitable_1 = Column(Text, nullable=True)
    vertical_choice_2 = Column(String(100), nullable=True)
    why_suitable_2 = Column(Text, nullable=True)
    vertical_choice_3 = Column(String(100), nullable=True)
    why_suitable_3 = Column(Text, nullable=True)
    past_experience = Column(Text, nullable=True)
    how_you_support = Column(Text, nullable=True)
    proof_file_url = Column(Text, nullable=True)
    status = Column(String(50), default="new")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ChapterSetting(Base):
    __tablename__ = "chapter_settings"

    key = Column(String(100), primary_key=True)
    value = Column(JSON, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    added_by = Column(String(255), default="System Lead")
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    action = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    target_title = Column(String(500), nullable=True)
    admin_email = Column(String(255), nullable=False)
    timestamp_str = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

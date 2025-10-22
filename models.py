from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    """User model for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    hive_clusters = db.relationship('HiveCluster', backref='owner', lazy='dynamic', cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'


class HiveCluster(db.Model):
    """Hive cluster location model"""
    __tablename__ = 'hive_clusters'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    hive_count = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Custom settings
    harvest_timeline = db.Column(db.String(100))
    sugar_requirements = db.Column(db.String(100))
    notes = db.Column(db.Text)
    
    # New landowner information
    landowner_name = db.Column(db.String(100))
    landowner_phone = db.Column(db.String(20))
    landowner_email = db.Column(db.String(120))
    landowner_address = db.Column(db.Text)
    
    # Site classification
    site_type = db.Column(db.String(20), default='summer')  # summer, winter
    access_type = db.Column(db.String(20), default='all_weather')  # all_weather, dry_only
    contact_before_visit = db.Column(db.Boolean, default=False)
    is_quarantine = db.Column(db.Boolean, default=False)
    
    # Hive setup details
    single_brood_boxes = db.Column(db.Integer, default=0)
    double_brood_boxes = db.Column(db.Integer, default=0)
    nucs = db.Column(db.Integer, default=0)
    dead_hives = db.Column(db.Integer, default=0)
    top_splits = db.Column(db.Integer, default=0)
    
    # Hive strength ratings
    strong_hives = db.Column(db.Integer, default=0)
    medium_hives = db.Column(db.Integer, default=0)
    weak_hives = db.Column(db.Integer, default=0)
    
    # Relationships
    individual_hives = db.relationship('IndividualHive', backref='cluster', lazy='dynamic', cascade='all, delete-orphan')
    actions = db.relationship('HiveAction', backref='cluster', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<HiveCluster {self.name}>'


class IndividualHive(db.Model):
    """Individual hive tracking (optional, for infection management)"""
    __tablename__ = 'individual_hives'
    
    id = db.Column(db.Integer, primary_key=True)
    cluster_id = db.Column(db.Integer, db.ForeignKey('hive_clusters.id'), nullable=False)
    hive_number = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default='healthy')  # healthy, infected, quarantine, etc.
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    actions = db.relationship('HiveAction', backref='individual_hive', lazy='dynamic')
    
    def __repr__(self):
        return f'<IndividualHive {self.hive_number}>'


class TaskType(db.Model):
    """Predefined task types for hive management"""
    __tablename__ = 'task_types'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))  # inspection, feeding, treatment, harvest, maintenance
    is_active = db.Column(db.Boolean, default=True)
    order = db.Column(db.Integer, default=0)
    
    def __repr__(self):
        return f'<TaskType {self.name}>'


class HiveAction(db.Model):
    """Record of actions performed on hives"""
    __tablename__ = 'hive_actions'
    
    id = db.Column(db.Integer, primary_key=True)
    cluster_id = db.Column(db.Integer, db.ForeignKey('hive_clusters.id'), nullable=False)
    individual_hive_id = db.Column(db.Integer, db.ForeignKey('individual_hives.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Action details
    task_type_id = db.Column(db.Integer, db.ForeignKey('task_types.id'), nullable=True)
    task_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    action_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Status
    is_archived = db.Column(db.Boolean, default=False)
    
    # Relationships
    user = db.relationship('User', backref='actions')
    task_type = db.relationship('TaskType', backref='actions')
    
    def __repr__(self):
        return f'<HiveAction {self.task_name} - {self.action_date}>'


class DiseaseReport(db.Model):
    """Disease reporting for clusters"""
    __tablename__ = 'disease_reports'
    
    id = db.Column(db.Integer, primary_key=True)
    cluster_id = db.Column(db.Integer, db.ForeignKey('hive_clusters.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Disease counts
    afb_count = db.Column(db.Integer, default=0)  # American Foulbrood
    varroa_count = db.Column(db.Integer, default=0)  # Varroa mites
    chalkbrood_count = db.Column(db.Integer, default=0)  # Chalkbrood
    sacbrood_count = db.Column(db.Integer, default=0)  # Sacbrood
    dwv_count = db.Column(db.Integer, default=0)  # Deformed Wing Virus
    
    # Report details
    report_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    cluster = db.relationship('HiveCluster', backref='disease_reports')
    user = db.relationship('User', backref='disease_reports')
    
    def __repr__(self):
        return f'<DiseaseReport {self.cluster.name} - {self.report_date}>'


def init_default_tasks(db_instance):
    """Initialize default task types"""
    default_tasks = [
        # Inspection tasks
        {'name': 'General Inspection', 'category': 'inspection', 'description': 'Regular hive inspection', 'order': 1},
        {'name': 'Queen Check', 'category': 'inspection', 'description': 'Check for queen presence and eggs', 'order': 2},
        {'name': 'Brood Pattern Check', 'category': 'inspection', 'description': 'Inspect brood pattern health', 'order': 3},
        {'name': 'Pest Inspection', 'category': 'inspection', 'description': 'Check for pests and diseases', 'order': 4},
        
        # Feeding tasks
        {'name': 'Sugar Syrup Feeding', 'category': 'feeding', 'description': 'Fed sugar syrup to colony', 'order': 10},
        {'name': 'Pollen Patty', 'category': 'feeding', 'description': 'Provided pollen substitute', 'order': 11},
        {'name': 'Fondant Feeding', 'category': 'feeding', 'description': 'Emergency winter feeding', 'order': 12},
        
        # Treatment tasks
        {'name': 'Varroa Treatment', 'category': 'treatment', 'description': 'Applied varroa mite treatment', 'order': 20},
        {'name': 'Nosema Treatment', 'category': 'treatment', 'description': 'Applied nosema treatment', 'order': 21},
        {'name': 'Small Hive Beetle Treatment', 'category': 'treatment', 'description': 'SHB management', 'order': 22},
        
        # Harvest tasks
        {'name': 'Honey Harvest', 'category': 'harvest', 'description': 'Harvested honey frames', 'order': 30},
        {'name': 'Wax Harvest', 'category': 'harvest', 'description': 'Collected beeswax', 'order': 31},
        {'name': 'Propolis Harvest', 'category': 'harvest', 'description': 'Collected propolis', 'order': 32},
        
        # Maintenance tasks
        {'name': 'Add Super', 'category': 'maintenance', 'description': 'Added honey super', 'order': 40},
        {'name': 'Remove Super', 'category': 'maintenance', 'description': 'Removed honey super', 'order': 41},
        {'name': 'Replace Frames', 'category': 'maintenance', 'description': 'Replaced old frames', 'order': 42},
        {'name': 'Hive Repair', 'category': 'maintenance', 'description': 'Repaired hive equipment', 'order': 43},
        {'name': 'Entrance Reducer', 'category': 'maintenance', 'description': 'Adjusted entrance reducer', 'order': 44},
        {'name': 'Queen Excluder', 'category': 'maintenance', 'description': 'Installed/removed queen excluder', 'order': 45},
        
        # Special events
        {'name': 'Swarm Collection', 'category': 'event', 'description': 'Collected a swarm', 'order': 50},
        {'name': 'Split Colony', 'category': 'event', 'description': 'Split colony for expansion', 'order': 51},
        {'name': 'Combine Colonies', 'category': 'event', 'description': 'Combined weak colonies', 'order': 52},
        {'name': 'Requeen', 'category': 'event', 'description': 'Introduced new queen', 'order': 53},
    ]
    
    for task_data in default_tasks:
        existing = TaskType.query.filter_by(name=task_data['name']).first()
        if not existing:
            task = TaskType(**task_data)
            db_instance.session.add(task)
    
    db_instance.session.commit()


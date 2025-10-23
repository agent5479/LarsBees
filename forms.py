from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, FloatField, IntegerField, SelectField, BooleanField, DateTimeField, DateField, TimeField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError, Optional, NumberRange
from models import User

class LoginForm(FlaskForm):
    """User login form"""
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=80)])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')

class RegistrationForm(FlaskForm):
    """User registration form"""
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=80)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    password2 = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Username already taken. Please choose a different one.')
    
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Email already registered. Please use a different one.')

class HiveClusterForm(FlaskForm):
    """Form for adding/editing hive clusters"""
    name = StringField('Cluster Name', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[Optional()])
    latitude = FloatField('Latitude', validators=[DataRequired(), NumberRange(min=-90, max=90)])
    longitude = FloatField('Longitude', validators=[DataRequired(), NumberRange(min=-180, max=180)])
    hive_count = IntegerField('Number of Hives', validators=[DataRequired(), NumberRange(min=1, max=1000)], default=1)
    harvest_timeline = StringField('Harvest Timeline', validators=[Optional(), Length(max=100)])
    sugar_requirements = StringField('Sugar Requirements', validators=[Optional(), Length(max=100)])
    notes = TextAreaField('Notes', validators=[Optional()])
    
    # Landowner information
    landowner_name = StringField('Landowner Name', validators=[Optional(), Length(max=100)])
    landowner_phone = StringField('Landowner Phone', validators=[Optional(), Length(max=20)])
    landowner_email = StringField('Landowner Email', validators=[Optional(), Email(), Length(max=120)])
    landowner_address = TextAreaField('Landowner Address', validators=[Optional()])
    
    # Site classification
    site_type = SelectField('Site Type', choices=[
        ('summer', 'Summer Site'),
        ('winter', 'Winter Site')
    ], default='summer')
    access_type = SelectField('Access Type', choices=[
        ('all_weather', 'All Weather'),
        ('dry_only', 'Dry Only')
    ], default='all_weather')
    contact_before_visit = BooleanField('Contact Landowner Before Visit')
    is_quarantine = BooleanField('Site in Quarantine')
    
    # Hive setup details
    single_brood_boxes = IntegerField('Single Brood Boxes', validators=[Optional(), NumberRange(min=0)], default=0)
    double_brood_boxes = IntegerField('Double Brood Boxes', validators=[Optional(), NumberRange(min=0)], default=0)
    nucs = IntegerField('Nucs (Tiny Hives)', validators=[Optional(), NumberRange(min=0)], default=0)
    dead_hives = IntegerField('Dead Hives', validators=[Optional(), NumberRange(min=0)], default=0)
    top_splits = IntegerField('Top Splits', validators=[Optional(), NumberRange(min=0)], default=0)
    
    # Hive strength ratings
    strong_hives = IntegerField('Strong Hives', validators=[Optional(), NumberRange(min=0)], default=0)
    medium_hives = IntegerField('Medium Hives', validators=[Optional(), NumberRange(min=0)], default=0)
    weak_hives = IntegerField('Weak Hives', validators=[Optional(), NumberRange(min=0)], default=0)

class IndividualHiveForm(FlaskForm):
    """Form for adding/editing individual hives"""
    hive_number = StringField('Hive Number/ID', validators=[DataRequired(), Length(max=50)])
    status = SelectField('Status', choices=[
        ('healthy', 'Healthy'),
        ('infected', 'Infected'),
        ('quarantine', 'Quarantine'),
        ('weak', 'Weak'),
        ('queenless', 'Queenless'),
        ('dead', 'Dead')
    ], default='healthy')
    notes = TextAreaField('Notes', validators=[Optional()])

class HiveActionForm(FlaskForm):
    """Form for logging hive actions"""
    cluster_id = SelectField('Hive Cluster', coerce=int, validators=[DataRequired()])
    individual_hive_id = SelectField('Individual Hive (Optional)', coerce=int, validators=[Optional()])
    task_type_id = SelectField('Task Type', coerce=int, validators=[Optional()])
    custom_task_name = StringField('Custom Task Name', validators=[Optional(), Length(max=100)])
    description = TextAreaField('Description/Notes', validators=[Optional()])
    action_date = DateTimeField('Action Date', format='%Y-%m-%d', validators=[Optional()])


class DiseaseReportForm(FlaskForm):
    """Form for disease reporting"""
    cluster_id = SelectField('Hive Cluster', coerce=int, validators=[DataRequired()])
    afb_count = IntegerField('AFB (American Foulbrood)', validators=[Optional(), NumberRange(min=0)], default=0)
    varroa_count = IntegerField('Varroa Mites', validators=[Optional(), NumberRange(min=0)], default=0)
    chalkbrood_count = IntegerField('Chalkbrood', validators=[Optional(), NumberRange(min=0)], default=0)
    sacbrood_count = IntegerField('Sacbrood', validators=[Optional(), NumberRange(min=0)], default=0)
    dwv_count = IntegerField('DWV (Deformed Wing Virus)', validators=[Optional(), NumberRange(min=0)], default=0)
    notes = TextAreaField('Additional Notes', validators=[Optional()])
    report_date = DateTimeField('Report Date', format='%Y-%m-%d', validators=[Optional()])


class FieldReportForm(FlaskForm):
    """Form for quick field reporting with checkboxes and numbers"""
    cluster_id = SelectField('Site', coerce=int, validators=[DataRequired()])
    
    # Quick action checkboxes
    inspection = BooleanField('Inspection')
    feeding = BooleanField('Feeding')
    treatment = BooleanField('Treatment')
    harvest = BooleanField('Harvest')
    maintenance = BooleanField('Maintenance')
    
    # Hive counts
    strong_hives = IntegerField('Strong Hives', validators=[Optional(), NumberRange(min=0)], default=0)
    medium_hives = IntegerField('Medium Hives', validators=[Optional(), NumberRange(min=0)], default=0)
    weak_hives = IntegerField('Weak Hives', validators=[Optional(), NumberRange(min=0)], default=0)
    
    # Disease counts
    afb_count = IntegerField('AFB', validators=[Optional(), NumberRange(min=0)], default=0)
    varroa_count = IntegerField('Varroa', validators=[Optional(), NumberRange(min=0)], default=0)
    chalkbrood_count = IntegerField('Chalkbrood', validators=[Optional(), NumberRange(min=0)], default=0)
    sacbrood_count = IntegerField('Sacbrood', validators=[Optional(), NumberRange(min=0)], default=0)
    dwv_count = IntegerField('DWV', validators=[Optional(), NumberRange(min=0)], default=0)
    
    # Notes
    notes = TextAreaField('Notes', validators=[Optional()])


class ScheduledTaskForm(FlaskForm):
    """Form for creating/editing scheduled tasks"""
    task_template_id = SelectField('Task Template', coerce=int, validators=[DataRequired()])
    title = StringField('Task Title', validators=[DataRequired(), Length(max=200)])
    description = TextAreaField('Description', validators=[Optional()])
    
    # Scheduling
    scheduled_date = DateField('Scheduled Date', validators=[DataRequired()])
    scheduled_time = TimeField('Scheduled Time', validators=[Optional()])
    due_date = DateField('Due Date', validators=[Optional()])
    estimated_duration = IntegerField('Estimated Duration (minutes)', validators=[Optional(), NumberRange(min=1, max=1440)], default=60)
    
    # Status and priority
    priority = SelectField('Priority', choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent')
    ], default='medium')
    
    # Assignment
    assigned_to_cluster_id = SelectField('Assign to Cluster (Optional)', coerce=int, validators=[Optional()])
    assigned_to_hive_id = SelectField('Assign to Individual Hive (Optional)', coerce=int, validators=[Optional()])
    
    # Recurrence
    is_recurring = BooleanField('Make this a recurring task')
    recurrence_pattern = SelectField('Recurrence Pattern', choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly')
    ], validators=[Optional()])
    recurrence_interval = IntegerField('Recurrence Interval', validators=[Optional(), NumberRange(min=1, max=12)], default=1)
    recurrence_end_date = DateField('Recurrence End Date', validators=[Optional()])


class TaskTemplateForm(FlaskForm):
    """Form for creating/editing task templates"""
    name = StringField('Template Name', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[Optional()])
    category = SelectField('Category', choices=[
        ('Disease Management', 'Disease Management'),
        ('Inspection', 'Inspection'),
        ('Feeding', 'Feeding'),
        ('Harvest', 'Harvest'),
        ('Treatment', 'Treatment'),
        ('Seasonal', 'Seasonal'),
        ('Maintenance', 'Maintenance'),
        ('Transport', 'Transport'),
        ('Queen Management', 'Queen Management'),
        ('Other', 'Other')
    ], validators=[DataRequired()])
    
    # Template details
    estimated_duration = IntegerField('Estimated Duration (minutes)', validators=[Optional(), NumberRange(min=1, max=1440)], default=60)
    priority = SelectField('Default Priority', choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent')
    ], default='medium')
    
    # Seasonal settings
    is_seasonal = BooleanField('This is a seasonal task')
    season_months = StringField('Season Months (comma-separated, 1-12)', validators=[Optional()])
    
    # Weather requirements
    weather_dependent = BooleanField('Task is weather dependent')
    min_temperature = IntegerField('Minimum Temperature (°C)', validators=[Optional(), NumberRange(min=-50, max=50)])
    max_temperature = IntegerField('Maximum Temperature (°C)', validators=[Optional(), NumberRange(min=-50, max=50)])
    avoid_rain = BooleanField('Avoid rainy weather')
    
    # Timing constraints
    best_time_of_day = SelectField('Best Time of Day', choices=[
        ('any', 'Any Time'),
        ('morning', 'Morning'),
        ('afternoon', 'Afternoon'),
        ('evening', 'Evening')
    ], default='any')
    
    # Checklist items
    checklist_items = TextAreaField('Checklist Items (one per line)', validators=[Optional()])
    equipment_needed = TextAreaField('Equipment Needed (one per line)', validators=[Optional()])
    supplies_needed = TextAreaField('Supplies Needed (one per line)', validators=[Optional()])


class QuickScheduleForm(FlaskForm):
    """Form for quick task scheduling"""
    task_template_id = SelectField('Task Type', coerce=int, validators=[DataRequired()])
    
    # Assignment options
    assign_to_all_clusters = BooleanField('Assign to all clusters')
    selected_clusters = SelectField('Select Clusters', choices=[], validators=[Optional()], multiple=True)
    selected_hives = SelectField('Select Individual Hives', choices=[], validators=[Optional()], multiple=True)
    
    # Scheduling options
    schedule_type = SelectField('Schedule Type', choices=[
        ('single', 'Single Task'),
        ('recurring', 'Recurring Task')
    ], default='single')
    
    # Single task scheduling
    scheduled_date = DateField('Scheduled Date', validators=[Optional()])
    scheduled_time = TimeField('Scheduled Time', validators=[Optional()])
    
    # Recurring task scheduling
    recurrence_pattern = SelectField('Recurrence Pattern', choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly')
    ], validators=[Optional()])
    recurrence_interval = IntegerField('Every X periods', validators=[Optional(), NumberRange(min=1, max=12)], default=1)
    recurrence_end_date = DateField('End Date', validators=[Optional()])
    
    # Task settings
    priority = SelectField('Priority', choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent')
    ], default='medium')


class TaskAssignmentForm(FlaskForm):
    """Form for managing task assignments"""
    scheduled_task_id = SelectField('Scheduled Task', coerce=int, validators=[DataRequired()])
    target_type = SelectField('Target Type', choices=[
        ('cluster', 'Cluster'),
        ('individual_hive', 'Individual Hive')
    ], validators=[DataRequired()])
    target_id = SelectField('Target', coerce=int, validators=[DataRequired()])
    notes = TextAreaField('Assignment Notes', validators=[Optional()])
    estimated_duration = IntegerField('Estimated Duration Override (minutes)', validators=[Optional(), NumberRange(min=1, max=1440)])


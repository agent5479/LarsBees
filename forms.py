from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, FloatField, IntegerField, SelectField, BooleanField, DateTimeField
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


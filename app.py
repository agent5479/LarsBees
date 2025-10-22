import os
from datetime import datetime
import csv
import io
from flask import Flask, render_template, redirect, url_for, flash, request, jsonify, make_response
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash
from config import config
from models import db, User, HiveCluster, IndividualHive, TaskType, HiveAction, DiseaseReport, init_default_tasks
from forms import LoginForm, RegistrationForm, HiveClusterForm, IndividualHiveForm, HiveActionForm, DiseaseReportForm, FieldReportForm

def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'login'
    login_manager.login_message = 'Please log in to access this page.'
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Create database tables
    with app.app_context():
        db.create_all()
        init_default_tasks(db)
        
        # Debug: Create a test user if none exists
        if app.config['DEBUG'] and User.query.count() == 0:
            test_user = User(username='admin', email='admin@larsbees.com')
            test_user.set_password('admin123')
            db.session.add(test_user)
            db.session.commit()
            print("DEBUG: Created test user - username: admin, password: admin123")
    
    # Routes
    @app.route('/')
    def index():
        """Landing page"""
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))
        return render_template('landing.html')
    
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        """User login"""
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))
        
        form = LoginForm()
        if form.validate_on_submit():
            user = User.query.filter_by(username=form.username.data).first()
            if user and user.check_password(form.password.data):
                login_user(user, remember=form.remember_me.data)
                next_page = request.args.get('next')
                flash(f'Welcome back, {user.username}!', 'success')
                return redirect(next_page) if next_page else redirect(url_for('dashboard'))
            else:
                flash('Invalid username or password', 'danger')
        
        return render_template('login.html', form=form)
    
    @app.route('/register', methods=['GET', 'POST'])
    def register():
        """User registration"""
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))
        
        form = RegistrationForm()
        if form.validate_on_submit():
            user = User(username=form.username.data, email=form.email.data)
            user.set_password(form.password.data)
            db.session.add(user)
            db.session.commit()
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
        
        return render_template('register.html', form=form)
    
    @app.route('/logout')
    @login_required
    def logout():
        """User logout"""
        logout_user()
        flash('You have been logged out.', 'info')
        return redirect(url_for('login'))
    
    @app.route('/dashboard')
    @login_required
    def dashboard():
        """Main dashboard"""
        clusters = HiveCluster.query.filter_by(user_id=current_user.id, is_active=True).all()
        recent_actions = HiveAction.query.filter_by(user_id=current_user.id, is_archived=False)\
            .order_by(HiveAction.action_date.desc()).limit(10).all()
        
        stats = {
            'total_clusters': len(clusters),
            'total_hives': sum(c.hive_count for c in clusters),
            'recent_actions_count': len(recent_actions)
        }
        
        return render_template('dashboard.html', 
                             clusters=clusters, 
                             recent_actions=recent_actions,
                             stats=stats,
                             google_maps_key=app.config['GOOGLE_MAPS_API_KEY'])
    
    @app.route('/clusters')
    @login_required
    def clusters():
        """View all hive clusters"""
        clusters = HiveCluster.query.filter_by(user_id=current_user.id, is_active=True)\
            .order_by(HiveCluster.created_at.desc()).all()
        return render_template('clusters.html', 
                             clusters=clusters,
                             google_maps_key=app.config['GOOGLE_MAPS_API_KEY'])
    
    @app.route('/cluster/add', methods=['GET', 'POST'])
    @login_required
    def add_cluster():
        """Add new hive cluster"""
        form = HiveClusterForm()
        if form.validate_on_submit():
            cluster = HiveCluster(
                user_id=current_user.id,
                name=form.name.data,
                description=form.description.data,
                latitude=form.latitude.data,
                longitude=form.longitude.data,
                hive_count=form.hive_count.data,
                harvest_timeline=form.harvest_timeline.data,
                sugar_requirements=form.sugar_requirements.data,
                notes=form.notes.data,
                # Landowner information
                landowner_name=form.landowner_name.data,
                landowner_phone=form.landowner_phone.data,
                landowner_email=form.landowner_email.data,
                landowner_address=form.landowner_address.data,
                # Site classification
                site_type=form.site_type.data,
                access_type=form.access_type.data,
                contact_before_visit=form.contact_before_visit.data,
                is_quarantine=form.is_quarantine.data,
                # Hive setup details
                single_brood_boxes=form.single_brood_boxes.data,
                double_brood_boxes=form.double_brood_boxes.data,
                nucs=form.nucs.data,
                dead_hives=form.dead_hives.data,
                top_splits=form.top_splits.data,
                # Hive strength ratings
                strong_hives=form.strong_hives.data,
                medium_hives=form.medium_hives.data,
                weak_hives=form.weak_hives.data
            )
            db.session.add(cluster)
            db.session.commit()
            flash(f'Hive cluster "{cluster.name}" added successfully!', 'success')
            return redirect(url_for('clusters'))
        
        return render_template('cluster_form.html', form=form, title='Add Hive Cluster')
    
    @app.route('/cluster/<int:cluster_id>/edit', methods=['GET', 'POST'])
    @login_required
    def edit_cluster(cluster_id):
        """Edit hive cluster"""
        cluster = HiveCluster.query.filter_by(id=cluster_id, user_id=current_user.id).first_or_404()
        form = HiveClusterForm(obj=cluster)
        
        if form.validate_on_submit():
            cluster.name = form.name.data
            cluster.description = form.description.data
            cluster.latitude = form.latitude.data
            cluster.longitude = form.longitude.data
            cluster.hive_count = form.hive_count.data
            cluster.harvest_timeline = form.harvest_timeline.data
            cluster.sugar_requirements = form.sugar_requirements.data
            cluster.notes = form.notes.data
            # Landowner information
            cluster.landowner_name = form.landowner_name.data
            cluster.landowner_phone = form.landowner_phone.data
            cluster.landowner_email = form.landowner_email.data
            cluster.landowner_address = form.landowner_address.data
            # Site classification
            cluster.site_type = form.site_type.data
            cluster.access_type = form.access_type.data
            cluster.contact_before_visit = form.contact_before_visit.data
            cluster.is_quarantine = form.is_quarantine.data
            # Hive setup details
            cluster.single_brood_boxes = form.single_brood_boxes.data
            cluster.double_brood_boxes = form.double_brood_boxes.data
            cluster.nucs = form.nucs.data
            cluster.dead_hives = form.dead_hives.data
            cluster.top_splits = form.top_splits.data
            # Hive strength ratings
            cluster.strong_hives = form.strong_hives.data
            cluster.medium_hives = form.medium_hives.data
            cluster.weak_hives = form.weak_hives.data
            cluster.updated_at = datetime.utcnow()
            db.session.commit()
            flash(f'Hive cluster "{cluster.name}" updated successfully!', 'success')
            return redirect(url_for('cluster_detail', cluster_id=cluster.id))
        
        return render_template('cluster_form.html', form=form, title='Edit Hive Cluster', cluster=cluster)
    
    @app.route('/cluster/<int:cluster_id>')
    @login_required
    def cluster_detail(cluster_id):
        """View cluster details"""
        cluster = HiveCluster.query.filter_by(id=cluster_id, user_id=current_user.id).first_or_404()
        individual_hives = IndividualHive.query.filter_by(cluster_id=cluster_id, is_active=True).all()
        actions = HiveAction.query.filter_by(cluster_id=cluster_id, is_archived=False)\
            .order_by(HiveAction.action_date.desc()).all()
        disease_reports = DiseaseReport.query.filter_by(cluster_id=cluster_id)\
            .order_by(DiseaseReport.report_date.desc()).limit(5).all()
        
        return render_template('cluster_detail.html', 
                             cluster=cluster, 
                             individual_hives=individual_hives,
                             actions=actions,
                             disease_reports=disease_reports,
                             google_maps_key=app.config['GOOGLE_MAPS_API_KEY'])
    
    @app.route('/cluster/<int:cluster_id>/delete', methods=['POST'])
    @login_required
    def delete_cluster(cluster_id):
        """Delete (deactivate) hive cluster"""
        cluster = HiveCluster.query.filter_by(id=cluster_id, user_id=current_user.id).first_or_404()
        cluster.is_active = False
        db.session.commit()
        flash(f'Hive cluster "{cluster.name}" has been deleted.', 'info')
        return redirect(url_for('clusters'))
    
    @app.route('/cluster/<int:cluster_id>/hive/add', methods=['GET', 'POST'])
    @login_required
    def add_individual_hive(cluster_id):
        """Add individual hive to cluster"""
        cluster = HiveCluster.query.filter_by(id=cluster_id, user_id=current_user.id).first_or_404()
        form = IndividualHiveForm()
        
        if form.validate_on_submit():
            hive = IndividualHive(
                cluster_id=cluster_id,
                hive_number=form.hive_number.data,
                status=form.status.data,
                notes=form.notes.data
            )
            db.session.add(hive)
            db.session.commit()
            flash(f'Individual hive "{hive.hive_number}" added to cluster "{cluster.name}"', 'success')
            return redirect(url_for('cluster_detail', cluster_id=cluster_id))
        
        return render_template('hive_form.html', form=form, cluster=cluster, title='Add Individual Hive')
    
    @app.route('/hive/<int:hive_id>/edit', methods=['GET', 'POST'])
    @login_required
    def edit_individual_hive(hive_id):
        """Edit individual hive"""
        hive = IndividualHive.query.get_or_404(hive_id)
        cluster = HiveCluster.query.filter_by(id=hive.cluster_id, user_id=current_user.id).first_or_404()
        form = IndividualHiveForm(obj=hive)
        
        if form.validate_on_submit():
            hive.hive_number = form.hive_number.data
            hive.status = form.status.data
            hive.notes = form.notes.data
            hive.updated_at = datetime.utcnow()
            db.session.commit()
            flash(f'Individual hive "{hive.hive_number}" updated successfully!', 'success')
            return redirect(url_for('cluster_detail', cluster_id=cluster.id))
        
        return render_template('hive_form.html', form=form, cluster=cluster, hive=hive, title='Edit Individual Hive')
    
    @app.route('/actions')
    @login_required
    def actions():
        """View all actions"""
        page = request.args.get('page', 1, type=int)
        show_archived = request.args.get('archived', 'false') == 'true'
        
        query = HiveAction.query.filter_by(user_id=current_user.id)
        if not show_archived:
            query = query.filter_by(is_archived=False)
        
        actions = query.order_by(HiveAction.action_date.desc())\
            .paginate(page=page, per_page=app.config['ACTIONS_PER_PAGE'], error_out=False)
        
        return render_template('actions.html', actions=actions, show_archived=show_archived)
    
    @app.route('/action/log', methods=['GET', 'POST'])
    @login_required
    def log_action():
        """Log new hive action"""
        form = HiveActionForm()
        
        # Populate cluster choices
        clusters = HiveCluster.query.filter_by(user_id=current_user.id, is_active=True).all()
        form.cluster_id.choices = [(c.id, c.name) for c in clusters]
        
        # Populate task type choices
        task_types = TaskType.query.filter_by(is_active=True).order_by(TaskType.order).all()
        form.task_type_id.choices = [(0, '-- Custom Task --')] + [(t.id, f"{t.category.title()}: {t.name}") for t in task_types]
        
        if form.validate_on_submit():
            # Get task name
            if form.task_type_id.data and form.task_type_id.data > 0:
                task_type = TaskType.query.get(form.task_type_id.data)
                task_name = task_type.name
                task_type_id = task_type.id
            else:
                task_name = form.custom_task_name.data
                task_type_id = None
            
            # Get individual hive if specified
            individual_hive_id = form.individual_hive_id.data if form.individual_hive_id.data else None
            
            action = HiveAction(
                cluster_id=form.cluster_id.data,
                individual_hive_id=individual_hive_id,
                user_id=current_user.id,
                task_type_id=task_type_id,
                task_name=task_name,
                description=form.description.data,
                action_date=form.action_date.data if form.action_date.data else datetime.utcnow()
            )
            db.session.add(action)
            db.session.commit()
            flash(f'Action "{task_name}" logged successfully!', 'success')
            return redirect(url_for('actions'))
        
        return render_template('action_form.html', form=form, task_types=task_types)
    
    @app.route('/action/log-quick', methods=['POST'])
    @login_required
    def log_quick_action():
        """Quick action logging via AJAX"""
        data = request.get_json()
        
        task_ids = data.get('task_ids', [])
        cluster_id = data.get('cluster_id')
        individual_hive_id = data.get('individual_hive_id')
        action_date = datetime.fromisoformat(data.get('action_date')) if data.get('action_date') else datetime.utcnow()
        
        if not task_ids or not cluster_id:
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        # Verify cluster belongs to user
        cluster = HiveCluster.query.filter_by(id=cluster_id, user_id=current_user.id).first()
        if not cluster:
            return jsonify({'success': False, 'message': 'Invalid cluster'}), 404
        
        actions_logged = []
        for task_id in task_ids:
            task = TaskType.query.get(task_id)
            if task:
                action = HiveAction(
                    cluster_id=cluster_id,
                    individual_hive_id=individual_hive_id,
                    user_id=current_user.id,
                    task_type_id=task.id,
                    task_name=task.name,
                    action_date=action_date
                )
                db.session.add(action)
                actions_logged.append(task.name)
        
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'message': f'{len(actions_logged)} action(s) logged successfully',
            'actions': actions_logged
        })
    
    @app.route('/action/<int:action_id>/archive', methods=['POST'])
    @login_required
    def archive_action(action_id):
        """Archive an action"""
        action = HiveAction.query.filter_by(id=action_id, user_id=current_user.id).first_or_404()
        action.is_archived = True
        db.session.commit()
        return jsonify({'success': True, 'message': 'Action archived'})
    
    @app.route('/action/<int:action_id>/unarchive', methods=['POST'])
    @login_required
    def unarchive_action(action_id):
        """Unarchive an action"""
        action = HiveAction.query.filter_by(id=action_id, user_id=current_user.id).first_or_404()
        action.is_archived = False
        db.session.commit()
        return jsonify({'success': True, 'message': 'Action unarchived'})
    
    @app.route('/api/clusters')
    @login_required
    def api_clusters():
        """API endpoint for cluster data (for maps)"""
        clusters = HiveCluster.query.filter_by(user_id=current_user.id, is_active=True).all()
        return jsonify([{
            'id': c.id,
            'name': c.name,
            'description': c.description,
            'latitude': c.latitude,
            'longitude': c.longitude,
            'hive_count': c.hive_count,
            'harvest_timeline': c.harvest_timeline,
            'sugar_requirements': c.sugar_requirements
        } for c in clusters])
    
    @app.route('/api/cluster/<int:cluster_id>/hives')
    @login_required
    def api_cluster_hives(cluster_id):
        """API endpoint for individual hives in a cluster"""
        cluster = HiveCluster.query.filter_by(id=cluster_id, user_id=current_user.id).first_or_404()
        hives = IndividualHive.query.filter_by(cluster_id=cluster_id, is_active=True).all()
        
        return jsonify([{
            'id': h.id,
            'hive_number': h.hive_number,
            'status': h.status,
            'notes': h.notes
        } for h in hives])
    
    @app.route('/disease-report', methods=['GET', 'POST'])
    @login_required
    def disease_report():
        """Disease reporting form"""
        form = DiseaseReportForm()
        
        # Populate cluster choices
        clusters = HiveCluster.query.filter_by(user_id=current_user.id, is_active=True).all()
        form.cluster_id.choices = [(c.id, c.name) for c in clusters]
        
        if form.validate_on_submit():
            report = DiseaseReport(
                cluster_id=form.cluster_id.data,
                user_id=current_user.id,
                afb_count=form.afb_count.data,
                varroa_count=form.varroa_count.data,
                chalkbrood_count=form.chalkbrood_count.data,
                sacbrood_count=form.sacbrood_count.data,
                dwv_count=form.dwv_count.data,
                notes=form.notes.data,
                report_date=form.report_date.data if form.report_date.data else datetime.utcnow()
            )
            db.session.add(report)
            db.session.commit()
            flash('Disease report submitted successfully!', 'success')
            return redirect(url_for('cluster_detail', cluster_id=form.cluster_id.data))
        
        return render_template('disease_report.html', form=form)
    
    @app.route('/field-report', methods=['GET', 'POST'])
    @login_required
    def field_report():
        """Quick field reporting interface"""
        form = FieldReportForm()
        
        # Populate cluster choices
        clusters = HiveCluster.query.filter_by(user_id=current_user.id, is_active=True).all()
        form.cluster_id.choices = [(c.id, c.name) for c in clusters]
        
        if form.validate_on_submit():
            # Log actions based on checkboxes
            cluster_id = form.cluster_id.data
            cluster = HiveCluster.query.get(cluster_id)
            
            actions_logged = []
            if form.inspection.data:
                action = HiveAction(
                    cluster_id=cluster_id,
                    user_id=current_user.id,
                    task_name='Field Inspection',
                    description='Quick field inspection',
                    action_date=datetime.utcnow()
                )
                db.session.add(action)
                actions_logged.append('Inspection')
            
            if form.feeding.data:
                action = HiveAction(
                    cluster_id=cluster_id,
                    user_id=current_user.id,
                    task_name='Field Feeding',
                    description='Quick feeding activity',
                    action_date=datetime.utcnow()
                )
                db.session.add(action)
                actions_logged.append('Feeding')
            
            if form.treatment.data:
                action = HiveAction(
                    cluster_id=cluster_id,
                    user_id=current_user.id,
                    task_name='Field Treatment',
                    description='Quick treatment application',
                    action_date=datetime.utcnow()
                )
                db.session.add(action)
                actions_logged.append('Treatment')
            
            if form.harvest.data:
                action = HiveAction(
                    cluster_id=cluster_id,
                    user_id=current_user.id,
                    task_name='Field Harvest',
                    description='Quick harvest activity',
                    action_date=datetime.utcnow()
                )
                db.session.add(action)
                actions_logged.append('Harvest')
            
            if form.maintenance.data:
                action = HiveAction(
                    cluster_id=cluster_id,
                    user_id=current_user.id,
                    task_name='Field Maintenance',
                    description='Quick maintenance activity',
                    action_date=datetime.utcnow()
                )
                db.session.add(action)
                actions_logged.append('Maintenance')
            
            # Update cluster hive counts and strength ratings
            cluster.strong_hives = form.strong_hives.data
            cluster.medium_hives = form.medium_hives.data
            cluster.weak_hives = form.weak_hives.data
            
            # Create disease report if any diseases reported
            if any([form.afb_count.data, form.varroa_count.data, form.chalkbrood_count.data, 
                   form.sacbrood_count.data, form.dwv_count.data]):
                disease_report = DiseaseReport(
                    cluster_id=cluster_id,
                    user_id=current_user.id,
                    afb_count=form.afb_count.data,
                    varroa_count=form.varroa_count.data,
                    chalkbrood_count=form.chalkbrood_count.data,
                    sacbrood_count=form.sacbrood_count.data,
                    dwv_count=form.dwv_count.data,
                    notes=form.notes.data,
                    report_date=datetime.utcnow()
                )
                db.session.add(disease_report)
            
            db.session.commit()
            
            flash(f'Field report submitted! Actions logged: {", ".join(actions_logged) if actions_logged else "None"}', 'success')
            return redirect(url_for('cluster_detail', cluster_id=cluster_id))
        
        return render_template('field_report.html', form=form)
    
    @app.route('/export/clusters')
    @login_required
    def export_clusters():
        """Export all clusters with comprehensive data"""
        clusters = HiveCluster.query.filter_by(user_id=current_user.id, is_active=True).all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header with all new fields
        headers = [
            'Cluster ID', 'Name', 'Description', 'Latitude', 'Longitude', 'Hive Count',
            'Harvest Timeline', 'Sugar Requirements', 'Notes',
            # Landowner Information
            'Landowner Name', 'Landowner Phone', 'Landowner Email', 'Landowner Address',
            # Site Classification
            'Site Type', 'Access Type', 'Contact Before Visit', 'Is Quarantine',
            # Hive Setup Details
            'Single Brood Boxes', 'Double Brood Boxes', 'Nucs', 'Dead Hives', 'Top Splits',
            # Hive Strength Ratings
            'Strong Hives', 'Medium Hives', 'Weak Hives',
            # Timestamps
            'Created At', 'Updated At'
        ]
        writer.writerow(headers)
        
        # Write data
        for cluster in clusters:
            writer.writerow([
                cluster.id,
                cluster.name,
                cluster.description or '',
                cluster.latitude,
                cluster.longitude,
                cluster.hive_count,
                cluster.harvest_timeline or '',
                cluster.sugar_requirements or '',
                cluster.notes or '',
                # Landowner Information
                cluster.landowner_name or '',
                cluster.landowner_phone or '',
                cluster.landowner_email or '',
                cluster.landowner_address or '',
                # Site Classification
                cluster.site_type or '',
                cluster.access_type or '',
                cluster.contact_before_visit,
                cluster.is_quarantine,
                # Hive Setup Details
                cluster.single_brood_boxes or 0,
                cluster.double_brood_boxes or 0,
                cluster.nucs or 0,
                cluster.dead_hives or 0,
                cluster.top_splits or 0,
                # Hive Strength Ratings
                cluster.strong_hives or 0,
                cluster.medium_hives or 0,
                cluster.weak_hives or 0,
                # Timestamps
                cluster.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                cluster.updated_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        output.seek(0)
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=clusters_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        return response
    
    @app.route('/export/actions')
    @login_required
    def export_actions():
        """Export all actions with comprehensive data"""
        actions = HiveAction.query.filter_by(user_id=current_user.id, is_archived=False)\
            .order_by(HiveAction.action_date.desc()).all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        headers = [
            'Action ID', 'Cluster Name', 'Individual Hive', 'Task Name', 'Task Category',
            'Description', 'Action Date', 'Created At', 'Is Archived'
        ]
        writer.writerow(headers)
        
        # Write data
        for action in actions:
            writer.writerow([
                action.id,
                action.cluster.name,
                action.individual_hive.hive_number if action.individual_hive else '',
                action.task_name,
                action.task_type.category if action.task_type else '',
                action.description or '',
                action.action_date.strftime('%Y-%m-%d %H:%M:%S'),
                action.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                action.is_archived
            ])
        
        output.seek(0)
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=actions_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        return response
    
    @app.route('/export/disease-reports')
    @login_required
    def export_disease_reports():
        """Export all disease reports"""
        disease_reports = DiseaseReport.query.join(HiveCluster)\
            .filter(HiveCluster.user_id == current_user.id)\
            .order_by(DiseaseReport.report_date.desc()).all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        headers = [
            'Report ID', 'Cluster Name', 'Report Date', 'AFB Count', 'Varroa Count',
            'Chalkbrood Count', 'Sacbrood Count', 'DWV Count', 'Notes', 'Created At'
        ]
        writer.writerow(headers)
        
        # Write data
        for report in disease_reports:
            writer.writerow([
                report.id,
                report.cluster.name,
                report.report_date.strftime('%Y-%m-%d %H:%M:%S'),
                report.afb_count,
                report.varroa_count,
                report.chalkbrood_count,
                report.sacbrood_count,
                report.dwv_count,
                report.notes or '',
                report.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        output.seek(0)
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=disease_reports_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        return response
    
    @app.route('/export/individual-hives')
    @login_required
    def export_individual_hives():
        """Export all individual hives"""
        hives = IndividualHive.query.join(HiveCluster)\
            .filter(HiveCluster.user_id == current_user.id, IndividualHive.is_active == True)\
            .order_by(HiveCluster.name, IndividualHive.hive_number).all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        headers = [
            'Hive ID', 'Cluster Name', 'Hive Number', 'Status', 'Notes',
            'Created At', 'Updated At', 'Is Active'
        ]
        writer.writerow(headers)
        
        # Write data
        for hive in hives:
            writer.writerow([
                hive.id,
                hive.cluster.name,
                hive.hive_number,
                hive.status,
                hive.notes or '',
                hive.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                hive.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
                hive.is_active
            ])
        
        output.seek(0)
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=individual_hives_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        return response
    
    @app.route('/export/comprehensive')
    @login_required
    def export_comprehensive():
        """Export comprehensive data including all new fields"""
        clusters = HiveCluster.query.filter_by(user_id=current_user.id, is_active=True).all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write comprehensive header
        headers = [
            # Cluster Basic Info
            'Cluster ID', 'Cluster Name', 'Description', 'Latitude', 'Longitude', 'Hive Count',
            'Harvest Timeline', 'Sugar Requirements', 'Cluster Notes',
            # Landowner Information
            'Landowner Name', 'Landowner Phone', 'Landowner Email', 'Landowner Address',
            # Site Classification
            'Site Type', 'Access Type', 'Contact Before Visit', 'Is Quarantine',
            # Hive Setup Details
            'Single Brood Boxes', 'Double Brood Boxes', 'Nucs', 'Dead Hives', 'Top Splits',
            # Hive Strength Ratings
            'Strong Hives', 'Medium Hives', 'Weak Hives',
            # Cluster Timestamps
            'Cluster Created At', 'Cluster Updated At',
            # Individual Hives Summary
            'Individual Hives Count', 'Healthy Hives', 'Infected Hives', 'Quarantine Hives', 'Weak Hives', 'Queenless Hives', 'Dead Hives',
            # Recent Actions Summary
            'Total Actions', 'Recent Actions (Last 30 days)', 'Last Action Date', 'Last Action Type',
            # Disease Reports Summary
            'Total Disease Reports', 'Latest Disease Report Date', 'AFB Total', 'Varroa Total', 'Chalkbrood Total', 'Sacbrood Total', 'DWV Total'
        ]
        writer.writerow(headers)
        
        # Write comprehensive data for each cluster
        for cluster in clusters:
            # Get individual hives data
            individual_hives = IndividualHive.query.filter_by(cluster_id=cluster.id, is_active=True).all()
            hive_status_counts = {}
            for hive in individual_hives:
                hive_status_counts[hive.status] = hive_status_counts.get(hive.status, 0) + 1
            
            # Get actions data
            actions = HiveAction.query.filter_by(cluster_id=cluster.id, is_archived=False).all()
            recent_actions = HiveAction.query.filter_by(cluster_id=cluster.id, is_archived=False)\
                .filter(HiveAction.action_date >= datetime.utcnow().replace(day=1)).all()
            
            last_action = HiveAction.query.filter_by(cluster_id=cluster.id, is_archived=False)\
                .order_by(HiveAction.action_date.desc()).first()
            
            # Get disease reports data
            disease_reports = DiseaseReport.query.filter_by(cluster_id=cluster.id).all()
            latest_disease_report = DiseaseReport.query.filter_by(cluster_id=cluster.id)\
                .order_by(DiseaseReport.report_date.desc()).first()
            
            # Calculate disease totals
            afb_total = sum(report.afb_count for report in disease_reports)
            varroa_total = sum(report.varroa_count for report in disease_reports)
            chalkbrood_total = sum(report.chalkbrood_count for report in disease_reports)
            sacbrood_total = sum(report.sacbrood_count for report in disease_reports)
            dwv_total = sum(report.dwv_count for report in disease_reports)
            
            writer.writerow([
                # Cluster Basic Info
                cluster.id,
                cluster.name,
                cluster.description or '',
                cluster.latitude,
                cluster.longitude,
                cluster.hive_count,
                cluster.harvest_timeline or '',
                cluster.sugar_requirements or '',
                cluster.notes or '',
                # Landowner Information
                cluster.landowner_name or '',
                cluster.landowner_phone or '',
                cluster.landowner_email or '',
                cluster.landowner_address or '',
                # Site Classification
                cluster.site_type or '',
                cluster.access_type or '',
                cluster.contact_before_visit,
                cluster.is_quarantine,
                # Hive Setup Details
                cluster.single_brood_boxes or 0,
                cluster.double_brood_boxes or 0,
                cluster.nucs or 0,
                cluster.dead_hives or 0,
                cluster.top_splits or 0,
                # Hive Strength Ratings
                cluster.strong_hives or 0,
                cluster.medium_hives or 0,
                cluster.weak_hives or 0,
                # Cluster Timestamps
                cluster.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                cluster.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
                # Individual Hives Summary
                len(individual_hives),
                hive_status_counts.get('healthy', 0),
                hive_status_counts.get('infected', 0),
                hive_status_counts.get('quarantine', 0),
                hive_status_counts.get('weak', 0),
                hive_status_counts.get('queenless', 0),
                hive_status_counts.get('dead', 0),
                # Recent Actions Summary
                len(actions),
                len(recent_actions),
                last_action.action_date.strftime('%Y-%m-%d %H:%M:%S') if last_action else '',
                last_action.task_name if last_action else '',
                # Disease Reports Summary
                len(disease_reports),
                latest_disease_report.report_date.strftime('%Y-%m-%d %H:%M:%S') if latest_disease_report else '',
                afb_total,
                varroa_total,
                chalkbrood_total,
                sacbrood_total,
                dwv_total
            ])
        
        output.seek(0)
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=comprehensive_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        return response
    
    @app.route('/export-management')
    @login_required
    def export_management():
        """Export management page"""
        # Get statistics for the export page
        clusters_count = HiveCluster.query.filter_by(user_id=current_user.id, is_active=True).count()
        actions_count = HiveAction.query.filter_by(user_id=current_user.id, is_archived=False).count()
        disease_reports_count = DiseaseReport.query.join(HiveCluster)\
            .filter(HiveCluster.user_id == current_user.id).count()
        individual_hives_count = IndividualHive.query.join(HiveCluster)\
            .filter(HiveCluster.user_id == current_user.id, IndividualHive.is_active == True).count()
        
        stats = {
            'clusters': clusters_count,
            'actions': actions_count,
            'disease_reports': disease_reports_count,
            'individual_hives': individual_hives_count
        }
        
        return render_template('export_management.html', stats=stats)
    
    # Debug routes (only available in debug mode)
    if app.config['DEBUG']:
        @app.route('/debug/db-info')
        def debug_db_info():
            """Debug endpoint to show database information"""
            users = User.query.count()
            clusters = HiveCluster.query.count()
            actions = HiveAction.query.count()
            tasks = TaskType.query.count()
            
            return jsonify({
                'database': app.config['SQLALCHEMY_DATABASE_URI'],
                'users': users,
                'clusters': clusters,
                'actions': actions,
                'task_types': tasks
            })
        
        @app.route('/debug/create-sample-data')
        def debug_create_sample_data():
            """Create sample data for testing"""
            # Create test user if not exists
            user = User.query.filter_by(username='testuser').first()
            if not user:
                user = User(username='testuser', email='test@larsbees.com')
                user.set_password('test123')
                db.session.add(user)
                db.session.commit()
            
            # Create sample clusters
            if HiveCluster.query.filter_by(user_id=user.id).count() == 0:
                clusters_data = [
                    {'name': 'North Field', 'lat': 40.7128, 'lon': -74.0060, 'hives': 5},
                    {'name': 'South Meadow', 'lat': 40.7580, 'lon': -73.9855, 'hives': 8},
                    {'name': 'East Garden', 'lat': 40.7489, 'lon': -73.9680, 'hives': 3}
                ]
                
                for data in clusters_data:
                    cluster = HiveCluster(
                        user_id=user.id,
                        name=data['name'],
                        latitude=data['lat'],
                        longitude=data['lon'],
                        hive_count=data['hives'],
                        harvest_timeline='Spring 2025',
                        sugar_requirements='10kg per month'
                    )
                    db.session.add(cluster)
                
                db.session.commit()
            
            return jsonify({'success': True, 'message': 'Sample data created'})
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=app.config['DEBUG'])


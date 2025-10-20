import os
from datetime import datetime
from flask import Flask, render_template, redirect, url_for, flash, request, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash
from config import config
from models import db, User, HiveCluster, IndividualHive, TaskType, HiveAction, init_default_tasks
from forms import LoginForm, RegistrationForm, HiveClusterForm, IndividualHiveForm, HiveActionForm

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
                notes=form.notes.data
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
        
        return render_template('cluster_detail.html', 
                             cluster=cluster, 
                             individual_hives=individual_hives,
                             actions=actions,
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


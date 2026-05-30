import React, { useState, useEffect } from 'react';
import { Activity, Dumbbell, Bike, Trash2, Plus, Home, BarChart2, User, Clock, Calendar } from 'lucide-react';
import './index.css';

type WorkoutType = 'running' | 'cycling' | 'lifting';

interface Workout {
  id: string;
  type: WorkoutType;
  title: string;
  date: string;
  duration: number;
  calories: number;
  metric1: string; // distance or weight
  metric2: string; // pace or reps
}

export default function App() {
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('workouts-v2');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [activeTab, setActiveTab] = useState('home');
  const [type, setType] = useState<WorkoutType>('running');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [metric1, setMetric1] = useState('');
  const [metric2, setMetric2] = useState('');

  useEffect(() => {
    localStorage.setItem('workouts-v2', JSON.stringify(workouts));
  }, [workouts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !duration || !calories || !metric1 || !metric2) return;

    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      type,
      title,
      date: new Date().toISOString(),
      duration: Number(duration),
      calories: Number(calories),
      metric1,
      metric2
    };

    setWorkouts([newWorkout, ...workouts]);
    setTitle('');
    setDuration('');
    setCalories('');
    setMetric1('');
    setMetric2('');
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const getIcon = (type: WorkoutType) => {
    switch (type) {
      case 'running': return <Activity color="var(--accent)" />;
      case 'cycling': return <Bike color="var(--success)" />;
      case 'lifting': return <Dumbbell color="var(--primary)" />;
    }
  };

  return (
    <div className="app-container">
      <header className="header flex-between">
        <h1>Workout Tracker</h1>
        <div className="badge">Pro</div>
      </header>

      <div className="content">
        {activeTab === 'home' && (
          <div className="dashboard-grid">
            {/* Add Workout Form */}
            <div className="card">
              <h3>Log New Workout</h3>
              <form onSubmit={handleSubmit}>
                <select 
                  className="input aesthetic-select" 
                  value={type} 
                  onChange={(e) => setType(e.target.value as WorkoutType)}
                >
                  <option value="running">🏃 Running</option>
                  <option value="cycling">🚴 Cycling</option>
                  <option value="lifting">🏋️ Weight Lifting</option>
                </select>

                <input 
                  className="input" 
                  placeholder="Workout Title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />

                <div className="row">
                  <input 
                    className="input" 
                    placeholder="Duration (min)" 
                    type="number" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)} 
                    style={{ marginBottom: 0 }}
                  />
                  <input 
                    className="input" 
                    placeholder="Calories" 
                    type="number" 
                    value={calories} 
                    onChange={(e) => setCalories(e.target.value)} 
                    style={{ marginBottom: 0 }}
                  />
                </div>

                <div className="row">
                  <input 
                    className="input" 
                    placeholder={type === 'lifting' ? 'Weight (kg)' : 'Distance (km)'} 
                    value={metric1} 
                    onChange={(e) => setMetric1(e.target.value)} 
                    style={{ marginBottom: 0 }}
                  />
                  <input 
                    className="input" 
                    placeholder={type === 'lifting' ? 'Reps' : 'Pace/Speed'} 
                    value={metric2} 
                    onChange={(e) => setMetric2(e.target.value)} 
                    style={{ marginBottom: 0 }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>
                  <Plus size={20} style={{ marginRight: '8px' }} /> Add Workout
                </button>
              </form>
            </div>

            {/* Workout List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {workouts.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', opacity: 0.7, padding: '40px 20px' }}>
                  <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <p>No workouts yet. Start moving!</p>
                </div>
              ) : (
                workouts.map(workout => (
                  <div key={workout.id} className="card animate-slide-left" style={{ position: 'relative', animationDelay: '0.1s' }}>
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                      <div className="row" style={{ marginBottom: 0 }}>
                        {getIcon(workout.type)}
                        <h3 style={{ margin: 0 }}>{workout.title}</h3>
                      </div>
                      <button className="btn btn-icon" onClick={() => deleteWorkout(workout.id)} style={{ color: 'var(--danger)', background: 'transparent', padding: '8px' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="row flex-between" style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                      <span className="row" style={{ marginBottom: 0, gap: '6px' }}><Clock size={16} /> {workout.duration} min</span>
                      <span className="badge">{workout.calories} kcal</span>
                    </div>

                    <div className="row" style={{ gap: '20px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {workout.type === 'lifting' ? 'Weight' : 'Distance'}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{workout.metric1}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {workout.type === 'lifting' ? 'Reps' : 'Pace'}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{workout.metric2}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="card animate-slide-right">
            <h3>Your Statistics</h3>
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <BarChart2 size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>Keep logging workouts to see your stats here.</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card animate-slide-right">
            <h3>Profile</h3>
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <User size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>Your profile settings will appear here.</p>
            </div>
          </div>
        )}
      </div>

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home />
          Home
        </button>
        <button className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
          <BarChart2 />
          Stats
        </button>
        <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <User />
          Profile
        </button>
      </nav>
    </div>
  );
}

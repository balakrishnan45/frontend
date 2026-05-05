import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { todoAPI } from '../services/api'
import TodoItem from '../components/TodoItem'
import TodoModal from '../components/TodoModal'
import './Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, done
  const [showModal, setShowModal] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const { data } = await todoAPI.getAll()
      setTodos(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData) => {
    const { data } = await todoAPI.create(formData)
    setTodos(prev => [data, ...prev])
    setShowModal(false)
  }

  const handleUpdate = async (formData) => {
    const { data } = await todoAPI.update(editingTodo.id, formData)
    setTodos(prev => prev.map(t => t.id === data.id ? data : t))
    setEditingTodo(null)
    setShowModal(false)
  }

  const handleToggle = async (id) => {
    const { data } = await todoAPI.toggle(id)
    setTodos(prev => prev.map(t => t.id === data.id ? data : t))
  }

  const handleDelete = async (id) => {
    await todoAPI.delete(id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const handleEdit = (todo) => {
    setEditingTodo(todo)
    setShowModal(true)
  }

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  const stats = {
    total: todos.length,
    done: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-text">Todo<b>Space</b></span>
        </div>

        <div className="user-info">
          <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <div>
            <div className="user-name">{user?.username}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {['all', 'active', 'done'].map(f => (
            <button
              key={f}
              className={`nav-item ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              <span className="nav-icon">
                {f === 'all' ? '◈' : f === 'active' ? '◎' : '✓'}
              </span>
              <span>{f === 'all' ? 'All Tasks' : f === 'active' ? 'Active' : 'Completed'}</span>
              <span className="nav-count">
                {f === 'all' ? stats.total : f === 'active' ? stats.active : stats.done}
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-stats">
          <div className="stat-bar">
            <div className="stat-bar-label">
              <span>Progress</span>
              <span>{stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%</span>
            </div>
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill"
                style={{ width: `${stats.total > 0 ? (stats.done / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          ← Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="main-header">
          <div>
            <h2 className="page-title">
              {filter === 'all' ? 'All Tasks' : filter === 'active' ? 'Active Tasks' : 'Completed'}
            </h2>
            <p className="page-sub">{filteredTodos.length} tasks</p>
          </div>
          <button className="add-btn" onClick={() => { setEditingTodo(null); setShowModal(true) }}>
            + New Task
          </button>
        </div>

        <div className="todo-list">
          {loading ? (
            <div className="empty-state">
              <div className="spinner" />
              <p>Loading...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="empty-state fade-in">
              <span className="empty-icon">◈</span>
              <p>{filter === 'done' ? 'No completed tasks yet' : 'No tasks here. Add one!'}</p>
            </div>
          ) : (
            filteredTodos.map((todo, i) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                style={{ animationDelay: `${i * 0.05}s` }}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>

      {showModal && (
        <TodoModal
          todo={editingTodo}
          onSave={editingTodo ? handleUpdate : handleCreate}
          onClose={() => { setShowModal(false); setEditingTodo(null) }}
        />
      )}
    </div>
  )
}

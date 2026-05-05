import './TodoItem.css'

const priorityConfig = {
  HIGH: { label: 'High', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  MEDIUM: { label: 'Medium', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  LOW: { label: 'Low', color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete, style }) {
  const p = priorityConfig[todo.priority] || priorityConfig.MEDIUM

  return (
    <div className={`todo-item fade-in ${todo.completed ? 'completed' : ''}`} style={style}>
      <button
        className={`check-btn ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        title="Toggle complete"
      >
        {todo.completed ? '✓' : ''}
      </button>

      <div className="todo-body">
        <div className="todo-top">
          <span className="todo-title">{todo.title}</span>
          <span
            className="priority-badge"
            style={{ color: p.color, background: p.bg }}
          >
            {p.label}
          </span>
        </div>
        {todo.description && (
          <p className="todo-desc">{todo.description}</p>
        )}
        {todo.dueDate && (
          <span className="todo-due">
            📅 {new Date(todo.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>

      <div className="todo-actions">
        <button className="action-btn edit-btn" onClick={() => onEdit(todo)} title="Edit">✎</button>
        <button className="action-btn delete-btn" onClick={() => onDelete(todo.id)} title="Delete">✕</button>
      </div>
    </div>
  )
}

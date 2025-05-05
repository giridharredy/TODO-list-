import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Delete,
  Edit,
  CheckCircle,
  RadioButtonUnchecked,
  Label,
  EmojiEvents,
  LocalCafe,
  Warning,
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#764ba2',
    },
    secondary: {
      main: '#667eea',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h3: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo,
        completed: false,
        priority: 'medium',
        date: new Date().toISOString(),
      },
    ]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    setTodos(
      todos.map((todo) =>
        todo.id === editingTodo.id ? { ...todo, text: editText } : todo
      )
    );
    setEditingTodo(null);
  };

  const changePriority = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const priorities = ['low', 'medium', 'high'];
          const currentIndex = priorities.indexOf(todo.priority);
          const nextPriority = priorities[(currentIndex + 1) % 3];
          return { ...todo, priority: nextPriority };
        }
        return todo;
      })
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <Warning className="priority-high" />;
      case 'medium':
        return <LocalCafe className="priority-medium" />;
      case 'low':
        return <EmojiEvents className="priority-low" />;
      default:
        return <Label />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="app-container">
        <Typography variant="h3" className="todo-header" gutterBottom>
          ✨ Task Master ✨
        </Typography>

        <form onSubmit={addTodo} className="add-todo-form">
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="✍️ Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                className="add-button"
                style={{ height: '56px' }}
              >
                Add Task
              </Button>
            </Grid>
          </Grid>
        </form>

        <div className="filter-buttons">
          <Button
            className="filter-button"
            variant={filter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilter('all')}
            color="primary"
          >
            All Tasks
          </Button>
          <Button
            className="filter-button"
            variant={filter === 'active' ? 'contained' : 'outlined'}
            onClick={() => setFilter('active')}
            color="primary"
          >
            Active
          </Button>
          <Button
            className="filter-button"
            variant={filter === 'completed' ? 'contained' : 'outlined'}
            onClick={() => setFilter('completed')}
            color="primary"
          >
            Completed
          </Button>
        </div>

        <Grid container spacing={2} className="todo-grid">
          {filteredTodos.map((todo) => (
            <Grid item xs={12} key={todo.id}>
              <Paper className="todo-item" elevation={2}>
                <Grid container alignItems="center" spacing={2} style={{ padding: '1rem' }}>
                  <Grid item>
                    <IconButton onClick={() => toggleTodo(todo.id)}>
                      {todo.completed ? (
                        <CheckCircle color="primary" />
                      ) : (
                        <RadioButtonUnchecked />
                      )}
                    </IconButton>
                  </Grid>
                  <Grid item xs>
                    <Typography
                      className="todo-text"
                      style={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        opacity: todo.completed ? 0.7 : 1,
                      }}
                    >
                      {todo.text}
                    </Typography>
                    <Typography className="todo-date">
                      {new Date(todo.date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => changePriority(todo.id)}>
                      {getPriorityIcon(todo.priority)}
                    </IconButton>
                    <IconButton onClick={() => startEditing(todo)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => deleteTodo(todo.id)}>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Dialog open={!!editingTodo} onClose={() => setEditingTodo(null)}>
          <DialogTitle>✏️ Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              margin="dense"
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingTodo(null)}>Cancel</Button>
            <Button onClick={saveEdit} color="primary" variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default App;

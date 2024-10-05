import { useState } from "react";
import Todo from "./Todo";

const Form = () => {

  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([]);

  const handleChange = e => setTodo(e.target.value)

  const handleClick = () => {
    if(todo.trim() === ''){
        alert('El campo no puede estar vacio')
        return
    }
    setTodos([...todos, {todo}])
  }

  const deleteTodo = index => {
    const newTodos = [...todos]
    newTodos.splice(index, 1)
    setTodos(newTodos)
  }

  return (
    <>
    <form onSubmit={(e) => e.preventDefault()}>
    <label>Agregar tarea</label> <br />
    <input type="text" onChange={handleChange}/>
    <button onClick={handleClick}>agregar</button>
      {todos.map((value, index) => (
        <Todo todo={value.todo} key={index} index={index} deleteTodo={deleteTodo}/>
      ))}
      </form>
    </>
  );
};

export default Form;

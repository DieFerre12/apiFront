const Todo = ({todo, index, deleteTodo}) => {
    return(
        <>
       <h3>Tarea: {todo}</h3>
       <button onClick={()=>deleteTodo(index)}>x</button>
        </>
    )
}

export default Todo
import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import "./App.css";
const db = new Dexie("todoApp");
db.version(1).stores({
    todoS: "++id,task,completed",
});

const App = () => {
    const { todoS } = db;

    const allItems = useLiveQuery(() => todoS.toArray(), []);

    const completedItems = allItems?.filter((item) => item.completed === true);

    const addTask = async (event) => {
        event.preventDefault();
        const taskField = document.querySelector("#taskInput");

        await todoS.add({
            task: taskField["value"],
            completed: false,
        });

        taskField["value"] = "";
    };

    const deleteTask = async (id) => todoS.delete(id);

    const toggleStatus = async (id, event) => {
        await todoS.update(id, { completed: !!event.target.checked });
    };
    return (
        <div className="container">
            <h3 className="teal-text center-align">Todo App</h3>
            <form className="add-item-form" onSubmit={addTask}>
                <input type="text" className="itemField" placeholder="What do you want to do today?" required />
                <button type="submit" className="waves-effect btn teal right">
                    Add
                </button>
            </form>

            <div className="card white darken-1">
                <div className="card-content">
                    {!allItems?.length && <p className="center-align">You've not added any task yet.</p>}

                    {allItems?.map(({ id, task, completed }) => (
                        <div className="row" key={id}>
                            <p className="col s10">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={completed}
                                        className="checkbox-blue"
                                        onChange={(event) => toggleStatus(id, event)}
                                    />
                                    <span className="black-text">{task}</span>
                                </label>
                            </p>
                            <i onClick={() => deleteTask(id)} className="col s2 material-icons delete-button">
                                delete
                            </i>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;

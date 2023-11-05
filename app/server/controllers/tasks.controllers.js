import {pool} from '../../db/db.js';

export const getTasks = async(req, res) => {
    const [result] = await pool.query(
        "SELECT * FROM tasks ORDER BY createAt ASC"
    );
    res.json(result)
    console.log(result);
};

export const getTask = async (req, res) => {
    try {
      const [result] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
        req.params.id,
      ]);
  
      if (result.length === 0)
        return res.status(404).json({ message: "Task not found" });
  
      res.json(result[0]);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


export const createTask = async(req, res) => {
    const { title, description } = req.body;
    const [result] = await pool.query(
        "INSERT INTO tasks(title, description) VALUES (?, ?)", 
        [title, description]
    );
    res.json({
        id: result.insertId,
        title,
        description,
    });
};

export const updateTask = (req, res) => {
    res.send("actualizando tarea")
}

export const deleteTask = async(req, res) => {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found" });
    }

    return res.sendStatus(204);
}
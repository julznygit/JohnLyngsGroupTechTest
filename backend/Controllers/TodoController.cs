using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoController : ControllerBase
{
    private static readonly List<Todo> _todos = new()
    {
        new Todo { Id = 1, Title = "Learn Angular", IsCompleted = true },
        new Todo { Id = 2, Title = "Build a REST API", IsCompleted = true },
        new Todo { Id = 3, Title = "Do some testing", IsCompleted = true },
        new Todo { Id = 4, Title = "Deploy to production", IsCompleted = false }
    };

    // ✅ GET api/todos — returns all todos
    [HttpGet]
    public ActionResult<IEnumerable<Todo>> GetAll()
    {
        return Ok(_todos);
    }

    // ✅ GET api/todos/1 — returns a single todo
    [HttpGet("{id:int}")]
    public ActionResult<Todo> GetById(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo is null)
            return NotFound(new { Message = $"Todo {id} not found" });

        return Ok(todo);
    }

    // ✅ POST api/todos — creates a new todo
    [HttpPost]
    public ActionResult<Todo> Create([FromBody] Todo todo)
    {
        todo.Id = _todos.Max(t => t.Id) + 1;
        _todos.Add(todo);
        return CreatedAtAction(nameof(GetById), new { id = todo.Id }, todo);
    }

    // ✅ DELETE api/todos/1 — removes a todo
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo is null)
            return NotFound();

        _todos.Remove(todo);
        return NoContent();
    }
}
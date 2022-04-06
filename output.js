const { escapeHTML } = require("./utils");

function renderNotes(notes) {
  return notes
    .map(
      (note) => `<li>
          ${note.meta.author} - ${note.text}
          <small>${JSON.stringify(note.meta)}</small>
      </li>`
    )
    .join("");
}

function render({ data, notes }) {
  return `
  <pre>${escapeHTML(data)}</pre>
  
  <h3>Notes</h3>
  <ul>
      ${renderNotes(notes)}
  </ul>
  
  <form action="/notes" method="post">
      <input placeholder="author" name="author">
      <br>
      <textarea placeholder="note" name="note"></textarea>
      <br>
      <button type="submit">login</button>
  </form>
  `;
}

module.exports = {
  render,
};

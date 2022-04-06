const app = require("express")();
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const { mergeDeep } = require("./utils");
const { render } = require("./output");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const notes = [];

app.get("/", (_, res) => {
  res.redirect("/status");
});

app.get("/status/:file?", (req, res) => {
  const { file } = req.params;
  const gitProcess = spawn("git", ["status", file ?? "."], {});

  let data = "";

  gitProcess.stdout.on("data", (chunk) => {
    data += chunk;
  });

  gitProcess.stderr.on("data", (chunk) => {
    data += chunk;
  });

  let error;
  gitProcess.on("error", (e) => {
    error = true;
    res.status(200).send(e);
  });

  gitProcess.on("close", () => {
    if (error) {
      return;
    }

    res.status(200).send(render({ data, notes }));
  });
});

app.post("/notes", (req, res) => {
  const note = {
    meta: mergeDeep(
      {
        date: new Date(),
        author: req.body.author || "anonymous",
      },
      req.body.meta
    ),
    text: req.body.note,
  };

  notes.push(note);

  res.redirect("/status");
});

app.listen("8000", "localhost", () => {
  console.log("App started on http://localhost:8000.");
});

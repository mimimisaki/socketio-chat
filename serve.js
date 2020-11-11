const crypto = require("crypto");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const DOCUMENT_ROOT = __dirname + "/public";

app.get("/", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/index.html");
});
app.get("/:file", (req, res) => {
  res.sendFile(DOCUMENT_ROOT + "/" + req.params.file);
});

io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");

  //   login
  () => {
    const token = makeToken(socket.id); // create token
    io.to(socket.id).emit("token", { token: token }); // send token to user
  };

  socket.on("post", (msg) => {
    io.emit("member-post", msg);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});

function makeToken(id) {
  const str = "aqwsedrftgyhujiko" + id;
  return crypto.createHash("sha1").update(str).digest("hex");
}

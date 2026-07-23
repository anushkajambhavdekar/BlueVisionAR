const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Upload Blueprint API
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.json({ message: "File uploaded successfully" });
});

// Text to 3D API (dummy)
app.post("/generate", (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);

  res.json({
    message: "3D model generated (dummy)",
    modelUrl: "https://example.com/model.glb",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
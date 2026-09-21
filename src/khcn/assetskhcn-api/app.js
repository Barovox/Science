const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { createCanvas, loadImage } = require("canvas");

const app = express();

const allowedOrigins = [
  "https://khcn.uef.edu.vn",
  "https://kekhaikhcn.uef.edu.vn",
  "https://uef-research.codex.io.vn",
  "https://uef-kekhai.codex.io.vn",
  "https://localhost:44370",
  "http://localhost:3147",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép yêu cầu không có origin (VD: từ Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Hỗ trợ form-data

// Thư mục lưu file upload
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Cấu hình Multer để lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now(); // + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Thư mục lưu file avatar
const AVATAR_DIR = path.join(__dirname, "avatars");
if (!fs.existsSync(AVATAR_DIR)) {
  fs.mkdirSync(AVATAR_DIR);
}

// Cấu hình Multer để lưu trữ avatar
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AVATAR_DIR);
  },
  filename: (req, file, cb) => {
    const userId = req.body.userId; // Nhận userId từ request
    if (!userId) {
      return cb(new Error("Missing userId"));
    }
    // const fileExt = path.extname(file.originalname);
    // const fileName = `${userId}${fileExt}`; // Định dạng: userId.png hoặc userId.jpg
    cb(null, `${userId}.png`);
  },
});
const avatarUpload = multer({ storage: avatarStorage });

// Thư mục lưu file certificate
const CERTIFICATE_DIR = path.join(__dirname, "certificates");
if (!fs.existsSync(CERTIFICATE_DIR)) {
  fs.mkdirSync(CERTIFICATE_DIR);
}

// Cấu hình Multer để lưu trữ certificate
const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, CERTIFICATE_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueCert = Date.now(); // + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueCert}.png`);
  },
});
const certificateUpload = multer({ storage: certificateStorage });

// Upload file
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({
    message: "File uploaded successfully",
    file: req.file,
  });
});

// Upload avatar
app.post(
  "/avatar-upload",
  avatarUpload.fields([{ name: "file", maxCount: 1 }]),
  (req, res) => {
    if (!req.files || !req.files["file"]) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    res.status(200).json({ message: "Avatar uploaded successfully" });
  }
);

// Upload certificate
app.post(
  "/certificate-upload",
  certificateUpload.fields([{ name: "file", maxCount: 1 }]),
  (req, res) => {
    if (!req.files || !req.files["file"]) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    res.status(200).json({
      message: "Certificate uploaded successfully",
      file: req.file,
    });
  }
);

// Xóa file
app.delete("/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(UPLOAD_DIR, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ message: "File not found" });
      }
      return res.status(500).json({ message: "Unable to delete file" });
    }
    res.status(200).json({ message: "File deleted successfully" });
  });
});

// Xóa avatar
app.delete("/avatars/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(AVATAR_DIR, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ message: "Image not found" });
      }
      return res.status(500).json({ message: "Unable to delete image" });
    }
    res.status(200).json({ message: "Image deleted successfully" });
  });
});

// Xóa certificate
app.delete("/certificates/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(CERTIFICATE_DIR, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ message: "Image not found" });
      }
      return res.status(500).json({ message: "Unable to delete image" });
    }
    res.status(200).json({ message: "Image deleted successfully" });
  });
});

app.get("/cert", async (req, res) => {
  try {
    let { text, template, x, y, s, c } = req.query;

    if (!text || !template) {
      return res
        .status(400)
        .json({ message: "Missing text or template param" });
    }

    x = parseInt(x || 0);
    y = parseInt(y || 0);
    s = parseInt(s || 60);

    const W = 3371;
    const H = 2420;

    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    const img = await loadImage(template);

    ctx.drawImage(img, 0, 0, W, H);

    ctx.font = `${s}pt Arial`;
    ctx.fillStyle = `#${c}`;
    ctx.textAlign = "center";

    ctx.fillText(`Ông/Bà ${text}`, x, y);

    res.setHeader("Content-Type", "image/png");
    canvas.createPNGStream().pipe(res);
  } catch (error) {
    console.error("CERT ERROR:", error);
    res.status(500).json({ message: "Error generating certificate" });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/avatars", express.static(path.join(__dirname, "avatars")));
app.use("/certificates", express.static(path.join(__dirname, "certificates")));

app.use("*", async (req, res) => {
  res.send("Hello world!");
});

const port = process.env.PORT || 5174;

app.listen(port);

const express = require("express");
const cors = require('cors');

const sendMailRoutes = require("./routes/send-email");

const app = express();

const allowedOrigins = [
  'https://khcn.uef.edu.vn',
  'https://kekhaikhcn.uef.edu.vn',
  'https://uef-research.codex.io.vn',
  'https://uef-kekhai.codex.io.vn',
  'https://localhost:44370',
  'http://localhost:3147'
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép yêu cầu không có origin (VD: từ Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.options('*', cors());

app.use(express.json());

app.use("/v1/send-email", sendMailRoutes);
app.use("*", async (req, res) => {
  res.send("Hello world!");
});

const port = process.env.PORT || 5174;
app.listen(port, () =>
  console.log(
    `Server running on port: http://localhost:${port} (Press 'Ctrl + C' to stop the server)`
  )
);

const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");

async function sendEmail(options) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "khcn@uef.edu.vn", // email
      pass: "pmwditdxlcpnsjud", // app password
    },
  });

  const mailOptions = {
    from: "UEF_P.KHCN-DAQT <khcn@uef.edu.vn>", // email
    ...options,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // console.error("Error sending email:", error);
    } else {
      // console.log("Email sent:", info.response);
    }
  });
}

function readHtmlTemplate(templateName, replacements) {
  const templatePath = path.join(__dirname, "template", templateName);
  let htmlContent = fs.readFileSync(templatePath, "utf-8");

  for (const key in replacements) {
    const placeholder = `{{${key}}}`;
    htmlContent = htmlContent.replace(
      new RegExp(placeholder, "g"),
      replacements[key],
    );
  }

  return htmlContent;
}

async function sendEmailThongBaoTinhTrangDeTaiKHCN(email, mailData) {
  const htmlContent = readHtmlTemplate(
    "thong-bao-tinh-trang-de-tai-khcn.html",
    mailData,
  );

  const mailOptions = {
    to: email,
    subject:
      "UEF_Đề tài KHCN: Thông báo tình trạng xét duyệt/nghiệm thu đề tài KHCN CB-GV-NV cấp trường UEF",
    html: htmlContent,
  };

  await sendEmail(mailOptions);
}

async function sendEmailInvitePhanBien(email, mailData) {
  const htmlContent = readHtmlTemplate("moi-phan-bien.html", mailData);

  const mailOptions = {
    to: email,
    subject:
      "UEF_Đề tài KHCN: Thư mời tham gia hội đồng nhận xét đề cương nghiên cứu cấp trường UEF",
    html: htmlContent,
  };

  await sendEmail(mailOptions);
}

async function sendEmailInvitePhanBienWithMessage(email, mailData) {
  const htmlContent = readHtmlTemplate(
    "moi-phan-bien-kem-tin-nhan.html",
    mailData,
  );

  const mailOptions = {
    to: email,
    subject:
      "UEF_Đề tài KHCN: Thư mời tham gia hội đồng nhận xét đề cương nghiên cứu cấp trường UEF",
    html: htmlContent,
  };

  await sendEmail(mailOptions);
}

async function sendEmailsRemind(mailList, mailData) {
  const htmlContent = readHtmlTemplate("nhac-nho-phan-bien.html", mailData);

  const mailOptions = {
    to: "khcn@uef.edu.vn",
    bcc: mailList.join(","),
    subject:
      "UEF_Đề tài KHCN: Thư nhắc nhở phản biện đề cương NCKH cấp trường UEF của CB-GV-NV",
    html: htmlContent,
  };

  await sendEmail(mailOptions);
}

async function sendEmailCamOn(email, mailData) {
  const htmlContent = readHtmlTemplate("cam-on-phan-bien.html", mailData);

  const mailOptions = {
    to: email,
    subject:
      "P.KHCN UEF: Cảm ơn Thầy/Cô đã đánh giá xét duyệt đề tài KHCN CB-GV-NV cấp trường UEF",
    html: htmlContent,
  };

  await sendEmail(mailOptions);
}

async function sendEmailInviteNghiemThu(email, mailData) {
  const htmlContent = readHtmlTemplate("moi-nghiem-thu.html", mailData);

  const mailOptions = {
    to: email,
    subject: "UEF_Đề tài KHCN: Thư mời nghiệm thu bài báo nghiên cứu khoa học",
    html: htmlContent,
  };

  await sendEmail(mailOptions);
}

async function sendEmailInviteNghiemThuWithMessage(email, mailData) {
  const htmlContent = readHtmlTemplate(
    "moi-nghiem-thu-kem-tin-nhan.html",
    mailData,
  );

  const mailOptions = {
    to: email,
    subject: "UEF_Đề tài KHCN: Thư mời nghiệm thu bài báo nghiên cứu khoa học",
    html: htmlContent,
  };

  await sendEmail(mailOptions);
}

async function sendEmailsRemindNghiemThu(mailList, mailData) {
  const htmlContent = readHtmlTemplate("nhac-nho-nghiem-thu.html", mailData);

  const mailOptions = {
    to: "khcn@uef.edu.vn",
    bcc: mailList.join(","),
    subject:
      "UEF_Đề tài KHCN: Thư nhắc nhở nghiệm thu đề cương NCKH cấp trường UEF của CB-GV-NV",
    html: htmlContent,
  };

  await sendEmail(mailOptions);
}

async function sendEmailCamOnNghiemThu(email, mailData) {
  const htmlContent = readHtmlTemplate("cam-on-nghiem-thu.html", mailData);

  const mailOptions = {
    to: email,
    subject:
      "P.KHCN UEF: Cảm ơn Thầy/Cô đã đánh giá nghiệm thu đề tài KHCN CB-GV-NV cấp trường UEF",
    html: htmlContent,
  };

  await sendEmail(mailOptions);
}

module.exports = {
  sendEmailThongBaoTinhTrangDeTaiKHCN,
  sendEmailInvitePhanBien,
  sendEmailInvitePhanBienWithMessage,
  sendEmailsRemind,
  sendEmailCamOn,
  sendEmailInviteNghiemThu,
  sendEmailInviteNghiemThuWithMessage,
  sendEmailsRemindNghiemThu,
  sendEmailCamOnNghiemThu,
};

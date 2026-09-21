const express = require("express");
const {
  sendEmailThongBaoTinhTrangDeTaiKHCN,
  sendEmailInvitePhanBien,
  sendEmailInvitePhanBienWithMessage,
  sendEmailsRemind,
  sendEmailCamOn,
  sendEmailInviteNghiemThu,
  sendEmailInviteNghiemThuWithMessage,
  sendEmailsRemindNghiemThu,
  sendEmailCamOnNghiemThu,
} = require("../utils/sendEmail");

const router = express.Router();

router.post("/thong-bao-tinh-trang-de-tai-khcn", async (req, res) => {
  const { to, mailData } = req.body;

  await sendEmailThongBaoTinhTrangDeTaiKHCN(to, mailData);

  res.status(200).json();
});

router.post("/gui-phan-bien", async (req, res) => {
  const { to, mailData } = req.body;

  await sendEmailInvitePhanBien(to, mailData);

  res.status(200).json();
});

router.post("/gui-phan-bien-kem-tin-nhan", async (req, res) => {
  const { to, mailData } = req.body;

  await sendEmailInvitePhanBienWithMessage(to, mailData);

  res.status(200).json();
});

router.post("/nhac-nho-phan-bien", async (req, res) => {
  const { mailList, mailData } = req.body;

  await sendEmailsRemind(mailList, mailData);

  res.status(200).json();
});

router.post("/cam-on-phan-bien", async (req, res) => {
  const { to, mailData } = req.body;

  await sendEmailCamOn(to, mailData);

  res.status(200).json();
});

router.post("/gui-nghiem-thu", async (req, res) => {
  const { to, mailData } = req.body;

  await sendEmailInviteNghiemThu(to, mailData);

  res.status(200).json();
});

router.post("/gui-nghiem-thu-kem-tin-nhan", async (req, res) => {
  const { to, mailData } = req.body;

  await sendEmailInviteNghiemThuWithMessage(to, mailData);

  res.status(200).json();
});

router.post("/nhac-nho-nghiem-thu", async (req, res) => {
  const { mailList, mailData } = req.body;

  await sendEmailsRemindNghiemThu(mailList, mailData);

  res.status(200).json();
});

router.post("/cam-on-nghiem-thu", async (req, res) => {
  const { to, mailData } = req.body;

  await sendEmailCamOnNghiemThu(to, mailData);

  res.status(200).json();
});

module.exports = router;

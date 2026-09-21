export const getStatusColor = (status: string) => {
  if (status.includes("Đã nộp hồ sơ")) {
    return "gray";
  } else if (status.includes("Đã nhận hồ sơ")) {
    return "cyan";
  } else if (status.includes("Đã gửi phản biện")) {
    return "blue";
  } else if (status.includes("Không tài trợ")) {
    return "red";
  } else if (status.includes("Nộp lại/Chỉnh sửa")) {
    return "red";
  } else {
    return "green";
  }
};

export const getStatusHopDongColor = (status: string) => {
  if (status.includes("Chủ nhiệm rà soát nộp lại hồ sơ")) {
    return "gray";
  } else if (status.includes("Đã nộp hồ sơ hoàn chỉnh + hợp đồng")) {
    return "cyan";
  } else if (status.includes("Không tài trợ")) {
    return "red";
  } else if (status.includes("Nộp lại/Chỉnh sửa")) {
    return "red";
  } else {
    return "green";
  }
};

export const getStatusNghiemThuColor = (status: string) => {
  if (status.includes("Đang thực hiện")) {
    return "gray";
  } else if (status.includes("Đến thời hạn nghiệm thu")) {
    return "cyan";
  } else if (status.includes("Đã gửi hồ sơ Hội đồng khoa học")) {
    return "blue";
  } else if (status.includes("Thanh lý hợp đồng")) {
    return "indigo";
  } else if (status.includes("Hủy")) {
    return "red";
  } else if (status.includes("Nộp lại/Chỉnh sửa")) {
    return "red";
  } else if (status.includes("Nộp lại/Chỉnh sửa thanh lý")) {
    return "red";
  } else {
    return "green";
  }
};

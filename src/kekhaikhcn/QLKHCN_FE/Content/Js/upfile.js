var userId = _idUser;
function BrowseServer(field) {
    var finder = new CKFinder();
    finder.selectActionFunction = function (fileUrl) {
        var valuetenbaibao = document.querySelector('#tenSanPhamKHCN').value;
        var userDirectory = "/Uploads/" + userId + "/" + valuetenbaibao + "/";
        var fileUrlWithUserDir = userDirectory + fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        var currentValue = document.getElementById(field).value;
        var decodedFileUrl = decodeURIComponent(fileUrlWithUserDir).replace(/\%20/g, ' ');

        var selectedFiles = currentValue.split(','); // Chuyển giá trị hiện tại thành mảng các đường dẫn đã chọn
        console.log(selectedFiles);
        console.log(decodedFileUrl);

        // Kiểm tra xem đường dẫn đã tồn tại trong mảng hay chưa
        if (selectedFiles.includes(decodedFileUrl)) {
            alert("Minh chứng đã tồn tại!");
            return;
        }

        // Kiểm tra nếu trường giá trị hiện tại đã có giá trị
        if (currentValue.length > 0) {
            // Thêm dấu phẩy và đường dẫn mới vào giá trị hiện tại
            document.getElementById(field).value = currentValue + ',' + decodedFileUrl;
        } else {
            // Trường giá trị hiện tại chưa có giá trị, gán đường dẫn mới trực tiếp
            document.getElementById(field).value = decodedFileUrl;
        }

        // Gửi đường dẫn tệp tin và userId lên server để lưu trữ
        SaveFile(fileUrl, userId, valuetenbaibao);
    };
    finder.popup();
}

function SaveFile(fileUrl, userId, valuetenbaibao) {
    var data = {
        fileUrl: fileUrl,
        userId: userId,
        valuetenbaibao: valuetenbaibao,
    };

    $.ajax({
        url: '/Article/SaveFile',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (result) {
            if (result.success) {
                // Xử lý khi lưu trữ tệp tin thành công
                alert('Cập nhập minh chứng thành công.');
            } else {
                // Xử lý khi lưu trữ tệp tin thất bại
                alert('Cập nhập minh chứng thất bại.');
            }
        },
        error: function () {
            // Xử lý khi có lỗi xảy ra
            alert('Đã xảy ra lỗi khi gửi yêu cầu lưu trữ tệp tin.');
        }
    });
}
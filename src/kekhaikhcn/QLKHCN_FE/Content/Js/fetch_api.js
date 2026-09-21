// api
const linkapilsp = "https://localhost:44364/api/ThanhToanGV/Get-LSP?lsp="

const linkapiID = "https://localhost:44364/api/ThanhToanGV/Get-ID?id=";
//------------------------------

//------------------------------

//element
document.querySelector('#tacgia').onchange = function () {
    document.querySelector('#yeucauchatluong').innerHTML = ``;
    document.querySelector('#loaisanpham').innerHTML = ``;
    try {
        document.querySelector('#tongthanhtien').innerHTML = `value`;
    } catch { }
    //document.querySelector('#thanhtoan').checked = false;
}
function movedmk() {
    document.querySelector('#div-dmk').innerHTML = ``;
}

function clear_tacgia() {
    document.querySelector('#yeucauchatluong').innerHTML = ``;
    document.querySelector('#loaisanpham').innerHTML = ``;
    try {
        document.querySelector('#tongthanhtien').innerHTML = ``;
    } catch { }
    document.querySelector('#loaibaibao').innerHTML = ``;
    //document.querySelector('#thanhtoan').checked = false;
    render_fr_httt();
}
//------------------

function Start() {
    //Get_issn(renderGet_issn);
    /*Get_loaisanpham(render_lsp);*/
}
Start();
function Get_issn(callback) {
    var searchBtn = document.querySelector('#inpsearch-3');
    var valueoption = document.querySelector('#option-national-country');
    var textvalueoption = valueoption.options[valueoption.selectedIndex].textContent;
    if (textvalueoption == "Quốc tế") {
        var value = "https://localhost:44364/api/DanhMuc/Get-issn?issn=";
        var inputSearch = document.querySelector('input[name="search-issn-eissn"]').value;
        if (inputSearch == "") {
            alert("empty");
        } else {
            fetch(value + inputSearch, {
                headers: {
                    'Authorization': 'Bearer ' + _token,
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    if (response.status == 404) {
                        fetch("https://localhost:44364/api/DanhMucScimago/Get-issn?issn=" + inputSearch, {
                            headers: {
                                'Authorization': 'Bearer ' + _token,
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(function (res) {
                                return res.json();
                            })
                            .then(callback)
                    }
                    else {
                        return response.json();
                    }
                })
                .then(callback)
        }
    }
    else if (textvalueoption == "Trong nước") {
        var value = "https://localhost:44364/api/DanhMucTrongNuoc/Get-DanhMucTrongNuoc?issn=";
        var inputSearch = document.querySelector('input[name="search-issn-eissn"]').value;
        if (inputSearch == "") {
            alert("empty");
        } else {
            fetch(value + inputSearch, {
                headers: {
                    'Authorization': 'Bearer ' + _token,
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    return response.json();
                })
                .then(callback)
        }
    }
}
function danhMucKhac() {
    document.querySelector('#checkbox-result-issn-eissn').innerHTML = ``;
    document.querySelector('#div-dmk').innerHTML = `
                            <div class="input-group mb-3">
                            <input class="form-control" " id="inp-name-dmk" placeholder="Name"><br />
                    </div>
                    <div class="input-group mb-3">
                            <input class="form-control" id="inp-issn-dmk" placeholder="Issn"><br />
                    </div>
                    <div class="input-group mb-3">
                            <input class="form-control" id="inp-iessn-dmk" placeholder="Eissn"><br />
                    </div>
                    <div class="input-group mb-3"><input class="form-control" id="inp-catigory-dmk" placeholder="Category">
                    </div>
                            `;
}
function render_kinhphi(q) {
    if (q.includes("Q1")) {
        document.querySelector('#tongthanhtien2').innerHTML = ` <label> Kinh phí bài báo: <label id="total">100000000</label> </label >`;
    }
    if (q.includes("Q2")) {
        document.querySelector('#tongthanhtien2').innerHTML = ` <label> Kinh phí bài báo: <label id="total">80000000</label> </label >`;
    }
    if (q.includes("Q3")) {
        document.querySelector('#tongthanhtien2').innerHTML = ` <label> Kinh phí bài báo: <label id="total">60000000</label> </label >`;
    }
    if (q.includes("Q4")) {
        document.querySelector('#tongthanhtien2').innerHTML = ` <label> Kinh phí bài báo: <label id="total">40000000</label> </label >`;
    } if (q == "Q1" || q == "Q2" || q == "Q3") {
        document.querySelector('#tongthanhtien2').innerHTML = ` <label> Kinh phí bài báo: <label id="total">24000000</label> </label >`;
    } if (q == "Q4") {
        document.querySelector('#tongthanhtien2').innerHTML = ` <label> Kinh phí bài báo: <label id="total">0</label> </label >`;
    }
}
function renderGet_issn(issns) {
    var valueoption = document.querySelector('#option-national-country');
    var textvalueoption = valueoption.options[valueoption.selectedIndex].textContent;
    try { var valuelbb = document.querySelector('input[name="lbb"]:checked').value; } catch { }

    if (textvalueoption == "Trong nước") {
        var checkbox = document.querySelector('#checkbox-result-issn-eissn');
        checkbox.innerHTML = ``;
        var htmls = issns.map(function (issn) {
            if (valuelbb == "CSP") {
                var diem = Number(issn.diem);
                if (diem == 1 || diem > 1) {
                    document.querySelector('#tongthanhtien2').innerHTML = ` <label> Kinh phí bài báo: <label id="total">18000000</label> </label >`;
                } else {
                    document.querySelector('#tongthanhtien2').innerHTML = ` <label> Kinh phí bài báo: <label id="total">10000000</label> </label >`;
                }
            } if (valuelbb == "KSP") {
                var diem = Number(issn.diem);
                if (diem == 1 || diem > 1) {
                    document.querySelector('#tongthanhtien2').innerHTML = ` <label> Kinh phí bài báo: <label id="total">15000000</label> </label >`;
                } else {
                    document.querySelector('#tongthanhtien2').innerHTML = ` <label> Kinh phí bài báo: <label id="total">0</label> </label >`;
                }
            }
            var checkbox = document.querySelector('#tongthanhtien');
            checkbox.innerHTML = `<label>Tiết chuẩn</label><label id="tietchuan">0</label> <label>Điểm</label> <label id="diem">${issn.diem}</label>`;
            return `

                                            <input type="radio" class="radio-result" id="category-${issn.id}" name="category" value="${issn.tentapchi},${issn.hoidongnganh}">
                                            <label for="category-${issn.id}">${issn.tentapchi} (${issn.hoidongnganh})</label></br>
                                            <style>
                                                .checkbox-result-issn-eissn{
                                                    margin-left: 5%;
                                                }
                                            </style>`;
        });
        checkbox.innerHTML = htmls.join('');
    }
    if (issns == null) {
        document.querySelector('#dmk').checked = true;
        document.querySelector('#checkbox-result-issn-eissn').innerHTML = ``;
        document.querySelector('#div-dmk').innerHTML = `<div class="input-group mb-3">
                            <input class="form-control" " id="inp-name-dmk" placeholder="Name"><br />
                    </div>
                    <div class="input-group mb-3">
                            <input class="form-control" id="inp-issn-dmk" placeholder="Issn"><br />
                    </div>
                    <div class="input-group mb-3">
                            <input class="form-control" id="inp-iessn-dmk" placeholder="Eissn"><br />
                    </div>
                    <div class="input-group mb-3"><input class="form-control" id="inp-catigory-dmk" placeholder="Category">
                    </div>
                            `;
    } else if (textvalueoption == "Quốc tế") {
        document.querySelector('#div-dmk').innerHTML = ``;
        document.querySelector('#traCuuDM').checked = true;
        var checkbox = document.querySelector('#checkbox-result-issn-eissn');
        checkbox.innerHTML = ``;
        var htmls = issns.map(function (issn) {
            if (issn.category_6 == null) {
                if (issn.category_5 == null) {
                    if (issn.category_4 == null) {
                        if (issn.category_3 == null) {
                            if (issn.category_2 == null) {
                                return `<label id="lbr" style="color: black; font-size: 120%">Các danh mục liên quan</label><br />
                                            <label  style="margin-left: 3%;font-size: 120%">Tên danh mục: <label id="lbname" style="color: red;">${issn.journal_name}</label></label>
                                            <label style="font-size: 120%;  margin-left: 5%;">Issn: <label id="lbissn" style="color: red; ">${issn.issn}</label></label>
                                            <label style="font-size: 120%;  margin-left: 5%;">Eissn: <label  id="lbeissn" style="color: red;">${issn.eissn}</label></label><br />
                                            <input type="radio" class="radio-result" id="category-1" name="category" value="${issn.category_1}" checked="true">
                                            <label for="category-1">${issn.category_1}</label>
                                            <style>
                                                .radio-result{
                                                    margin-left: 5%;
                                                }
                                            </style>`;
                            }
                            return `<label id="lbr" style="color: black; font-size: 120%">Các danh mục liên quan</label><br />
                                        <label  style="margin-left: 3%;font-size: 120%">Tên danh mục: <label id="lbname" style="color: red;">${issn.journal_name}</label></label>
                                        <label style="font-size: 120%;  margin-left: 5%;">Issn: <label id="lbissn" style="color: red; ">${issn.issn}</label></label>
                                        <label style="font-size: 120%;  margin-left: 5%;">Eissn: <label  id="lbeissn" style="color: red;">${issn.eissn}</label></label><br />
                                        <input type="radio" class="radio-result" id="category-1" name="category" value="${issn.category_1}" checked="true">
                                        <label for="category-1">${issn.category_1}</label><br>
                                        <input type="radio" class="radio-result" id="category-2" name="category" value="${issn.category_2}">
                                        <label for="category-2">${issn.category_2}</label>
                                        <style>
                                            .radio-result{
                                                margin-left: 5%;
                                            }
                                        </style>`
                                ;
                        }
                        return `<label id="lbr" style="color: black; font-size: 120%">Các danh mục liên quan</label><br />
                                    <label  style="margin-left: 3%;font-size: 120%">Tên danh mục: <label id="lbname" style="color: red;">${issn.journal_name}</label></label>
                                    <label style="font-size: 120%;  margin-left: 5%;">Issn: <label id="lbissn" style="color: red; ">${issn.issn}</label></label>
                                    <label style="font-size: 120%;  margin-left: 5%;">Eissn: <label  id="lbeissn" style="color: red;">${issn.eissn}</label></label><br />
                                    <input type="radio" class="radio-result" id="category-1" name="category" value="${issn.category_1}" checked="true">
                                    <label for="category-1">${issn.category_1}</label><br />
                                    <input type="radio" class="radio-result" id="category-2" name="category" value="${issn.category_2}" >
                                    <label for="category-2">${issn.category_2}</label><br />
                                    <input type="radio" class="radio-result" id="category-3" name="category" value="${issn.category_3}" >
                                    <label for="category-3">${issn.category_3}</label><br />
                                    <style>
                                        .radio-result{
                                            margin-left: 5%;
                                        }
                                    </style>`;
                    }
                    return `<label id="lbr" style="color: black; font-size: 120%">Các danh mục liên quan</label><br />
                                <label  style="margin-left: 3%;font-size: 120%">Tên danh mục: <label id="lbname" style="color: red;">${issn.journal_name}</label></label>
                                <label style="font-size: 120%;  margin-left: 5%;">Issn: <label id="lbissn" style="color: red; ">${issn.issn}</label></label>
                                <label style="font-size: 120%;  margin-left: 5%;">Eissn: <label  id="lbeissn" style="color: red;">${issn.eissn}</label></label><br />
                                <input type="radio" class="radio-result" id="category-1" name="category" value="${issn.category_1}" checked="true">
                                <label for="category-1">${issn.category_1}</label><br />
                                <input type="radio" class="radio-result" id="category-2" name="category" value="${issn.category_2}">
                                <label for="category-2">${issn.category_2}</label><br />
                                <input type="radio" class="radio-result" id="category-3" name="category" value="${issn.category_3}">
                                <label for="category-3">${issn.category_3}</label><br />
                                <input type="radio" class="radio-result" id="category-4" name="category" value="${issn.category_4}">
                                <label for="category-4">${issn.category_4}</label>
                                <style>
                                    .radio-result{
                                        margin-left: 5%;
                                    }
                                </style>`;
                }
                return `<label id="lbr" style="color: black; font-size: 120%">Các danh mục liên quan</label><br />
                            <label  style="margin-left: 3%;font-size: 120%">Tên danh mục: <label id="lbname" style="color: red;">${issn.journal_name}</label></label>
                            <label style="font-size: 120%;  margin-left: 5%;">Issn: <label id="lbissn" style="color: red; ">${issn.issn}</label></label>
                            <label style="font-size: 120%;  margin-left: 5%;">Eissn: <label  id="lbeissn" style="color: red;">${issn.eissn}</label></label><br />
                            <input type="radio" class="radio-result" id="category-1" name="category" value="${issn.category_1}" checked="true">
                            <label for="category-1">${issn.category_1}</label><br />
                            <input type="radio" class="radio-result" id="category-2" name="category" value="${issn.category_2}">
                            <label for="category-2">${issn.category_2}</label><br />
                            <input type="radio" class="radio-result" id="category-3" name="category" value="${issn.category_3}">
                            <label for="category-3">${issn.category_3}</label><br />
                            <input type="radio" class="radio-result" id="category-4" name="category" value="${issn.category_4}">
                            <label for="category-4">${issn.category_4}</label>
                            <input type="radio" class="radio-result" id="category-5" name="category" value="${issn.category_5}">
                            <label for="category-5">${issn.category_5}</label>
                            <style>
                                .radio-result{
                                    margin-left: 5%;
                                }
                            </style>`;
            } else {
                return `<label id="lbr" style="color: black; font-size: 120%">Các danh mục liên quan</label><br />
                            <label  style="margin-left: 3%;font-size: 120%">Tên danh mục: <label id="lbname" style="color: red;">${issn.journal_name}</label></label>
                            <label style="font-size: 120%;  margin-left: 5%;">Issn: <label id="lbissn" style="color: red; ">${issn.issn}</label></label>
                            <label style="font-size: 120%;  margin-left: 5%;">Eissn: <label  id="lbeissn" style="color: red;">${issn.eissn}</label></label><br />
                            <input type="radio" class="radio-result" id="category-1" name="category" value="${issn.category_1}" checked="true">
                            <label for="category-1">${issn.category_1}</label><br />
                            <input type="radio" class="radio-result" id="category-2" name="category" value="${issn.category_2}">
                            <label for="category-2">${issn.category_2}</label><br />
                            <input type="radio" class="radio-result" id="category-3" name="category" value="${issn.category_3}">
                            <label for="category-3">${issn.category_3}</label><br />
                            <input type="radio" class="radio-result" id="category-4" name="category" value="${issn.category_4}" ">
                            <label for="category-4">${issn.category_4}</label><br />
                            <input type="radio" class="radio-result" id="category-5" name="category" value="${issn.category_5}">
                            <label for="category-5">${issn.category_5}</label><br />
                            <input type="radio" class="radio-result" id="category-6" name="category" value="${issn.category_6}">
                            <label for="category-5">${issn.category_6}</label><br />
                            <style>
                                .radio-result{
                                    margin-left: 5%;
                                }
                            </style>`;
            }
        });
    }

    //document.querySelector('#tongthanhtien2').innerHTML = ` <label> Kinh phí bài báo: <label id="total">100000000</label> </label >`;

    checkbox.innerHTML = htmls.join('');
    var q = document.querySelector('input[name="category"]:checked').value;
    render_kinhphi(q);
}
//

var linkuser = "https://localhost:44364/api/NguoiDung/Get-user?input=";
function inpsearch(idinput, callback) {
    var valueinp = document.querySelector('#inp-username-id-mail-' + idinput).value;
    if (valueinp == "") {
        document.querySelector('#dl-user-' + idinput).innerHTML = ``;
    }

    fetch("https://localhost:44364/api/NguoiDung/Get-user?input=" + valueinp, {
        headers: {
            'Authorization': 'Bearer ' + _token,
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            //console.log(response.json().idUser);
            return response.json();
        })
        .then(callback)
}
function render_user(users) {
    var sltgc = Number(document.querySelector('#sltgc').value);
    var sltgp = Number(document.querySelector('#sltgp').value);
    var sltglh = Number(document.querySelector('#sltglh').value);
    var sltg = sltgc + sltgp + sltglh;
    for (let i = 0; i < sltg; i++) {
        var tg = document.querySelector('#inp-username-id-mail-' + i);
        tg.oninput = function () {
            var list = document.querySelector('#dl-user-' + i);
            list.innerHTML = ``;
            inpsearch(i, render_user);
            var htmls = users.map(function (user) {
                return `<dt value="${user.idUser}" style="border-style: groove;"><button onclick="btnadd('${i}','${user.idUser}','${user.hoTen}')" type="button" class="btn btn-success">Thêm tác giả </button>
${user.hoTen} - ${user.donViCongTac}</dt>`;
            });
            list.innerHTML = htmls.join('');
        }
    }
}
function btnadd(id, iduser, name) {
    var tg = document.querySelector('#inp-username-id-mail-' + id);
    tg.value = ``;
    if (tg.value == "") {
        document.querySelector('#dl-user-' + id).innerHTML = ``;
        tg.value = tg.value + iduser + " - " + name;
    }

    document.querySelector('#dl-user-' + id).innerHTML = ``;
}
//----------------------------------
function Get_thanhtoanncv(a, callback) {
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;

    if (valuerank != "Giảng viên") {
        var linkapiquydoincv = "https://localhost:44364/api/QuyDoiNCV/Get-spkhcn?spkhcn=";
        fetch(linkapiquydoincv + a, {
            headers: {
                'Authorization': 'Bearer ' + _token,
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(callback)
    } else {
        fetch(linkapithanhtoanncv + a, {
            headers: {
                'Authorization': 'Bearer ' + _token,
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(callback)
    }
}

function render_fr_httt() {
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    if (valuerank == "Giảng viên") {
        //document.getElementById("thanhtoan").disabled = false;
        document.getElementById("quydoi").disabled = false;
        document.querySelector('#loai_hinh').innerHTML = `<div class="card-header">
            <h3 class="card-title">Chọn loại hình kê khai</h3>
        </div>
        <div class="card-body">
            <div class="row">
            <div class="col-4">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="KKKL" name="tick-rank-kekhai"  value="Khối lượng" onclick="clear_hinhthuc()">
                        <label for="KKKL" class="custom-control-label">Kê khai khối lượng</label>

                    </div>
                </div>
                <div class="col-4">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="KKNCM" name="tick-rank-kekhai" value="Nghiên cứu mạnh"  onclick="clear_hinhthuc()">
                        <label for="KKNCM" class="custom-control-label">Nghiên cứu mạnh</label>
                    </div>
                </div>

                <div class="col-4">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="KKDT" name="tick-rank-kekhai" value="Đề tài" onclick="clear_hinhthuc()">
                        <label for="KKDT" class="custom-control-label">Đề tài</label>
                    </div>
                </div>
            </div>
        </div>`;
    }
    else if (valuerank == "Nghiên cứu viên 1") {
        //document.getElementById("thanhtoan").disabled = true;
        document.getElementById("quydoi").disabled = false;
        document.querySelector('#loai_hinh').innerHTML = `<div class="card-header">
            <h3 class="card-title">Chọn loại hình kê khai</h3>
        </div>
        <div class="card-body">
            <div class="row">
            <div class="col-4">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="KKKL" name="tick-rank-kekhai"  value="Khối lượng" onclick="clear_hinhthuc()">
                        <label for="KKKL" class="custom-control-label">Kê khai khối lượng</label>

                    </div>
                </div>
                <div class="col-4">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="KKNCM" name="tick-rank-kekhai" value="Nghiên cứu mạnh"  onclick="clear_hinhthuc()">
                        <label for="KKNCM" class="custom-control-label">Nghiên cứu mạnh</label>
                    </div>
                </div>

            </div>
        </div>`;
    }
    else if (valuerank == "Nghiên cứu viên 2") {
        //document.getElementById("thanhtoan").disabled = false;
        document.getElementById("quydoi").disabled = true;
        document.querySelector('#loai_hinh').innerHTML = ``;
    }
}

/*function render_spkhcn(khcns) {
    var checkbox = document.querySelector('#loaisanpham');
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    document.querySelector('#loaisanpham').innerHTML = ``;
    document.querySelector('#tongthanhtien').innerHTML = ``;
    var tg = Number(document.querySelector('#tacgia').value);
    //var cq = Number(document.querySelector('#coquancongtac').value);
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;

    if (valuerank != "Giảng viên") {
        var htmls = khcns.map(function (khcn) {
            return `<div class="custom-control custom-radio">
                    <input class="custom-control-input" type="radio" id="${khcn.id}" name="yc" value="${khcn.moTaLoaiSanPham}" onclick="checkcheckncv(${khcn.id}, render_checkncv(${khcn.tietChuan}, ${khcn.diem}))">
                    <label for="${khcn.id}" class="custom-control-label">${khcn.moTaSanPhamKHCN}</label>
                </div>`;
        });
    } else {
        //var tongkinhphi = Number(kinhphi * tg * cq);
        var htmls = khcns.map(function (khcn) {
            return `<div class="custom-control custom-radio">
                    <input class="custom-control-input" type="radio" id="${khcn.id}" name="yc" value="${khcn.moTaLoaiSanPham}" onclick="checkcheckncv(${khcn.id}, render_checkncv(${khcn.tietChuan}, ${khcn.diem}))">
                    <label for="${khcn.id}" class="custom-control-label">${khcn.moTaSanPhamKHCN}</label>
                </div>`;
        });
    }

    checkbox.innerHTML = htmls.join('');
}*/

/*function render_spkhcn(khcns) {
    var checkbox = document.querySelector('#loaisanpham');
    document.querySelector('#tongthanhtien').innerHTML = ``;
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;

    var htmls = khcns.map(function (khcn) {
        return `<div class="custom-control custom-radio">
                    <input class="custom-control-input" type="radio" id="${khcn.id}" name="yc" value="${khcn.sanPhamKHCN}">
                    <label for="${khcn.id}" class="custom-control-label">${khcn.moTaSanPhamKHCN}</label>
                </div>`;
    });

    checkbox.innerHTML = htmls.join('');
}*/
//----------------------------------

//----------------------------------

var linkapispkhcn = "https://localhost:44364/api/QuyDoiGV/Get-spkhcn?spkhcn=";
function Get_spkhcn(a, callback) {
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    fetch(linkapispkhcn + a, {
        headers: {
            'Authorization': 'Bearer ' + _token,
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(callback)
}
function Get_spkhcn_lsp(a, callback) {
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    fetch("https://localhost:44364/api/ThanhToanGV/Get-LSP?lsp=" + a, {
        headers: {
            'Authorization': 'Bearer ' + _token,
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(callback)
}
function render_spkhcn(khcns) {
    var checkbox = document.querySelector('#loaisanpham');
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    var valueloaihinh = document.querySelector('input[name="tick-rank-kekhai"]:checked').value;

    document.querySelector('#loaisanpham').innerHTML = ``;
    try {
        document.querySelector('#tongthanhtien').innerHTML = ``;
    } catch { }
    var tg = Number(document.querySelector('#tacgia').value);
    //var cq = Number(document.querySelector('#coquancongtac').value);
    //var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    if (valuerank == "Giảng viên" && valueloaihinh == "Đề tài") {
        loadloaibaibao();
    }
    if (valuerank != "Giảng viên") {
        var htmls = khcns.map(function (khcn) {
            return `<div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="${khcn.id}" name="yc" value="${khcn.moTaLoaiSanPham}}" onclick="checkcheckncv(${khcn.id}, render_checkncv(${khcn.tietChuan}, ${khcn.diem}))">
                        <label for="${khcn.id}" class="custom-control-label">${khcn.moTaLoaiSanPham}</label>
                    </div>`;
        });
    } else {
        //var tongkinhphi = Number(kinhphi * tg * cq);
        var htmls = khcns.map(function (khcn) {
            return `<div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="${khcn.id}" name="yc" value="${khcn.moTaLoaiSanPham}" onclick="checkcheckncv(${khcn.id}, render_checkncv(${khcn.tietChuan}, ${khcn.diem}))">
                        <label for="${khcn.id}" class="custom-control-label">${khcn.moTaLoaiSanPham}</label>
                    </div>`;
        });
    }

    checkbox.innerHTML = htmls.join('');
    show_dm();
}
//----------------------------------
function show_dm() {
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    var valueloaihinh = document.querySelector('input[name="tick-rank-kekhai"]:checked').value;
    var valuelsp = document.querySelector('input[name="lsp"]:checked').value;
    try {
        var valueyc = document.querySelector('input[name="yc"]:checked').value;
    } catch { }

    //alert(valuerank + "/" + valueloaihinh);
    if (valuelsp == "Sach" || valuelsp == "DeTai" || valuelsp == "SHTT" || valuelsp == "HDSV" || valuelsp == "Nghethuat") {
        document.querySelector('#upload').innerHTML = `<div class="custom-file col-6" >
                        <input type="text" class="form-control" placeholder="Nhập minh chứng" id="myFile" name="myFile" readonly />
                        <input type="button" value="Tải ảnh" onclick="BrowseServer('myFile');" />
                        <div id="tongthanhtien"></div>
                    </div>`;
        document.querySelector('#chondanhmuc').innerHTML = ``;
    }
    else {
        document.querySelector('#upload').innerHTML = `<div id="tongthanhtien"></div>`;
    }
}
function show_yc() {
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    var valueloaihinh = document.querySelector('input[name="tick-rank-kekhai"]:checked').value;
    var valuelsp = document.querySelector('input[name="lsp"]:checked').value;
    try {
        var valueyc = document.querySelector('input[name="yc"]:checked').value;
    } catch { }
    if (valuelsp == "TapChi") {
        if (valueyc == "Tạp chí khoa học chuyên ngành quốc tế ISI Q1" || valueyc == "Tạp chí khoa học chuyên ngành quốc tế ISI Q2" || valueyc == "Tạp chí khoa học chuyên ngành quốc tế ISI Q3" || valueyc == "Tạp chí khoa học chuyên ngành quốc tế ISI Q4" || valueyc == "Tạp chí khoa học chuyên ngành quốc tế Scopus ") {
            document.querySelector('#upload').innerHTML = ``;
            document.querySelector('#chondanhmuc').innerHTML = `
                <div class="card-header">
            <h3 class="card-title">Chọn danh mục</h3>
        </div>

        <div class="card-body">
            <div class="row">
                <div class="col-6">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="traCuuDM" name="selectDM" value="Tra cứu danh mục theo issn hoặc eissn" checked onclick="movedmk()">
                        <label for="traCuuDM" class="custom-control-label">Tra cứu danh mục theo Issn hoặc Eissn</label>
                        <select name="" id="option-national-country" class="form-control col-4" onchange="clear_option()">
                            <option value="0.8">Quốc tế</option>
                            <option value="0.2">Trong nước</option>
                        </select>

                    </div>
                </div>
                <div class="col-1">
                </div>
                <div class="col-5" id="danhmuckhac">

                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="dmk" name="selectDM" value="Danh mục khác" onclick="danhMucKhac()">
                        <label for="dmk" class="custom-control-label">Danh mục khác</label>
                    </div>
                    <div class="custom-control custom-radio">
                        <div id="div-dmk">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <br />
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="row">
                        <div class="col-9">
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" id="search-issn" name="search-issn-eissn" placeholder="Tra cứu danh mục theo issn hoặc eissn">
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="input-group mb-3">
                                <input class="btn btn-default form-control" id="inpsearch-3" type="submit" value="Tìm kiếm" onclick="Get_issn(renderGet_issn)">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="result-issn-eissn" id="checkbox-result-issn-eissn">
                        </div>

                    </div>
                    <div id="tongthanhtien2"></div>
                    <div id="tongthanhtien"></div>
                </div>
                <div class="col-1">
                </div>
                <div class="col-5">

                    <div class="custom-file">
                        <input type="text" class="form-control" placeholder="Nhập minh chứng" id="myFile" name="myFile" readonly />
                        <input type="button" value="Tải ảnh" onclick="BrowseServer('myFile');" />
                    </div>

                </div>
            </div>
        </div>`;
        }
        else {
            document.querySelector('#upload').innerHTML = `<div class="custom-file col-6" >
                       <input type="text" class="form-control" placeholder="Nhập minh chứng" id="myFile" name="myFile" readonly />
                        <input type="button" value="Tải ảnh" onclick="BrowseServer('myFile');" />
                        <div id='tongthanhtien'></div>
                    </div>`;
            document.querySelector('#chondanhmuc').innerHTML = ``;
        }
    }
}
//-----------------------------------
function Get_loaisanpham(a, callback) {
    fetch(linkapilsp + a, {
        headers: {
            'Authorization': 'Bearer ' + _token,
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(callback)
}

function render_lsp(lsps) {
    var checkbox = document.querySelector('#loaisanpham');
    try {
        document.querySelector('#tongthanhtien').innerHTML = ``;

        var htmls = lsps.map(function (lsp) {
            return `<div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="${lsp.id}" name="yc" value="${lsp.yeuCauChatLuong}" onclick="checkcheck(${lsp.id},render_check(${lsp.kinhPhi}))">
                        <label for="${lsp.id}" class="custom-control-label">${lsp.yeuCauChatLuong} </label>
                    </div>`;
        });
    } catch { }
    var valueoption = document.querySelector('#option-national-country');
    var textvalueoption = valueoption.options[valueoption.selectedIndex].textContent;
    if (textvalueoption != "") {
        document.querySelector('#chondanhmuc').innerHTML = `
                <div class="card-header">
            <h3 class="card-title">Chọn danh mục</h3>
        </div>

        <div class="card-body">
            <div class="row">
                <div class="col-6">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="traCuuDM" name="selectDM" value="Tra cứu danh mục theo issn hoặc eissn" checked onclick="movedmk()">
                        <label for="traCuuDM" class="custom-control-label">Tra cứu danh mục theo Issn hoặc Eissn</label>
                        <select name="" id="option-national-country" class="form-control col-4" onchange="clear_option()" disable>
                            <option value="0.2">Trong nước</option>
                        </select>

                    </div>
                </div>
                <div class="col-1">
                </div>
                <div class="col-5" id="danhmuckhac">

                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="dmk" name="selectDM" value="Danh mục khác" onclick="danhMucKhac()">
                        <label for="dmk" class="custom-control-label">Danh mục khác</label>
                    </div>
                    <div class="custom-control custom-radio">
                        <div id="div-dmk">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <br />
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="row">
                        <div class="col-9">
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" id="search-issn" name="search-issn-eissn" placeholder="Tra cứu danh mục theo issn hoặc eissn">
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="input-group mb-3">
                                <input class="btn btn-default form-control" id="inpsearch-3" type="submit" value="Tìm kiếm" onclick="Get_issn(renderGet_issn)">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="result-issn-eissn" id="checkbox-result-issn-eissn">
                        </div>

                    </div>
                    <div id="tongthanhtien2"></div>
                    <div id="tongthanhtien"></div>
                </div>
                <div class="col-1">
                </div>
                <div class="col-5">

                    <div class="custom-file">
                        <input type="text" class="form-control" placeholder="Nhập minh chứng" id="myFile" name="myFile" readonly />
                        <input type="button" value="Tải ảnh" onclick="BrowseServer('myFile');" />
                    </div>

                </div>
            </div>
        </div>`;
    }

    checkbox.innerHTML = htmls.join('');
}

document.getElementsByName('lsp').onchange = function () {
    document.querySelector('#loaisanpham').innerHTML = ``;
}
//-----------------------------------

//-----------------------------------
//load radio khi chon hinh thuc thanh toan
function loadradio() {
    document.querySelector('#yeucauchatluong').innerHTML = ``;
    try {
        document.querySelector('#tongthanhtien').innerHTML = ``;
    } catch { }
    document.querySelector('#loaisanpham').innerHTML = ``;
    document.querySelector('#loaibaibao').innerHTML = ``;
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    if (valuerank != "Giảng viên") {
        document.querySelector('#yeucauchatluong').innerHTML =
            `<div class="col-4">
                <div class="custom-control custom-radio">
                    <input class="custom-control-input" type="radio" id="baibaokhcn-ncv" name="lsp" value="BaiBao" onclick="Get_thanhtoanncv('BaiBao',render_spkhcn)">
                    <label for="baibaokhcn-ncv" class="custom-control-label">BÀI BÁO</label>
                </div>
            </div>
            <div class="col-4">
                <div class="custom-control custom-radio">
                    <input class="custom-control-input" type="radio" id="sachkhcn-ncv" name="lsp" value="Sach" onclick="Get_thanhtoanncv('Sach',render_spkhcn)">
                    <label for="sachkhcn-ncv" class="custom-control-label">SÁCH/CHƯƠNG SÁCH</label>
                </div>
            </div>
            <div class="col-4">
                <div class="custom-control custom-radio">
                    <input class="custom-control-input" type="radio" id="spkkhcn-ncv" name="lsp" value="SPK" onclick="Get_thanhtoanncv('SPK',render_spkhcn)">
                    <label for="spkkhcn-ncv" class="custom-control-label">SẢN PHẨM KHÁC</label>
                </div>
            </div>`;
    } else {
        document.querySelector('#yeucauchatluong').innerHTML =
            `<div class="col-4">
                <div class="custom-control custom-radio">
                    <input class="custom-control-input" type="radio" id="baibao" name="lsp" value="BaiBao" onclick="loadloaibaibao()">
                    <label for="baibao" class="custom-control-label">BÀI BÁO</label>
                </div>
            </div>
            <div class="col-4">
                <div class="custom-control custom-radio">
                    <input class="custom-control-input" type="radio" id="spud" name="lsp" value="SPUD" onclick="loadloaibaibao()">
                    <label for="spud" class="custom-control-label">SẢN PHẨM ỨNG DỤNG</label>
                </div>
            </div>
            <div class="col-4">
                <div class="custom-control custom-radio">
                    <input class="custom-control-input" type="radio" id="shtt" name="lsp" value="SHTT" onclick="loadloaibaibao()">
                    <label for="shtt" class="custom-control-label">SỞ HỮU TRÍ TUỆ</label>
                </div>
            </div>`;
    }
}
function loadradio2() {
    document.querySelector('#yeucauchatluong').innerHTML = ``;
    document.querySelector('#loaisanpham').innerHTML = ``;
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    try {
        document.querySelector('#tongthanhtien').innerHTML = ``;
    } catch { }
    document.querySelector('#loaibaibao').innerHTML = ``;
    var loaihinh = document.querySelector('input[name="tick-rank-kekhai"]:checked').value;
    if (valuerank != "Giảng viên") {
        document.querySelector('#yeucauchatluong').innerHTML =
            `<div class="col-4">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="baibaokhcn-ncv" name="lsp" value="BaiBao" onclick="Get_thanhtoanncv('BaiBao',render_spkhcn)">
                        <label for="baibaokhcn-ncv" class="custom-control-label">BÀI BÁO</label>
                    </div>
                </div>
                <div class="col-4">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="sachkhcn-ncv" name="lsp" value="Sach" onclick="Get_thanhtoanncv('Sach',render_spkhcn)">
                        <label for="sachkhcn-ncv" class="custom-control-label">SÁCH/CHƯƠNG SÁCH</label>
                    </div>
                </div>
                <div class="col-4">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="spkkhcn-ncv" name="lsp" value="SPK" onclick="Get_thanhtoanncv('SPK',render_spkhcn)">
                        <label for="spkkhcn-ncv" class="custom-control-label">SẢN PHẨM KHÁC</label>
                    </div>
                </div>`;
    } else if (valuerank == "Giảng viên" && loaihinh == "Nghiên cứu mạnh") {
        document.querySelector('#yeucauchatluong').innerHTML =
            `
                <div class="col-2">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="tcgv" name="lsp" value="TapChi" onclick="Get_spkhcn('TapChi',render_spkhcn)">
                        <label for="tcgv" class="custom-control-label">TẠP CHÍ</label>
                    </div>
                </div>
                <div class="col-2">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="ntgv" name="lsp" value="SHTT" onclick="Get_spkhcn('SHTT',render_spkhcn)">
                        <label for="ntgv" class="custom-control-label">Sở hữu trí tuệ</label>
                    </div>
                </div>
                `;
    } else if (valuerank == "Giảng viên" && loaihinh == "Khối lượng") {
        document.querySelector('#yeucauchatluong').innerHTML =
            `<div class="col-2">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="sgv" name="lsp" value="Sach"  onclick="Get_spkhcn('Sach',render_spkhcn)">
                        <label for="sgv" class="custom-control-label">SÁCH</label>
                    </div>
                </div>
                <div class="col-2">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="dtgv" name="lsp" value="DeTai" onclick="Get_spkhcn('DeTai',render_spkhcn)">
                        <label for="dtgv" class="custom-control-label">ĐỀ TÀI NCKH</label>
                    </div>
                </div>
                <div class="col-2">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="tcgv" name="lsp" value="TapChi" onclick="Get_spkhcn('TapChi',render_spkhcn)">
                        <label for="tcgv" class="custom-control-label">TẠP CHÍ</label>
                    </div>
                </div>

                <div class="col-2">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="shttgv" name="lsp" value="HDSV" onclick="Get_spkhcn('HDNCKH',render_spkhcn)">
                        <label for="shttgv" class="custom-control-label">HDSV</label>
                    </div>
                </div>
                <div class="col-2">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="ntgv" name="lsp" value="SHTT" onclick="Get_spkhcn('SHTT',render_spkhcn)">
                        <label for="ntgv" class="custom-control-label">Sở hữu trí tuệ</label>
                    </div>
                </div>
                <div class="col-2">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="spkkhcn-ncv" name="lsp" value="NgheThuat" onclick="Get_spkhcn('NgheThuat',render_spkhcn)">
                        <label for="spkkhcn-ncv" class="custom-control-label">SP NGHỆ THUẬT</label>
                    </div>
                </div>`;
    } else if (valuerank == "Giảng viên" && loaihinh == "Đề tài") {
        document.querySelector('#yeucauchatluong').innerHTML =
            `<div class="col-2">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="BaiBao" name="lsp" value="Bài báo"  onclick="loadloaibaibao()">
                        <label for="BaiBao" class="custom-control-label">BÀI BÁO</label>
                    </div>
                </div>
                <div class="col-2">
                    <div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="SPUD" name="lsp" value="Sản phẩm ứng dụng"  onclick="Get_spkhcn_lsp('SPUD',render_spkhcn)">
                        <label for="SPUD" class="custom-control-label">SẢN PHẨM ỨNG DỤNG</label>
                    </div>
                </div>
                `;
    }
}

//----------------------------------

//Tinh tien

function checkcheck(a, callback) {
    fetch(linkapiID + a, {
        headers: {
            'Authorization': 'Bearer ' + _token,
            'Content-Type': 'application/json'
        }
    })
        .then(function (res) {
            return res.json(); Ï
        })
        .then(callback);
}
function render_check2(diem, tietchuan, lsps) {
    var checkbox = document.querySelector('#tongthanhtien');
    var tg = Number(document.querySelector('#tacgia').value);
    //var cq = Number(document.querySelector('#coquancongtac').value);
    var Diem = Number(diem);
    var TC = Number(tietchuan);
    checkbox.innerHTML = `<label style="color: red; margin-left: 60%; font-size: 120%"> Tổng kinh phí: <label id="total">${tongkinhphi}</label> </label>`;
}
function render_check(kinhphi, lsps) {
    try {
        var checkbox = document.querySelector('#tongthanhtien');
    } catch { }
    var tg = Number(document.querySelector('#tacgia').value);
    //var cq = Number(document.querySelector('#coquancongtac').value);
    var tongkinhphi = Number(kinhphi);
    checkbox.innerHTML = `<label style="color: red; margin-left: 60%; font-size: 120%"> Tổng kinh phí: <label id="total">${tongkinhphi}</label> </label>`;
}

linkapiID2 = "https://localhost:44364/api/QuyDoiGV/Get-id?id=";
function checkcheckncv(a, callback) {
    fetch(linkapiID2 + a, {
        headers: {
            'Authorization': 'Bearer ' + _token,
            'Content-Type': 'application/json'
        }
    })
        .then(function (res) {
            return res.json(); Ï
        })
        .then(callback);
}

function render_checkncv(tietchuan, diem, lsps) {
    show_yc();
    try {
        var checkbox = document.querySelector('#tongthanhtien');
        checkbox.innerHTML = `<label style="font-size:1.5rem;color:#dc3545">Tiết chuẩn:</label> <label id="tietchuan"style="font-size:1.5rem;color:#dc3545">${tietchuan}</label>   <label style="font-size:1.5rem;color:#dc3545">Điểm:</label> <label id="diem" style="font-size:1.5rem;color:#dc3545">${diem}</label>`;
    } catch { }
    /*if (texttacgia == "Tác giả chính") {
        if (sltg == 1) {
            thucnhantietchuan = Number(tietchuan);
            thucnhandiem = Number(diem);
        } else if (sltg > 1) {
            thucnhandiem = Number(diem) / 2;
            thucnhantietchuan = (Number(tietchuan) * 0.8) / 2;
        }
    }
    if (texttacgia == "Tác giả phụ") {
        if (sltg > 2) {
            thucnhantietchuan = (tietchuan * 0.2) / (sltg - 2);
            thucnhandiem = diem / 2;
        } else {
            //
        }
    }
    if (texttacgia == "Tác giả liên hệ") {
        if (sltg == 1) {
            thucnhantietchuan = tietchuan;
            thucnhandiem = diem;
        } else if (sltg > 1) {
            thucnhantietchuan = (tietchuan * 0.8) / 2;
            thucnhandiem = diem / 2;
        }
    }

    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    if (valuerank != "Giảng viên") {
        checkbox.innerHTML = `<label style="color: red; margin-left: 60%; font-size: 120%"> Tổng tiết tiết chuẩn/điểm:<label id="total"> ${thucnhantietchuan}/${thucnhandiem}</label > </label >`;
    } else {
        checkbox.innerHTML = `<label style="color: red; margin-left: 60%; font-size: 120%"> Tổng tiết chuẩn/điểm:<label id="total"> ${thucnhantietchuan}/${thucnhandiem}</label > </label >`;
    }*/
}
//----------------------------------
// CKFinder

// gửi xét duyệt
function send(data) {
    var linksend = "https://localhost:44364/api/DanhMucXetDuyet/Send";
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _token,
        },
        body: JSON.stringify(data),
    };
    fetch(linksend, options)
        .then(response => {
            if (response.ok) {
                alert('Đăng ký thành công');
                window.location.href = '/Article/SendMail';
            } else if (response.status == 400) {
                alert('Tên bài báo đã được đăng ký');
            }
        });
}
function groupUser() {
    var table = document.getElementById("tbtacgia2");
    var groupUser = "";

    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];

        for (let j = 0; j < row.cells.length; j++) {
            const cell = row.cells[j];
            groupUser += cell.textContent + ";";
        }

        groupUser = groupUser.slice(0, -1);
        groupUser += "$";
    }
    groupUser = groupUser.slice(0, -1);
    return groupUser;
}
var userId = _idUser;

function BrowseServer(field) {
    var finder = new CKFinder();
    finder.selectActionFunction = function (fileUrl) {
        var userDirectory = "/Uploads/" + userId + "/"; // Thư mục lưu trữ riêng cho người dùng
        var fileUrlWithUserDir = userDirectory + fileUrl.substring(fileUrl.lastIndexOf("/") + 1); // Đường dẫn đầy đủ của tệp tin trong thư mục người dùng
        document.getElementById(field).value = decodeURIComponent(fileUrlWithUserDir).replace(/\%20/g, ' ');
        // Gửi đường dẫn tệp tin và userId lên server để lưu trữ
        SaveFile(fileUrl, userId);
    };
    finder.popup();
}

function SaveFile(fileUrl, userId) {
    var data = {
        fileUrl: fileUrl,
        userId: userId
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
function handleSend() {
    var sltg = document.querySelector('#tongsltg').textContent;
    var valueloaihinh = document.querySelector('input[name="tick-rank-kekhai"]:checked').value;
    var textElement = document.getElementById("myFile").value;
    var minhchung = textElement;
    var date = document.querySelector('#datesubmit').value;
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    var valuetenbaibao = document.querySelector('#input-name').value;
    var valuecategory = document.querySelector('input[name="category"]:checked').value;
    var valuelbname = document.querySelector('#lbname').textContent;
    //alert("Tên danh mục:" + valuelbname + valueloaihinh + date + valuerank + valuetenbaibao + valuecategory + valuelbname);
    var valueyeucau = document.querySelector('input[name="yc"]:checked').value;
    ///
    var valuelbissn = document.querySelector('#lbissn').textContent;
    var total = document.querySelector('#total').textContent;
    // alert("issn:" + valuelbissn);
    var valuelbeissn = document.querySelector('#lbeissn').textContent;
    // alert("eissn:" + valuelbeissn);
    var optionstacgia = document.querySelector('#tacgia');
    var texttacgia = optionstacgia.options[optionstacgia.selectedIndex].textContent;
    // alert("Tác giả:" + texttacgia);
    var tg = groupUser();

    /*var mnv = table.rows[i].cells[1].textContent;
    var coquan = table.rows[i].cells[2].textContent;
    var loaitacgia = table.rows[i].cells[3].textContent;
    var tongnhan = table.rows[i].cells[4].textContent;
    var thucnhan = table.rows[i].cells[5].textContent;
    var diem = table.rows[i].cells[6].textContent;
    var tiet = table.rows[i].cells[7].textContent;
    var mnvtgc = table.rows[1].cells[1].textContent;
    var tg = mnv + ";" + coquan + ";" + loaitacgia + ";" + tongnhan + ";" + thucnhan + ";" + diem + ";" + tiet;*/
    var data = {
        journal_name: valuelbname,
        issn: valuelbissn,
        eissn: valuelbeissn,
        category: valuecategory,
        citations: "",
        if_2022: "",
        jci: "",
        percentageOAGold: "",
        userId: _idUser,
        rank: valuerank,
        image: minhchung,
        link: "",
        tenBaiBao: valuetenbaibao,
        type: valueyeucau,
        groupUser: tg,
        status: "Đang đợi duyệt",
        quantity: sltg,
        total: total,
        ghiChu: "",
        dateSubmit: date
    }
    send(data);
}
    //----------------------------------
    //document.querySelector('input[name="tick-rank"]:checked').value;
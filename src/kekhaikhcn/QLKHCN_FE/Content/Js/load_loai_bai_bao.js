function clear_option() {
    document.querySelector('#search-issn').value = "";
    document.querySelector('#checkbox-result-issn-eissn').innerHTML = ``;
}
function loadloaibaibao() {
    var loaisp = document.querySelector('input[name="lsp"]:checked').value;
    if (loaisp == "Bài báo") {

        var div = document.querySelector('#loaibaibao').innerHTML = `<div class="col-4">
                                                                                <div class="custom-control custom-radio">
                                                                                    <input class="custom-control-input" type="radio" id="baibaoqt" name="lbb" value="CSP" onclick="Get_loaisanpham('BaiBao_CSP',render_lsp)">
                                                                                    <label for="baibaoqt" class="custom-control-label">CÓ SẢN PHẨM ĐÀO TẠO</label>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-4">
                                                                                <div class="custom-control custom-radio">
                                                                                    <input class="custom-control-input" type="radio" id="baibaotn" name="lbb" value="KSP" onclick="Get_loaisanpham('BaiBao_KSP',render_lsp)">
                                                                                    <label for="baibaotn" class="custom-control-label">KHÔNG CÓ SẢN PHẨM ĐÀO TẠO</label>
                                                                                </div>
                                                                            </div>
                                                                           `;
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
                                    <label for="myFile">Upload minh chứng</label>
                                    <input type="text" class="form-control" placeholder="Nhập minh chứng" id="myFile" name="myFile" readonly />
                                    <input type="button" value="Tải ảnh" onclick="BrowseServer('myFile');" />
                                </div>
                            </div>
                        </div>
                    </div>`;

        document.querySelector('#option-national-country').disabled = true;
    } else if (loaisp == "SPUD") {
        document.querySelector('#loaibaibao').innerHTML = ``;
        Get_loaisanpham('SPUD', render_lsp);
    }
    else {
        document.querySelector('#loaibaibao').innerHTML = ``;
        Get_loaisanpham('SHTT', render_lsp);
    }

}


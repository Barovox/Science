function loadtable() {
    var sltgc = Number(document.querySelector('#sltgc').value);
    var sltgp = Number(document.querySelector('#sltgp').value);
    var sltglh = Number(document.querySelector('#sltglh').value);
    var sltg = sltgc + sltgp + sltglh;
    try {
        var tietchuan = Number(document.querySelector('#tietchuan').textContent);

    } catch {
        alert("Chọn hình thức thanh toán!");
    }
    var diem = Number(document.querySelector('#diem').textContent);
    var table = document.getElementById("tablethanhtoan");
    var trtable = ``;
    try {
        var total = Number(document.querySelector('#total').textContent);

    } catch {
        var total = 0;
    }
    var tongdonggop = 0;
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    var valueloaihinh = document.querySelector('input[name="tick-rank-kekhai"]:checked').value;
    var valuelsp = document.querySelector('input[name="lsp"]:checked').value;
    for (let j = 0; j < sltg; j++) {
        try {
            var donggop = Number(document.querySelector('#donggop-' + j).value);

        } catch { }
        tongdonggop += donggop;
        if (tongdonggop > 100) {

            try { document.querySelector('#donggop-' + j).value = 0; } catch { }
        }

    }
    if (tongdonggop > 100) {
        alert('Đóng góp quá 100%!');
    } else {
        if (valuerank == "Giảng viên" && valueloaihinh == "Khối lượng") {
            for (let i = 0; i < sltg; i++) {
                trtable += `<tr>
                        <td>${i + 1}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>

                    </tr>`;
            }
            table.innerHTML = trtable;
            for (let i = 0; i < sltg; i++) {
                var tacgia = document.querySelector('#inp-username-id-mail-' + i).value;
                table.rows[i].cells[1].innerHTML = tacgia;
            }
            for (let i = 0; i < sltg; i++) {
                var optionscongtac = document.querySelector('#coquancongtac-' + i);
                var textcongtac = optionscongtac.options[optionscongtac.selectedIndex].textContent;
                table.rows[i].cells[2].innerHTML = textcongtac;
            } for (let i = 0; i < sltg; i++) {
                var optionstg = document.querySelector('#tg-' + i);
                var texttg = optionstg.options[optionstg.selectedIndex].textContent;
                table.rows[i].cells[3].innerHTML = texttg;
            }
            if (sltg == 2) {
                for (let i = 0; i < sltg; i++) {
                    var coquan = table.rows[i].cells[2].textContent;
                    try { var donggop = Number(document.querySelector('#donggop-' + i).value); } catch { }
                    if (sltg == 2) {
                        if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                            table.rows[i].cells[4].innerHTML = `0`;
                            table.rows[i].cells[5].innerHTML = `0`;
                            table.rows[i].cells[6].innerHTML = `0`;
                            table.rows[i].cells[7].innerHTML = `0`;
                        } if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                            table.rows[i].cells[4].innerHTML = `${((total / 2) / sltg)}`;
                            table.rows[i].cells[5].innerHTML = `${(((total / 2) / sltg)) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;
                        } else if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                            table.rows[i].cells[4].innerHTML = `${(total / 2)}`;
                            table.rows[i].cells[5].innerHTML = `${((total / 2)) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;
                        }
                    }
                }
            }
            else if (sltg > 2 && (sltgc + sltglh) > 1 && sltgp > 0) {
                for (let i = 0; i < sltg; i++) {
                    try { var donggop = Number(document.querySelector('#donggop-' + i).value); } catch { }

                    var coquan = table.rows[i].cells[2].textContent;
                    var optionstg1 = document.querySelector('#tg-' + i);
                    var texttg1 = optionstg1.options[optionstg1.selectedIndex].textContent;

                    if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                        table.rows[i].cells[4].innerHTML = `0`;
                        table.rows[i].cells[5].innerHTML = `0`;
                        table.rows[i].cells[6].innerHTML = `0`;
                        table.rows[i].cells[7].innerHTML = `0`;
                    } else if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                        if (texttg1 == "Tác giả chính") {
                            table.rows[i].cells[4].innerHTML = `0`;
                            table.rows[i].cells[5].innerHTML = `0`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${(((tietchuan * 0.8) / (sltgc + sltglh))) / 2}`;

                        } else if (texttg1 == "Tác giả phụ") {
                            table.rows[i].cells[4].innerHTML = `0`;
                            table.rows[i].cells[5].innerHTML = `0`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${(tietchuan * 0.2) / 2 / sltgp}`;
                        } else if (texttg1 == "Tác giả liên hệ") {
                            table.rows[i].cells[4].innerHTML = `0`;
                            table.rows[i].cells[5].innerHTML = `0`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${(tietchuan * 0.8) / 2 / (sltgc + sltglh)}`;
                        }

                    } else if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                        if (texttg1 == "Tác giả chính") {

                            table.rows[i].cells[4].innerHTML = `${(((total * 0.75) / (sltgc + sltglh)))}`;
                            table.rows[i].cells[5].innerHTML = `${(((total * 0.75) / (sltgc + sltglh))) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${(((tietchuan * 0.8) / (sltgc + sltglh)))}`;

                        } else if (texttg1 == "Tác giả phụ") {
                            table.rows[i].cells[4].innerHTML = `${total * 0.25 / sltgp}`;
                            table.rows[i].cells[5].innerHTML = `${((total * 0.25) / sltgp) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan * 0.2 / sltgp}`;
                        } else if (texttg1 == "Tác giả liên hệ") {
                            table.rows[i].cells[4].innerHTML = `${((total * 0.75) / (sltgc + sltglh))}`;
                            table.rows[i].cells[5].innerHTML = `${((total * 0.75) / (sltgc + sltglh)) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${((tietchuan * 0.8) / (sltgc + sltglh))}`;
                        }
                    }

                }
            }


            if (sltgc == 1 && sltg == 1) {
                var coquan = table.rows[0].cells[2].textContent;
                try {
                    var donggop = Number(document.querySelector('#donggop-0').value);

                } catch { }

                if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                    table.rows[0].cells[4].innerHTML = `0`;
                    table.rows[0].cells[5].innerHTML = `0`;
                    table.rows[0].cells[6].innerHTML = `0`;
                    table.rows[0].cells[7].innerHTML = `0`;

                } else if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                    table.rows[0].cells[4].innerHTML = `${total / 2}`;
                    table.rows[0].cells[5].innerHTML = `${(total / 2) * 0.9}`;
                    table.rows[0].cells[6].innerHTML = `${diem}`;
                    table.rows[0].cells[7].innerHTML = `${tietchuan}`;
                } else {
                    table.rows[0].cells[4].innerHTML = `${total}`;
                    table.rows[0].cells[5].innerHTML = `${(total) * 0.9}`;
                    table.rows[0].cells[6].innerHTML = `${diem}`;
                    table.rows[0].cells[7].innerHTML = `${tietchuan}`;
                }
            }
        }
        if (valuerank == "Nghiên cứu viên 1" && valueloaihinh == "Khối lượng") {
            for (let i = 0; i < sltg; i++) {
                trtable += `<tr>
                        <td>${i + 1}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>

                    </tr>`;
            }
            table.innerHTML = trtable;
            for (let i = 0; i < sltg; i++) {
                var tacgia = document.querySelector('#inp-username-id-mail-' + i).value;
                table.rows[i].cells[1].innerHTML = tacgia;
            }
            for (let i = 0; i < sltg; i++) {
                var optionscongtac = document.querySelector('#coquancongtac-' + i);
                var textcongtac = optionscongtac.options[optionscongtac.selectedIndex].textContent;
                table.rows[i].cells[2].innerHTML = textcongtac;
            } for (let i = 0; i < sltg; i++) {
                var optionstg = document.querySelector('#tg-' + i);
                var texttg = optionstg.options[optionstg.selectedIndex].textContent;
                table.rows[i].cells[3].innerHTML = texttg;
            }
            if (sltg == 2) {
                for (let i = 0; i < sltg; i++) {
                    var coquan = table.rows[i].cells[2].textContent;
                    try { var donggop = Number(document.querySelector('#donggop-' + i).value); } catch { }
                    if (sltg == 2) {
                        if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                            table.rows[i].cells[4].innerHTML = `0`;
                            table.rows[i].cells[5].innerHTML = `0`;
                            table.rows[i].cells[6].innerHTML = `0`;
                            table.rows[i].cells[7].innerHTML = `0`;
                        } if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                            table.rows[i].cells[4].innerHTML = `${((total / 2) / sltg)}`;
                            table.rows[i].cells[5].innerHTML = `${(((total / 2) / sltg)) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;
                        } else if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                            table.rows[i].cells[4].innerHTML = `${(total / 2)}`;
                            table.rows[i].cells[5].innerHTML = `${((total / 2)) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;
                        }
                    }
                }
            }
            else if (sltg > 2 && (sltgc + sltglh) < sltg) {
                for (let i = 0; i < sltg; i++) {
                    try { var donggop = Number(document.querySelector('#donggop-' + i).value); } catch { }

                    var coquan = table.rows[i].cells[2].textContent;
                    var optionstg1 = document.querySelector('#tg-' + i);
                    var texttg1 = optionstg1.options[optionstg1.selectedIndex].textContent;

                    if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                        table.rows[i].cells[4].innerHTML = `0`;
                        table.rows[i].cells[5].innerHTML = `0`;
                        table.rows[i].cells[6].innerHTML = `0`;
                        table.rows[i].cells[7].innerHTML = `0`;
                    } else if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                        if (texttg1 == "Tác giả chính") {
                            table.rows[i].cells[4].innerHTML = `${(((total * 0.8) / (sltgc + sltglh))) / 2}`;
                            table.rows[i].cells[5].innerHTML = `${(((total * 0.8) / (sltgc + sltglh))) / 2 * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;

                        } else if (texttg1 == "Tác giả phụ") {
                            table.rows[i].cells[4].innerHTML = `${(total * 0.2) / 2 / sltgp}`;
                            table.rows[i].cells[5].innerHTML = `${((total * 0.2) / 2 / sltgp) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;
                        } else if (texttg1 == "Tác giả liên hệ") {
                            table.rows[i].cells[4].innerHTML = `${(total * 0.8) / 2 / (sltgc + sltglh)}`;
                            table.rows[i].cells[5].innerHTML = `${((total * 0.8) / 2 / (sltgc + sltglh)) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;
                        }

                    } else if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                        if (texttg1 == "Tác giả chính") {

                            table.rows[i].cells[4].innerHTML = `${(((total * 0.8) / (sltgc + sltglh)))}`;
                            table.rows[i].cells[5].innerHTML = `${(((total * 0.8) / (sltgc + sltglh))) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;

                        } else if (texttg1 == "Tác giả phụ") {
                            table.rows[i].cells[4].innerHTML = `${total * 0.2 / sltgp}`;
                            table.rows[i].cells[5].innerHTML = `${((total * 0.2) / sltgp) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;
                        } else if (texttg1 == "Tác giả liên hệ") {
                            table.rows[i].cells[4].innerHTML = `${((total * 0.8) / (sltgc + sltglh))}`;
                            table.rows[i].cells[5].innerHTML = `${((total * 0.8) / (sltgc + sltglh)) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;
                        }
                    }

                }
            }


            if (sltgc == 1 && sltg == 1) {
                var coquan = table.rows[0].cells[2].textContent;
                try {
                    var donggop = Number(document.querySelector('#donggop-0').value);

                } catch { }

                if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                    table.rows[0].cells[4].innerHTML = `0`;
                    table.rows[0].cells[5].innerHTML = `0`;
                    table.rows[0].cells[6].innerHTML = `0`;
                    table.rows[0].cells[7].innerHTML = `0`;

                } else if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                    table.rows[0].cells[4].innerHTML = `${total / 2}`;
                    table.rows[0].cells[5].innerHTML = `${(total / 2) * 0.9}`;
                    table.rows[0].cells[6].innerHTML = `${diem}`;
                    table.rows[0].cells[7].innerHTML = `${tietchuan}`;
                } else {
                    table.rows[0].cells[4].innerHTML = `${total}`;
                    table.rows[0].cells[5].innerHTML = `${(total) * 0.9}`;
                    table.rows[0].cells[6].innerHTML = `${diem}`;
                    table.rows[0].cells[7].innerHTML = `${tietchuan}`;
                }
            }
        }
        ////// 1 tác giả chính, 1 tác giả liên hệ , 1 phụ
        if (valuerank == "Giảng viên" && valueloaihinh == "Nghiên cứu mạnh" && sltgc == 1 && sltglh == 1 && sltgp == 1 && sltg == 3) {
            for (let i = 0; i < sltg; i++) {
                trtable += `<tr>
                                    <td>${i + 1}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>`;
            }
            table.innerHTML = trtable;
            for (let i = 0; i < sltg; i++) {
                var tacgia = document.querySelector('#inp-username-id-mail-' + i).value;
                table.rows[i].cells[1].innerHTML = tacgia;
            }
            for (let i = 0; i < sltg; i++) {
                var optionscongtac = document.querySelector('#coquancongtac-' + i);
                var textcongtac = optionscongtac.options[optionscongtac.selectedIndex].textContent;
                table.rows[i].cells[2].innerHTML = textcongtac;
            } for (let i = 0; i < sltg; i++) {
                var optionstg = document.querySelector('#tg-' + i);
                var texttg = optionstg.options[optionstg.selectedIndex].textContent;
                table.rows[i].cells[3].innerHTML = texttg;
            }
            for (let i = 1; i < sltg; i++) {
                var coquantgc = table.rows[0].cells[2].textContent;
                var optionstg = document.querySelector('#tg-' + i);
                var texttg = optionstg.options[optionstg.selectedIndex].textContent;
                var optionstgc = document.querySelector('#coquancongtac-0');
                var texttgc = optionstgc.options[optionstgc.selectedIndex].textContent;
                var coquan = table.rows[i].cells[2].textContent;
                /// tgc 0%
                if (texttgc == "(1) ngoài UEF, (2) UEF (20%)" || texttgc == "Cơ quan công tác ngoài UEF (0%)") {

                    var donggoptgc = Number(document.querySelector('#donggop-0').value);
                    //tglh 0%
                    if (table.rows[sltg - 1].cells[2].textContent != "Cơ quan công tác duy nhất UEF (100%)" && table.rows[sltg - 1].cells[2].textContent != "(1) UEF – (2) ngoài UEF (80%)") {

                        // tgc 0, tglh 0, tgp 50
                        if (table.rows[sltg - 2].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                            var donggop = document.querySelector('#donggop-' + i).value;
                            var donggoptgc = document.querySelector('#donggop-0').value;
                            table.rows[i].cells[4].innerHTML = `${total / 8 * donggop / 100}`;
                            table.rows[i].cells[5].innerHTML = `${(total / 8 * donggop / 100) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `0`;
                            table.rows[0].cells[4].innerHTML = `${total / 8 * donggoptgc / 100}`;
                            table.rows[0].cells[5].innerHTML = `${total / 8 * donggoptgc / 100 * 0.9} `;
                            table.rows[0].cells[6].innerHTML = `0`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            table.rows[2].cells[4].innerHTML = `${total / 8 * donggop / 100}`;
                            table.rows[2].cells[5].innerHTML = `${(total / 8 * donggop / 100) * 0.9}`;
                            table.rows[2].cells[6].innerHTML = `0`;
                            table.rows[2].cells[7].innerHTML = `0`;

                        }
                        // tgc 0, tglh 0, tgp 100
                        else if (table.rows[sltg - 2].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                            var donggop = document.querySelector('#donggop-' + i).value;
                            var donggoptgc = document.querySelector('#donggop-0').value;
                            table.rows[i].cells[4].innerHTML = `${total / 4 * donggop / 100}`;
                            table.rows[i].cells[5].innerHTML = `${(total / 4 * donggop / 100) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `0`;
                            table.rows[0].cells[4].innerHTML = `${total / 4 * donggoptgc / 100}`;
                            table.rows[0].cells[5].innerHTML = `${total / 4 * donggoptgc / 100 * 0.9} `;
                            table.rows[0].cells[6].innerHTML = `0`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            table.rows[2].cells[4].innerHTML = `${total / 4 * donggop / 100}`;
                            table.rows[2].cells[5].innerHTML = `${(total / 4 * donggop / 100) * 0.9}`;
                            table.rows[2].cells[6].innerHTML = `0`;
                            table.rows[2].cells[7].innerHTML = `0`;
                        }
                        // tgc 0, tglh 0, tgp 0
                        else {
                            var donggop = document.querySelector('#donggop-' + i).value;
                            var donggoptgc = document.querySelector('#donggop-0').value;
                            table.rows[i].cells[4].innerHTML = `0`;
                            table.rows[i].cells[5].innerHTML = `0`;
                            table.rows[i].cells[6].innerHTML = `0`;
                            table.rows[i].cells[7].innerHTML = `0`;
                            table.rows[0].cells[4].innerHTML = `0`;
                            table.rows[0].cells[5].innerHTML = `0`;
                            table.rows[0].cells[6].innerHTML = `0`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            table.rows[2].cells[4].innerHTML = `0`;
                            table.rows[2].cells[5].innerHTML = `0`;
                            table.rows[2].cells[6].innerHTML = `0`;
                            table.rows[2].cells[7].innerHTML = `0`;
                        }


                    }
                    //tglh 50
                    if (table.rows[sltg - 1].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                        // tgc 0 tgp 50 tglh 50
                        if (table.rows[sltg - 2].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                            var donggop = document.querySelector('#donggop-' + i).value;
                            var donggoptgc = document.querySelector('#donggop-0').value;
                            table.rows[i].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                            table.rows[i].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `0`;
                            table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                            table.rows[0].cells[5].innerHTML = `${total / 2 * donggoptgc / 100 * 0.9} `;
                            table.rows[0].cells[6].innerHTML = `0`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            table.rows[2].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                            table.rows[2].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                            table.rows[2].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[2].cells[7].innerHTML = `0`;
                        }
                        //tgc 0 tgp 100 thlh 50
                        else if (table.rows[sltg - 2].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                            var donggop = document.querySelector('#donggop-' + i).value;
                            var donggoptgc = document.querySelector('#donggop-0').value;
                            table.rows[i].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                            table.rows[i].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `0`;
                            table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                            table.rows[0].cells[5].innerHTML = `${total / 2 * donggoptgc / 100 * 0.9} `;
                            table.rows[0].cells[6].innerHTML = `0`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            table.rows[2].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                            table.rows[2].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                            table.rows[2].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[2].cells[7].innerHTML = `0`;
                        }
                        //tgc 0 tgp 0 thlh 50
                        else {
                            var donggop = document.querySelector('#donggop-' + i).value;
                            var donggoptgc = document.querySelector('#donggop-0').value;
                            table.rows[i].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                            table.rows[i].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `0`;
                            table.rows[i].cells[7].innerHTML = `0`;
                            table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                            table.rows[0].cells[5].innerHTML = `${total / 2 * donggoptgc / 100 * 0.9} `;
                            table.rows[0].cells[6].innerHTML = `0`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            table.rows[2].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                            table.rows[2].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                            table.rows[2].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[2].cells[7].innerHTML = `0`;
                        }


                    }
                    //tglh 100
                    if (table.rows[sltg - 1].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                        //tgc 0 tgp 50 thlh 100
                        if (table.rows[sltg - 2].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                            var donggop = document.querySelector('#donggop-' + i).value;
                            var donggoptgc = document.querySelector('#donggop-0').value;
                            table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                            table.rows[i].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `0`;
                            table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                            table.rows[0].cells[5].innerHTML = `${total * donggoptgc / 100 * 0.9} `;
                            table.rows[0].cells[6].innerHTML = `0`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            table.rows[2].cells[4].innerHTML = `${total * donggop / 100}`;
                            table.rows[2].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                            table.rows[2].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[2].cells[7].innerHTML = `0`;
                        }
                        //tgc 0 tgp 100 thlh 100
                        else if (table.rows[sltg - 2].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                            var donggop = document.querySelector('#donggop-' + i).value;
                            var donggoptgc = document.querySelector('#donggop-0').value;
                            table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                            table.rows[i].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `0`;
                            table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                            table.rows[0].cells[5].innerHTML = `${total * donggoptgc / 100 * 0.9} `;
                            table.rows[0].cells[6].innerHTML = `0`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            table.rows[2].cells[4].innerHTML = `${total * donggop / 100}`;
                            table.rows[2].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                            table.rows[2].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[2].cells[7].innerHTML = `0`;
                        }
                        //tgc 0 tgp 0 thlh 100
                        else {
                            var donggop = document.querySelector('#donggop-' + i).value;
                            var donggoptgc = document.querySelector('#donggop-0').value;
                            table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                            table.rows[i].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `0`;
                            table.rows[i].cells[7].innerHTML = `0`;
                            table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                            table.rows[0].cells[5].innerHTML = `${total * donggoptgc / 100 * 0.9} `;
                            table.rows[0].cells[6].innerHTML = `0`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            table.rows[2].cells[4].innerHTML = `${total * donggop / 100}`;
                            table.rows[2].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                            table.rows[2].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[2].cells[7].innerHTML = `0`;
                        }


                    }
                }
                //tgc 50
                if (texttgc == "(1) UEF – (2) ngoài UEF (80%)") {

                    var donggoptgc = Number(document.querySelector('#donggop-0').value);
                    //tglh 0%
                    if (table.rows[sltg - 1].cells[2].textContent == "(1) ngoài UEF, (2) UEF (20%)" || table.rows[sltg - 1].cells[2].textContent == "Cơ quan công tác ngoài UEF (0%)") {
                        // tgc 50, tglh 0, tgp 50
                        var donggop = document.querySelector('#donggop-' + i).value;
                        var donggoptgc = document.querySelector('#donggop-0').value;
                        table.rows[i].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                        table.rows[i].cells[7].innerHTML = `0`;
                        table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${total / 2 * donggoptgc / 100 * 0.9} `;
                        table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                        table.rows[0].cells[7].innerHTML = `0`;
                        table.rows[2].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                        table.rows[2].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                        table.rows[2].cells[6].innerHTML = `0`;
                        table.rows[2].cells[7].innerHTML = `0`;
                        if (table.rows[sltg - 2].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                            table.rows[1].cells[6].innerHTML = `${diem / 2}`;

                        }
                        // tgc 50, tglh 0, tgp 100
                        else if (table.rows[sltg - 2].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                            table.rows[1].cells[6].innerHTML = `${diem / 2}`;

                        }
                        // tgc 0, tglh 0, tgp 0
                        else {
                            table.rows[1].cells[6].innerHTML = `0`;

                        }


                    }
                    //tglh 50
                    if (table.rows[sltg - 1].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                        var donggop = document.querySelector('#donggop-' + i).value;
                        var donggoptgc = document.querySelector('#donggop-0').value;
                        table.rows[i].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                        table.rows[i].cells[7].innerHTML = `0`;
                        table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${total / 2 * donggoptgc / 100 * 0.9} `;
                        table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                        table.rows[0].cells[7].innerHTML = `0`;
                        table.rows[2].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                        table.rows[2].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                        table.rows[2].cells[6].innerHTML = `${diem / 2}`;
                        table.rows[2].cells[7].innerHTML = `0`;
                        // tgc 0 tgp 50 tglh 50
                        if (table.rows[sltg - 2].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                            table.rows[1].cells[6].innerHTML = `${diem / 2}`;

                        }
                        //tgc 0 tgp 100 thlh 50
                        else if (table.rows[sltg - 2].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                            table.rows[1].cells[6].innerHTML = `${diem / 2}`;

                        }
                        //tgc 0 tgp 0 thlh 50
                        else {
                            table.rows[1].cells[6].innerHTML = `0`;

                        }


                    }
                    //tglh 100
                    if (table.rows[sltg - 1].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                        //tgc 0 tgp 50 thlh 100
                        var donggop = document.querySelector('#donggop-' + i).value;
                        var donggoptgc = document.querySelector('#donggop-0').value;
                        table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                        table.rows[i].cells[7].innerHTML = `0`;
                        table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${total * donggoptgc / 100 * 0.9} `;
                        table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                        table.rows[0].cells[7].innerHTML = `0`;
                        table.rows[2].cells[4].innerHTML = `${total * donggop / 100}`;
                        table.rows[2].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                        table.rows[2].cells[6].innerHTML = `${diem / 2}`;
                        table.rows[2].cells[7].innerHTML = `0`;
                        if (table.rows[sltg - 2].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                            table.rows[1].cells[6].innerHTML = `${diem / 2}`;
                        }
                        //tgc 0 tgp 100 thlh 100
                        else if (table.rows[sltg - 2].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                            table.rows[1].cells[6].innerHTML = `${diem / 2}`;

                        }
                        //tgc 0 tgp 0 thlh 100
                        else {
                            table.rows[1].cells[6].innerHTML = `0`;

                        }


                    }
                }
                //////tgc 100
                if (texttgc == "Cơ quan công tác duy nhất UEF (100%)") {

                    var donggop = document.querySelector('#donggop-' + i).value;
                    var donggoptgc = document.querySelector('#donggop-0').value;
                    table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                    table.rows[i].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                    table.rows[i].cells[7].innerHTML = `0`;
                    table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                    table.rows[0].cells[5].innerHTML = `${total * donggoptgc / 100 * 0.9} `;
                    table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                    table.rows[0].cells[7].innerHTML = `0`;
                    table.rows[2].cells[4].innerHTML = `${total * donggop / 100}`;
                    table.rows[2].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                    table.rows[2].cells[7].innerHTML = `0`;
                    //tglh 0%
                    if (table.rows[sltg - 1].cells[2].textContent == "(1) ngoài UEF, (2) UEF (20%)" || table.rows[sltg - 1].cells[2].textContent == "Cơ quan công tác ngoài UEF (0%)") {
                        // tgc 100, tglh 0, tgp 50
                        table.rows[2].cells[6].innerHTML = `0`;
                    }
                    //tglh 50
                    if (table.rows[sltg - 1].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                        table.rows[2].cells[6].innerHTML = `${diem / 2}`;
                    }
                    //tglh 100
                    if (table.rows[sltg - 1].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                        //tgc 100 tgp 50 thlh 100
                        table.rows[2].cells[6].innerHTML = `${diem / 2}`;
                    }
                    //// kiểm tra cơ quan tác giả phụ
                    if (table.rows[sltg - 2].cells[2].textContent == "(1) ngoài UEF, (2) UEF (20%)" || table.rows[sltg - 2].cells[2].textContent == "Cơ quan công tác ngoài UEF (0%)") {
                        table.rows[1].cells[6].innerHTML = `0`;
                    }
                    if (table.rows[sltg - 2].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                        table.rows[1].cells[6].innerHTML = `${diem / 2}`;
                    }
                    if (table.rows[sltg - 2].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                        table.rows[1].cells[6].innerHTML = `${diem / 2}`;
                    }
                }
            }
        }
        ////// 1 tác giả chính, 1 tác giả liên hệ
        if (valuerank == "Giảng viên" && valueloaihinh == "Nghiên cứu mạnh" && sltgc == 1 && sltglh == 1 && sltgp == 0 && sltg == 2) {
            for (let i = 0; i < sltg; i++) {
                trtable += `<tr>
                                    <td>${i + 1}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>`;
            }
            table.innerHTML = trtable;
            for (let i = 0; i < sltg; i++) {
                var tacgia = document.querySelector('#inp-username-id-mail-' + i).value;
                table.rows[i].cells[1].innerHTML = tacgia;
            }
            for (let i = 0; i < sltg; i++) {
                var optionscongtac = document.querySelector('#coquancongtac-' + i);
                var textcongtac = optionscongtac.options[optionscongtac.selectedIndex].textContent;
                table.rows[i].cells[2].innerHTML = textcongtac;
            } for (let i = 0; i < sltg; i++) {
                var optionstg = document.querySelector('#tg-' + i);
                var texttg = optionstg.options[optionstg.selectedIndex].textContent;
                table.rows[i].cells[3].innerHTML = texttg;
            }
            for (let i = 1; i < sltg; i++) {
                var coquantgc = table.rows[0].cells[2].textContent;

                var optionstg = document.querySelector('#tg-' + i);
                var texttg = optionstg.options[optionstg.selectedIndex].textContent;
                var optionstgc = document.querySelector('#coquancongtac-0');
                var texttgc = optionstgc.options[optionstgc.selectedIndex].textContent;
                var coquan = table.rows[i].cells[2].textContent;
                if (texttgc == "(1) ngoài UEF, (2) UEF (20%)" || texttgc == "Cơ quan công tác ngoài UEF (0%)") {
                    var donggoptgc = Number(document.querySelector('#donggop-0').value);
                    if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                        document.querySelector('#donggop-' + i).disabled = false;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        var donggoptgc = document.querySelector('#donggop-0').value;
                        table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                        table.rows[i].cells[6].innerHTML = `${diem / 2}`;

                        table.rows[i].cells[7].innerHTML = `0`;
                        table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${total * donggoptgc / 100 * 0.9} `;
                        if (sltglh > 1) {
                            table.rows[0].cells[6].innerHTML = `0`;
                        } else {
                            table.rows[0].cells[6].innerHTML = `0`;
                        }
                        table.rows[0].cells[7].innerHTML = `0`;
                    }
                    if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {

                        table.rows[i].cells[4].innerHTML = `0`;
                        table.rows[i].cells[5].innerHTML = `0`;
                        if (sltglh > 1) {
                            table.rows[i].cells[6].innerHTML = `0`;
                        } else {
                            table.rows[i].cells[6].innerHTML = `0`;
                        }
                        table.rows[i].cells[6].innerHTML = `0`;

                        table.rows[0].cells[4].innerHTML = `0`;
                        table.rows[0].cells[5].innerHTML = `0`;
                        if (sltglh > 1) {
                            table.rows[0].cells[6].innerHTML = `0`;
                        } else {
                            table.rows[0].cells[6].innerHTML = `0`;
                        }
                        table.rows[0].cells[7].innerHTML = `0`;

                    } if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                        document.querySelector('#donggop-' + i).disabled = false;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        var donggoptgc = document.querySelector('#donggop-0').value;
                        table.rows[i].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                        table.rows[i].cells[6].innerHTML = `${diem / 2}`;

                        table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${total / 2 * donggoptgc / 100 * 0.9} `;
                        if (sltglh > 1) {
                            table.rows[0].cells[6].innerHTML = `0`;
                        } else {
                            table.rows[0].cells[6].innerHTML = `0`;
                        }
                        table.rows[0].cells[7].innerHTML = `0`;
                    }
                } if (texttgc == "(1) UEF – (2) ngoài UEF (80%)") {
                    var donggoptgc = Number(document.querySelector('#donggop-0').value);

                    if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                        table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${(total * donggoptgc / 100) * 0.9}`;
                        table.rows[0].cells[6].innerHTML = `${diem / 2}`;

                        table.rows[0].cells[7].innerHTML = `0`;
                        document.querySelector('#donggop-' + i).disabled = false;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        table.rows[1].cells[4].innerHTML = `${total * donggop / 100}`;
                        table.rows[1].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                        table.rows[1].cells[6].innerHTML = `${diem / 2}`;

                        table.rows[1].cells[7].innerHTML = `0`;
                    }
                    if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                        document.querySelector('#donggop-' + i).disabled = false;
                        table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${(total / 2 * donggoptgc / 100) * 0.9}`;
                        table.rows[0].cells[6].innerHTML = `${diem / 2}`;

                        table.rows[0].cells[7].innerHTML = `0`;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        table.rows[1].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                        table.rows[1].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[1].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[1].cells[6].innerHTML = `${diem}`;
                        }
                        table.rows[1].cells[7].innerHTML = `0`;
                    } if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                        table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${(total / 2 * donggoptgc / 100) * 0.9}`;
                        table.rows[0].cells[6].innerHTML = `${diem / 2}`;

                        table.rows[0].cells[7].innerHTML = `0`;
                        document.querySelector('#donggop-' + i).disabled = false;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        table.rows[i].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                        table.rows[i].cells[6].innerHTML = `${diem / 2}`;

                        table.rows[i].cells[7].innerHTML = `0`;
                    }
                }
                if (texttgc == "Cơ quan công tác duy nhất UEF (100%)") {
                    var donggoptgc = Number(document.querySelector('#donggop-0').value);
                    table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                    table.rows[0].cells[5].innerHTML = `${(total * donggoptgc / 100) * 0.9}`;
                    table.rows[0].cells[6].innerHTML = `${diem / 2}`;

                    table.rows[0].cells[7].innerHTML = `0`;
                    if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                        document.querySelector('#donggop-' + i).disabled = false;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        }
                        table.rows[i].cells[7].innerHTML = `0`;

                    } if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                        table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${total * donggop / 100 * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[i].cells[6].innerHTML = `0`;
                        } else {
                            table.rows[i].cells[6].innerHTML = `0`;
                        }
                        table.rows[i].cells[7].innerHTML = `0`;
                    } if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                        document.querySelector('#donggop-' + i).disabled = false;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        }
                        table.rows[i].cells[7].innerHTML = `0`;
                    }
                }
            }
        }
        ////// 1 tác giả chính, >1 tác giả liên hệ
        if (valuerank == "Giảng viên" && valueloaihinh == "Nghiên cứu mạnh" && sltg > 2 && sltgc == 1 && sltgp == 0 && sltglh > 1) {
            for (let i = 0; i < sltg; i++) {
                trtable += `<tr>
                        <td>${i + 1}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>`;
            }
            table.innerHTML = trtable;
            for (let i = 0; i < sltg; i++) {
                var tacgia = document.querySelector('#inp-username-id-mail-' + i).value;
                table.rows[i].cells[1].innerHTML = tacgia;
            }
            for (let i = 0; i < sltg; i++) {
                var optionscongtac = document.querySelector('#coquancongtac-' + i);
                var textcongtac = optionscongtac.options[optionscongtac.selectedIndex].textContent;
                table.rows[i].cells[2].innerHTML = textcongtac;
            } for (let i = 0; i < sltg; i++) {
                var optionstg = document.querySelector('#tg-' + i);
                var texttg = optionstg.options[optionstg.selectedIndex].textContent;
                table.rows[i].cells[3].innerHTML = texttg;
            }
            for (let i = 1; i < sltg; i++) {
                var coquantgc = table.rows[0].cells[2].textContent;
                var optionstg = document.querySelector('#tg-' + i);
                var texttg = optionstg.options[optionstg.selectedIndex].textContent;
                var optionstgc = document.querySelector('#coquancongtac-0');
                var texttgc = optionstgc.options[optionstgc.selectedIndex].textContent;
                var coquan = table.rows[i].cells[2].textContent;
                if (texttgc == "(1) ngoài UEF, (2) UEF (20%)" || texttgc == "Cơ quan công tác ngoài UEF (0%)") {
                    var donggoptgc = Number(document.querySelector('#donggop-0').value);
                    if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                        document.querySelector('#donggop-' + i).disabled = false;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        var donggoptgc = document.querySelector('#donggop-0').value;
                        table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[i].cells[6].innerHTML = `${diem}`;
                        }
                        table.rows[i].cells[7].innerHTML = `0`;
                        table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${total * donggoptgc / 100 * 0.9} `;
                        if (sltglh > 1) {
                            table.rows[0].cells[6].innerHTML = `0`;
                        } else {
                            table.rows[0].cells[6].innerHTML = `0`;
                        }
                        table.rows[0].cells[7].innerHTML = `0`;
                    }
                    if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {

                        table.rows[i].cells[4].innerHTML = `0`;
                        table.rows[i].cells[5].innerHTML = `0`;
                        if (sltglh > 1) {
                            table.rows[i].cells[6].innerHTML = `0`;
                        } else {
                            table.rows[i].cells[6].innerHTML = `0`;
                        }
                        table.rows[i].cells[6].innerHTML = `0`;

                        table.rows[0].cells[4].innerHTML = `0`;
                        table.rows[0].cells[5].innerHTML = `0`;
                        if (sltglh > 1) {
                            table.rows[0].cells[6].innerHTML = `0`;
                        } else {
                            table.rows[0].cells[6].innerHTML = `0`;
                        }
                        table.rows[0].cells[7].innerHTML = `0`;

                    } if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                        document.querySelector('#donggop-' + i).disabled = false;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        var donggoptgc = document.querySelector('#donggop-0').value;
                        table.rows[i].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[i].cells[6].innerHTML = `${diem}`;
                        }
                        table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${total / 2 * donggoptgc / 100 * 0.9} `;
                        if (sltglh > 1) {
                            table.rows[0].cells[6].innerHTML = `0`;
                        } else {
                            table.rows[0].cells[6].innerHTML = `0`;
                        }
                        table.rows[0].cells[7].innerHTML = `0`;
                    }
                } if (texttgc == "(1) UEF – (2) ngoài UEF (80%)") {
                    var donggoptgc = Number(document.querySelector('#donggop-0').value);

                    if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                        table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${(total * donggoptgc / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[0].cells[6].innerHTML = `${diem}`;
                        }
                        table.rows[0].cells[7].innerHTML = `0`;
                        document.querySelector('#donggop-' + i).disabled = false;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[i].cells[6].innerHTML = `${diem}`;
                        }
                        table.rows[i].cells[7].innerHTML = `0`;


                    }
                    if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                        document.querySelector('#donggop-' + i).disabled = false;
                        table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${(total / 2 * donggoptgc / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[0].cells[6].innerHTML = `${diem}`;
                        }
                        table.rows[0].cells[7].innerHTML = `0`;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        table.rows[1].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                        table.rows[1].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[1].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[1].cells[6].innerHTML = `${diem}`;
                        }
                        table.rows[1].cells[7].innerHTML = `0`;
                    } if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                        table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${(total / 2 * donggoptgc / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[0].cells[6].innerHTML = `${diem}`;
                        }
                        table.rows[0].cells[7].innerHTML = `0`;
                        document.querySelector('#donggop-' + i).disabled = false;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        table.rows[i].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total / 2 * donggop / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[i].cells[6].innerHTML = `${diem}`;

                        }
                        table.rows[i].cells[7].innerHTML = `0`;
                    }
                }
                if (texttgc == "Cơ quan công tác duy nhất UEF (100%)") {
                    var donggoptgc = Number(document.querySelector('#donggop-0').value);
                    table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                    table.rows[0].cells[5].innerHTML = `${(total * donggoptgc / 100) * 0.9}`;
                    table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                    table.rows[0].cells[7].innerHTML = `0`;
                    if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                        document.querySelector('#donggop-' + i).disabled = false;
                        table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                        table.rows[0].cells[5].innerHTML = `${(total * donggoptgc / 100) * 0.9}`;
                        table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                        table.rows[0].cells[7].innerHTML = `0`;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        }
                        table.rows[i].cells[7].innerHTML = `0`;

                    } if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                        table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${total * donggop / 100 * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[i].cells[6].innerHTML = `0`;
                        } else {
                            table.rows[i].cells[6].innerHTML = `0`;
                        }
                        table.rows[i].cells[7].innerHTML = `0`;
                    } if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                        document.querySelector('#donggop-' + i).disabled = false;
                        var donggop = document.querySelector('#donggop-' + i).value;
                        table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                        table.rows[i].cells[5].innerHTML = `${(total * donggop / 100) * 0.9}`;
                        if (sltglh > 1) {
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        } else {
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        }
                        table.rows[i].cells[7].innerHTML = `0`;
                    }
                }
            }
        }
        ////// có 1 tác giả chính
        if (valuerank == "Giảng viên" && valueloaihinh == "Nghiên cứu mạnh" && sltg == 1) {
            for (let i = 0; i < sltg; i++) {
                trtable += `<tr>
                        <td>${i + 1}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>`;
            }
            table.innerHTML = trtable;
            for (let i = 0; i < sltg; i++) {
                var tacgia = document.querySelector('#inp-username-id-mail-' + i).value;
                table.rows[i].cells[1].innerHTML = tacgia;
            }
            for (let i = 0; i < sltg; i++) {
                var optionscongtac = document.querySelector('#coquancongtac-' + i);
                var textcongtac = optionscongtac.options[optionscongtac.selectedIndex].textContent;
                table.rows[i].cells[2].innerHTML = textcongtac;
            } for (let i = 0; i < sltg; i++) {
                var optionstg = document.querySelector('#tg-' + i);
                var texttg = optionstg.options[optionstg.selectedIndex].textContent;
                table.rows[i].cells[3].innerHTML = texttg;
            }

            for (let i = 0; i < sltg; i++) {

                if (table.rows[0].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                    table.rows[0].cells[4].innerHTML = `${((total))}`;
                    table.rows[0].cells[5].innerHTML = `${(((total))) * 0.9}`;
                    table.rows[0].cells[6].innerHTML = `${diem}`;
                    table.rows[0].cells[7].innerHTML = `0`;
                } else if (table.rows[0].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                    table.rows[0].cells[4].innerHTML = `${((total / 2))}`;
                    table.rows[0].cells[5].innerHTML = `${(((total / 2))) * 0.9}`;
                    table.rows[0].cells[6].innerHTML = `${diem}`;
                    table.rows[0].cells[7].innerHTML = `0`;
                } else {
                    table.rows[0].cells[4].innerHTML = `0`;
                    table.rows[0].cells[5].innerHTML = `0`;
                    table.rows[0].cells[6].innerHTML = `0`;
                    table.rows[0].cells[7].innerHTML = `0`;
                }

            }


        }
        ///// 1 chính, 1 phụ hoặc 1 chính 1 liên hệ

        if (valuerank == "Giảng viên" && valueloaihinh == "Nghiên cứu mạnh" && sltg == 2 && sltgc == 1 && sltgp == 1) {
            for (let i = 0; i < sltg; i++) {
                trtable += `<tr>
                        <td>${i + 1}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>`;
            }
            table.innerHTML = trtable;
            for (let i = 0; i < sltg; i++) {
                var tacgia = document.querySelector('#inp-username-id-mail-' + i).value;
                table.rows[i].cells[1].innerHTML = tacgia;
            }
            for (let i = 0; i < sltg; i++) {
                var optionscongtac = document.querySelector('#coquancongtac-' + i);
                var textcongtac = optionscongtac.options[optionscongtac.selectedIndex].textContent;
                table.rows[i].cells[2].innerHTML = textcongtac;
            } for (let i = 0; i < sltg; i++) {
                var optionstg = document.querySelector('#tg-' + i);
                var texttg = optionstg.options[optionstg.selectedIndex].textContent;
                table.rows[i].cells[3].innerHTML = texttg;
            }
            if (sltg == 2) {
                for (let i = 0; i < sltg; i++) {

                    var donggop = Number(document.querySelector('#donggop-' + i).value);
                    var optionscongtac = document.querySelector('#coquancongtac-' + 0);
                    var coquan = optionscongtac.options[optionscongtac.selectedIndex].textContent;
                    var donggoptgc = Number(document.querySelector('#donggop-0').value);

                    if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                        if (table.rows[1].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                            table.rows[0].cells[4].innerHTML = `${((total)) * (donggoptgc / 100)}`;
                            table.rows[0].cells[5].innerHTML = `${(((total)) * (donggoptgc / 100)) * 0.9}`;
                            table.rows[0].cells[6].innerHTML = `0`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            table.rows[1].cells[4].innerHTML = `${((total)) * (donggop / 100)}`;
                            table.rows[1].cells[5].innerHTML = `${(((total)) * (donggop / 100)) * 0.9}`;
                            table.rows[1].cells[6].innerHTML = `0`;
                            table.rows[1].cells[7].innerHTML = `0`;
                        } else if (table.rows[1].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                            table.rows[0].cells[4].innerHTML = `${((total / 2)) * (donggoptgc / 100)}`;
                            table.rows[0].cells[5].innerHTML = `${(((total / 2)) * (donggop / 100)) * 0.9}`;
                            table.rows[0].cells[6].innerHTML = `0`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            table.rows[1].cells[4].innerHTML = `${((total / 2)) * (donggop / 100)}`;
                            table.rows[1].cells[5].innerHTML = `${(((total / 2)) * (donggop / 100)) * 0.9}`;
                            table.rows[1].cells[6].innerHTML = `0`;
                            table.rows[1].cells[7].innerHTML = `0`;
                        } else if (table.rows[1].cells[2].textContent == "(1) ngoài UEF, (2) UEF (20%)" || table.rows[1].cells[2].textContent == "Cơ quan công tác ngoài UEF (0%)") {
                            table.rows[0].cells[4].innerHTML = `0`;
                            table.rows[0].cells[5].innerHTML = `0`;
                            table.rows[0].cells[6].innerHTML = `0`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            table.rows[1].cells[4].innerHTML = `0`;
                            table.rows[1].cells[5].innerHTML = `0`;
                            table.rows[1].cells[6].innerHTML = `0`;
                            table.rows[1].cells[7].innerHTML = `0`;

                        }

                    } if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                        table.rows[i].cells[4].innerHTML = `${((total / 2)) * (donggop / 100)}`;
                        table.rows[i].cells[5].innerHTML = `${(((total / 2)) * (donggop / 100)) * 0.9}`;
                        table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        table.rows[i].cells[7].innerHTML = `0`;
                        var donggoptgc = Number(document.querySelector('#donggop-0').value);

                        if (table.rows[1].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                            table.rows[1].cells[4].innerHTML = `${((total)) * (donggop / 100)}`;
                            table.rows[1].cells[5].innerHTML = `${(((total)) * (donggop / 100)) * 0.9}`;
                            table.rows[1].cells[6].innerHTML = `0`;
                            table.rows[1].cells[7].innerHTML = `0`;
                            table.rows[0].cells[4].innerHTML = `${((total)) * (donggoptgc / 100)}`;
                            table.rows[0].cells[5].innerHTML = `${(((total)) * (donggoptgc / 100)) * 0.9}`;
                            table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[0].cells[7].innerHTML = `0`;
                        }

                    } else if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                        table.rows[i].cells[4].innerHTML = `${(total) * (donggop / 100)}`;
                        table.rows[i].cells[5].innerHTML = `${((total)) * (donggop / 100) * 0.9}`;
                        table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                        table.rows[i].cells[7].innerHTML = `0`;
                    }
                }

            }
        }
        ///// nhiều hơn 3 tác giả: 1 chính, 1 phụ, 1 liên hệ

        if (valuerank == "Giảng viên" && valueloaihinh == "Nghiên cứu mạnh" && sltgc > 0 && sltglh > 1 && sltgp > 1 && sltg > 2) {
            for (let i = 0; i < sltg; i++) {
                trtable += `<tr>
                        <td>${i + 1}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>`;
            }
            table.innerHTML = trtable;
            for (let i = 0; i < sltg; i++) {
                var tacgia = document.querySelector('#inp-username-id-mail-' + i).value;
                table.rows[i].cells[1].innerHTML = tacgia;
            }
            for (let i = 0; i < sltg; i++) {
                var optionscongtac = document.querySelector('#coquancongtac-' + i);
                var textcongtac = optionscongtac.options[optionscongtac.selectedIndex].textContent;
                table.rows[i].cells[2].innerHTML = textcongtac;
            } for (let i = 0; i < sltg; i++) {
                var optionstg = document.querySelector('#tg-' + i);
                var texttg = optionstg.options[optionstg.selectedIndex].textContent;
                table.rows[i].cells[3].innerHTML = texttg;
            }
            if (sltgc == 1 && sltglh > 1 && sltgp > 1 && sltg > 4 && table.rows[0].cells[2].textContent != "Cơ quan công tác duy nhất UEF (100%)" && table.rows[0].cells[2].textContent != "(1) UEF – (2) ngoài UEF (80%)") {
                for (let j = (sltg - sltglh); j < sltg; j++) {
                    if (table.rows[j].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                        for (let k = 0; k < sltg; k++) {
                            var donggoptgc = document.querySelector('#donggop-' + k).value;
                            table.rows[k].cells[4].innerHTML = `${total / sltglh * donggoptgc / 100}`;
                            table.rows[k].cells[5].innerHTML = `${total / sltglh * donggoptgc / 100 * 0.9}`;
                            if (table.rows[k].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)" || table.rows[k].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                                table.rows[k].cells[6].innerHTML = `${diem / 2}`;
                            } else {
                                table.rows[k].cells[6].innerHTML = `0`;
                            }
                            table.rows[k].cells[7].innerHTML = `0`;
                        }
                        break;
                    }
                    if (table.rows[j].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                        var coquanhutech = 0;
                        for (let g = (j + 1); g < sltg; g++) {
                            if (table.rows[g].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                                coquanhutech += 1;
                            }
                        }
                        if (coquanhutech < 1) {
                            for (let k = 0; k < sltg; k++) {
                                var donggoptgc = document.querySelector('#donggop-' + k).value;
                                table.rows[k].cells[4].innerHTML = `${total / 2 / sltglh * donggoptgc / 100}`;
                                table.rows[k].cells[5].innerHTML = `${total / 2 / sltglh * donggoptgc / 100 * 0.9}`;
                                if (table.rows[k].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)" || table.rows[k].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                                    table.rows[k].cells[6].innerHTML = `${diem / 2}`;
                                } else {
                                    table.rows[k].cells[6].innerHTML = `0`;
                                }
                                table.rows[k].cells[7].innerHTML = `0`;
                            }
                            break;
                        }
                    } else {
                        for (let j = 1; j < (sltg - sltglh); j++) {
                            if (table.rows[j].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                                for (let k = 0; k < sltg; k++) {
                                    var donggoptgc = document.querySelector('#donggop-' + k).value;
                                    table.rows[k].cells[4].innerHTML = `${total / 4 * donggoptgc / 100}`;
                                    table.rows[k].cells[5].innerHTML = `${total / 4 * donggoptgc / 100 * 0.9}`;
                                    if (table.rows[k].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)" || table.rows[k].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                                        table.rows[k].cells[6].innerHTML = `${diem / 2}`;
                                    } else {
                                        table.rows[k].cells[6].innerHTML = `0`;
                                    }
                                    table.rows[k].cells[7].innerHTML = `0`;
                                }
                                break;
                            }
                            if (table.rows[j].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                                var coquanhutech = 0;
                                for (let g = (j); g < sltg; g++) {
                                    if (table.rows[g].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                                        coquanhutech += 1;
                                    }
                                }
                                if (coquanhutech < 1) {
                                    for (let k = 0; k < sltg; k++) {
                                        var donggoptgc = document.querySelector('#donggop-' + k).value;
                                        table.rows[k].cells[4].innerHTML = `${total / 4 / 2 * donggoptgc / 100}`;
                                        table.rows[k].cells[5].innerHTML = `${total / 4 / 2 * donggoptgc / 100 * 0.9}`;
                                        if (table.rows[k].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)" || table.rows[k].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                                            table.rows[k].cells[6].innerHTML = `${diem / 2}`;
                                        } else {
                                            table.rows[k].cells[6].innerHTML = `0`;
                                        }
                                        table.rows[k].cells[7].innerHTML = `0`;
                                    }
                                    break;
                                }
                            } else {
                                for (let j = 2; j < (sltg - sltglh); j++) {
                                    if (table.rows[j].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                                        for (let k = 0; k < sltg; k++) {
                                            var donggoptgc = document.querySelector('#donggop-' + k).value;
                                            table.rows[k].cells[4].innerHTML = `${total / 4 * donggoptgc / 100}`;
                                            table.rows[k].cells[5].innerHTML = `${total / 4 * donggoptgc / 100 * 0.9}`;
                                            if (table.rows[k].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)" || table.rows[k].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                                                table.rows[k].cells[6].innerHTML = `${diem / 2}`;
                                            } else {
                                                table.rows[k].cells[6].innerHTML = `0`;
                                            }
                                            table.rows[k].cells[7].innerHTML = `0`;
                                        }
                                        break;
                                    }
                                    if (table.rows[j].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                                        var coquanhutech = 0;
                                        for (let g = (j); g < sltg; g++) {
                                            if (table.rows[g].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                                                coquanhutech += 1;
                                            }
                                        }
                                        if (coquanhutech < 1) {
                                            for (let k = 0; k < sltg; k++) {
                                                var donggoptgc = document.querySelector('#donggop-' + k).value;
                                                table.rows[k].cells[4].innerHTML = `${total / 4 / 2 * donggoptgc / 100}`;
                                                table.rows[k].cells[5].innerHTML = `${total / 4 / 2 * donggoptgc / 100 * 0.9}`;
                                                if (table.rows[k].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)" || table.rows[k].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                                                    table.rows[k].cells[6].innerHTML = `${diem / 2}`;
                                                } else {
                                                    table.rows[k].cells[6].innerHTML = `0`;
                                                }
                                                table.rows[k].cells[7].innerHTML = `0`;
                                            }
                                            break;
                                        }
                                    } else {
                                        for (let k = 0; k < sltg; k++) {

                                            table.rows[k].cells[4].innerHTML = `0`;
                                            table.rows[k].cells[5].innerHTML = `0`;
                                            if (table.rows[k].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)" || table.rows[k].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                                                table.rows[k].cells[6].innerHTML = `0`;
                                            } else {
                                                table.rows[k].cells[6].innerHTML = `0`;
                                            }
                                            table.rows[k].cells[7].innerHTML = `0`;
                                        }
                                    }
                                }
                                break;
                            }

                        }
                    }
                }
            } else
                if (sltgc > 2 && sltgp > 0 && sltglh > 0) {
                    var tsltlh = 0;
                    var tglh = 0;
                    for (let i = 1; i < sltg; i++) {
                        var coquan = table.rows[i].cells[2].textContent;
                        var coquantgc = table.rows[0].cells[2].textContent;
                        if (coquantgc == "(1) UEF – (2) ngoài UEF (80%)" && table.rows[0].cells[3].textContent == "Tác giả chính") {
                            document.querySelector('#donggop-0').disabled = false;
                            if (table.rows[i].cells[3].textContent == "Tác giả liên hệ" && table.rows[i].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                                var donggop = document.querySelector('#donggop-' + i).value;
                                if (table.rows[i].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                                    tsltlh += 1;
                                }
                                if (tsltlh > 1 || tsltlh == 1) {
                                    for (let j = 0; j < sltg; j++) {
                                        var donggop = document.querySelector('#donggop-' + j).value;
                                        table.rows[j].cells[4].innerHTML = `${total * donggop / 100}`;
                                        table.rows[j].cells[5].innerHTML = `${total * donggop / 100 * 0.9}`;
                                        table.rows[j].cells[6].innerHTML = `${diem / 2}`;
                                        table.rows[j].cells[7].innerHTML = `0`;
                                    }
                                }
                                var donggoptgc = document.querySelector('#donggop-0').value;
                                table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                                table.rows[0].cells[5].innerHTML = `${total * donggoptgc / 100 * 0.9}`;
                                table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                                table.rows[0].cells[7].innerHTML = `0`;
                                break;
                            }
                            else if (table.rows[i].cells[3].textContent == "Tác giả liên hệ" && table.rows[i].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)" || table.rows[i].cells[2].textContent == "(1) ngoài UEF, (2) UEF (20%)" || table.rows[i].cells[2].textContent == "Cơ quan công tác ngoài UEF (0%)") {
                                var donggop = document.querySelector('#donggop-' + i).value;
                                table.rows[i].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                                table.rows[i].cells[5].innerHTML = `${total / 2 * donggop / 100 * 0.9}`;
                                table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                                table.rows[i].cells[7].innerHTML = `0`;
                                for (let j = 1; j < (sltgp + 1); j++) {
                                    var donggop = document.querySelector('#donggop-' + j).value;

                                    if (table.rows[j].cells[2].textContent == "(1) ngoài UEF, (2) UEF (20%)" || table.rows[j].cells[2].textContent == "Cơ quan công tác ngoài UEF (0%)") {
                                        table.rows[j].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                                        table.rows[j].cells[5].innerHTML = `${total / 2 * donggop / 100 * 0.9}`;
                                        table.rows[j].cells[6].innerHTML = `0`;
                                        table.rows[j].cells[7].innerHTML = `0`;
                                    } else {
                                        table.rows[j].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                                        table.rows[j].cells[5].innerHTML = `${total / 2 * donggop / 100 * 0.9}`;
                                        table.rows[j].cells[6].innerHTML = `${diem / 2}`;
                                        table.rows[j].cells[7].innerHTML = `0`;
                                    }
                                }
                                for (let k = (sltgc + sltgp + 1); k < (sltg + 1); k++) {
                                    var donggop = document.querySelector('#donggop-' + (k - 1)).value;
                                    if (table.rows[k - 1].cells[2].textContent == "(1) ngoài UEF, (2) UEF (20%)" || table.rows[k - 1].cells[2].textContent == "Cơ quan công tác ngoài UEF (0%)") {
                                        table.rows[k - 1].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                                        table.rows[k - 1].cells[5].innerHTML = `${total / 2 * donggop / 100 * 0.9}`;
                                        table.rows[k - 1].cells[6].innerHTML = `0`;
                                        table.rows[k - 1].cells[7].innerHTML = `0`;
                                    } else {
                                        table.rows[k - 1].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                                        table.rows[k - 1].cells[5].innerHTML = `${total / 2 * donggop / 100 * 0.9}`;
                                        table.rows[k - 1].cells[6].innerHTML = `${diem / 2}`;
                                        table.rows[k - 1].cells[7].innerHTML = `0`;
                                    }
                                }
                                var donggoptgc = document.querySelector('#donggop-0').value;
                                table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                                table.rows[0].cells[5].innerHTML = `${total / 2 * donggoptgc / 100 * 0.9}`;
                                table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                                table.rows[0].cells[7].innerHTML = `0`;
                            }
                        }
                        ////////
                        else if (coquantgc == "Cơ quan công tác ngoài UEF (0%)" || coquantgc == "(1) ngoài UEF, (2) UEF (20%)" && table.rows[0].cells[3].textContent == "Tác giả chính") {
                            document.querySelector('#donggop-0').disabled = false;
                            if (table.rows[i].cells[3].textContent == "Tác giả liên hệ" && table.rows[i].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                                var donggop = document.querySelector('#donggop-' + i).value;
                                table.rows[i].cells[4].innerHTML = `${total * donggop / 100}`;
                                table.rows[i].cells[5].innerHTML = `${total * donggop / 100 * 0.9}`;
                                table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                                table.rows[i].cells[7].innerHTML = `0`;
                                for (let j = 1; j < (sltgp + 1); j++) {
                                    var donggop = document.querySelector('#donggop-' + j).value;

                                    if (table.rows[j].cells[2].textContent == "(1) ngoài UEF, (2) UEF (20%)" || table.rows[j].cells[2].textContent == "Cơ quan công tác ngoài UEF (0%)") {
                                        table.rows[j].cells[4].innerHTML = `${total * donggop / 100}`;
                                        table.rows[j].cells[5].innerHTML = `${total * donggop / 100 * 0.9}`;
                                        table.rows[j].cells[6].innerHTML = `0`;
                                        table.rows[j].cells[7].innerHTML = `0`;
                                    } else {
                                        table.rows[j].cells[4].innerHTML = `${total * donggop / 1000}`;
                                        table.rows[j].cells[5].innerHTML = `${total * donggop / 100 * 0.9}`;
                                        table.rows[j].cells[6].innerHTML = `${diem / 2}`;
                                        table.rows[j].cells[7].innerHTML = `0`;
                                    }
                                }
                                for (let k = (sltgc + sltgp + 1); k < (sltg + 1); k++) {
                                    var donggop = document.querySelector('#donggop-' + (k - 1)).value;
                                    if (table.rows[k - 1].cells[2].textContent == "(1) ngoài UEF, (2) UEF (20%)" || table.rows[k - 1].cells[2].textContent == "Cơ quan công tác ngoài UEF (0%)") {
                                        table.rows[k - 1].cells[4].innerHTML = `${total * donggop / 100}`;
                                        table.rows[k - 1].cells[5].innerHTML = `${total * donggop / 100 * 0.9}`;
                                        table.rows[k - 1].cells[6].innerHTML = `0`;
                                        table.rows[k - 1].cells[7].innerHTML = `0`;
                                    } else {
                                        table.rows[k - 1].cells[4].innerHTML = `${total * donggop / 100}`;
                                        table.rows[k - 1].cells[5].innerHTML = `${total * donggop / 100 * 0.9}`;
                                        table.rows[k - 1].cells[6].innerHTML = `${diem / 2}`;
                                        table.rows[k - 1].cells[7].innerHTML = `0`;
                                    }
                                }
                                var donggoptgc = document.querySelector('#donggop-0').value;

                                break;
                            }

                            else if (table.rows[i].cells[3].textContent == "Tác giả liên hệ" && table.rows[i].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                                var donggop = document.querySelector('#donggop-' + i).value;
                                table.rows[i].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                                table.rows[i].cells[5].innerHTML = `${total / 2 * donggop / 100 * 0.9}`;
                                table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                                table.rows[i].cells[7].innerHTML = `0`;
                                for (let j = 1; j < (sltgp + 1); j++) {
                                    var donggop = document.querySelector('#donggop-' + j).value;

                                    if (table.rows[j].cells[2].textContent == "(1) ngoài UEF, (2) UEF (20%)" || table.rows[j].cells[2].textContent == "Cơ quan công tác ngoài UEF (0%)") {
                                        table.rows[j].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                                        table.rows[j].cells[5].innerHTML = `${total / 2 * donggop / 100 * 0.9}`;
                                        table.rows[j].cells[6].innerHTML = `0`;
                                        table.rows[j].cells[7].innerHTML = `0`;
                                    } else {
                                        table.rows[j].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                                        table.rows[j].cells[5].innerHTML = `${total / 2 * donggop / 100 * 0.9}`;
                                        table.rows[j].cells[6].innerHTML = `${diem / 2}`;
                                        table.rows[j].cells[7].innerHTML = `0`;
                                    }
                                }
                                for (let k = (sltgc + sltgp + 1); k < (sltg + 1); k++) {
                                    var donggop = document.querySelector('#donggop-' + (k - 1)).value;
                                    if (table.rows[k - 1].cells[2].textContent == "(1) ngoài UEF, (2) UEF (20%)" || table.rows[k - 1].cells[2].textContent == "Cơ quan công tác ngoài UEF (0%)") {
                                        table.rows[k - 1].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                                        table.rows[k - 1].cells[5].innerHTML = `${total / 2 * donggop / 100 * 0.9}`;
                                        table.rows[k - 1].cells[6].innerHTML = `0`;
                                        table.rows[k - 1].cells[7].innerHTML = `0`;
                                    } else {
                                        table.rows[k - 1].cells[4].innerHTML = `${total / 2 * donggop / 100}`;
                                        table.rows[k - 1].cells[5].innerHTML = `${total / 2 * donggop / 100 * 0.9}`;
                                        table.rows[k - 1].cells[6].innerHTML = `${diem / 2}`;
                                        table.rows[k - 1].cells[7].innerHTML = `0`;
                                    }
                                }
                                var donggoptgc = document.querySelector('#donggop-0').value;
                                table.rows[0].cells[4].innerHTML = `${total / 2 * donggoptgc / 100}`;
                                table.rows[0].cells[5].innerHTML = `${total / 2 * donggoptgc / 100 * 0.9}`;
                                table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                                table.rows[0].cells[7].innerHTML = `0`;
                            } if (table.rows[i].cells[3].textContent == "Tác giả liên hệ" && table.rows[i].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)" || table.rows[i].cells[2].textContent == "(1) UEF – (2) ngoài UEF (80%)") {
                                var donggop = document.querySelector('#donggop-' + i).value;
                                if (table.rows[i].cells[2].textContent == "Cơ quan công tác duy nhất UEF (100%)") {
                                    tglh += 1;
                                }
                                if (tglh < 1) {
                                    if (table.rows[i].cells[2].textContent == "Tác giả phụ" && table.rows[i].cells[3].textContent == "Tác giả phụ") {

                                    }
                                    for (let j = 0; j < sltg; j++) {
                                        var donggop = document.querySelector('#donggop-' + j).value;
                                        table.rows[j].cells[4].innerHTML = `${total * donggop / 100}`;
                                        table.rows[j].cells[5].innerHTML = `${total * donggop / 100 * 0.9}`;
                                        table.rows[j].cells[6].innerHTML = `${diem / 2}`;
                                        table.rows[j].cells[7].innerHTML = `0`;
                                    }
                                }

                                break;
                            }

                        }
                        ///////
                        else if (coquantgc == "Cơ quan công tác duy nhất UEF (100%)" && table.rows[0].cells[3].textContent == "Tác giả chính") {
                            document.querySelector('#donggop-0').disabled = false;
                            var donggop = document.querySelector('#donggop-' + i).value;
                            var donggoptgc = document.querySelector('#donggop-0').value;
                            table.rows[0].cells[4].innerHTML = `${total * donggoptgc / 100}`;
                            table.rows[0].cells[5].innerHTML = `${total * donggoptgc / 100 * 0.9}`;
                            table.rows[0].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[0].cells[7].innerHTML = `0`;
                            if (table.rows[i].cells[2].textContent == "(1) ngoài UEF, (2) UEF (20%)" || table.rows[i].cells[2].textContent == "Cơ quan công tác ngoài UEF (0%)") {
                                table.rows[i].cells[4].innerHTML = `${(total) * (donggop / 100)}`;
                                table.rows[i].cells[5].innerHTML = `${(total) * (donggop / 100) * 0.9}`;
                                table.rows[i].cells[6].innerHTML = `0`;
                                table.rows[i].cells[7].innerHTML = `0`;
                            } else {
                                table.rows[i].cells[4].innerHTML = `${(total) * (donggop / 100)}`;
                                table.rows[i].cells[5].innerHTML = `${(total) * (donggop / 100) * 0.9}`;
                                table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                                table.rows[i].cells[7].innerHTML = `0`;
                            }
                        }





                    }
                }
                else if (sltg == 2 && valuerank != "Nghiên cứu mạnh") {
                    for (let i = 0; i < sltg; i++) {
                        var coquan = table.rows[i].cells[2].textContent;
                        var donggop = Number(document.querySelector('#donggop-' + i).value);
                        if (sltg == 2) {
                            if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                                table.rows[i].cells[4].innerHTML = `0`;
                                table.rows[i].cells[5].innerHTML = `0`;
                                table.rows[i].cells[6].innerHTML = `0`;
                                table.rows[i].cells[7].innerHTML = `0`;
                            } if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                                table.rows[i].cells[4].innerHTML = `${((total / 2) / sltg) * (donggop / 100)}`;
                                table.rows[i].cells[5].innerHTML = `${(((total / 2) / sltg) * (donggop / 100)) * 0.9}`;
                                table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                                table.rows[i].cells[7].innerHTML = `0`;
                            } else if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                                table.rows[i].cells[4].innerHTML = `${(total / 2) * (donggop / 100)}`;
                                table.rows[i].cells[5].innerHTML = `${((total / 2)) * (donggop / 100) * 0.9}`;
                                table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                                table.rows[i].cells[7].innerHTML = `0`;
                            }
                        }
                    }
                }

                else if (sltgc == 1 && sltg == 1) {
                    var coquan = table.rows[0].cells[2].textContent;
                    try {
                        var donggop = Number(document.querySelector('#donggop-0').value);

                    } catch { }

                    if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                        table.rows[0].cells[4].innerHTML = `0`;
                        table.rows[0].cells[5].innerHTML = `0`;
                        table.rows[0].cells[6].innerHTML = `0`;
                        table.rows[0].cells[7].innerHTML = `0`;

                    } else if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                        table.rows[0].cells[4].innerHTML = `${total / 2}`;
                        table.rows[0].cells[5].innerHTML = `${(total / 2) * 0.9}`;
                        table.rows[0].cells[6].innerHTML = `${diem}`;
                        table.rows[0].cells[7].innerHTML = `${tietchuan}`;
                    } else {
                        table.rows[0].cells[4].innerHTML = `${total}`;
                        table.rows[0].cells[5].innerHTML = `${(total) * 0.9}`;
                        table.rows[0].cells[6].innerHTML = `${diem}`;
                        table.rows[0].cells[7].innerHTML = `${tietchuan}`;
                    }
                }
        }
        if (valuerank == "Giảng viên" && valueloaihinh == "Đề tài") {
            for (let i = 0; i < sltg; i++) {
                trtable += `<tr>
                        <td>${i + 1}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        </tr>`;
            }
            table.innerHTML = trtable;
            for (let i = 0; i < sltg; i++) {
                var tacgia = document.querySelector('#inp-username-id-mail-' + i).value;
                table.rows[i].cells[1].innerHTML = tacgia;
            }
            for (let i = 0; i < sltg; i++) {
                var optionscongtac = document.querySelector('#coquancongtac-' + i);
                var textcongtac = optionscongtac.options[optionscongtac.selectedIndex].textContent;
                table.rows[i].cells[2].innerHTML = textcongtac;
            } for (let i = 0; i < sltg; i++) {
                var optionstg = document.querySelector('#tg-' + i);
                var texttg = optionstg.options[optionstg.selectedIndex].textContent;
                table.rows[i].cells[3].innerHTML = texttg;
            }
            if (sltg == 2) {
                for (let i = 0; i < sltg; i++) {
                    var coquan = table.rows[i].cells[2].textContent;
                    if (sltg == 2) {
                        if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                            table.rows[i].cells[4].innerHTML = `0`;
                            table.rows[i].cells[5].innerHTML = `0`;
                            table.rows[i].cells[6].innerHTML = `0`;
                            table.rows[i].cells[7].innerHTML = `0`;
                        } if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                            table.rows[i].cells[4].innerHTML = `${((total / 2) / sltg)}`;
                            table.rows[i].cells[5].innerHTML = `${(((total / 2) / sltg)) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;
                        } else if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                            table.rows[i].cells[4].innerHTML = `${(total / 2)}`;
                            table.rows[i].cells[5].innerHTML = `${((total / 2)) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;
                        }
                    }
                }
            }
            else if (sltg > 2 && (sltgc + sltglh) < sltg) {
                for (let i = 0; i < sltg; i++) {

                    var coquan = table.rows[i].cells[2].textContent;
                    var optionstg1 = document.querySelector('#tg-' + i);
                    var texttg1 = optionstg1.options[optionstg1.selectedIndex].textContent;

                    if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                        table.rows[i].cells[4].innerHTML = `0`;
                        table.rows[i].cells[5].innerHTML = `0`;
                        table.rows[i].cells[6].innerHTML = `0`;
                        table.rows[i].cells[7].innerHTML = `0`;
                    } else if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                        if (texttg1 == "Chủ nhiệm") {
                            table.rows[i].cells[4].innerHTML = `${(((total * 0.8) / (sltgc + sltglh))) / 2}`;
                            table.rows[i].cells[5].innerHTML = `${(((total * 0.8) / (sltgc + sltglh))) / 2 * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;

                        } else if (texttg1 == "Thành viên") {
                            table.rows[i].cells[4].innerHTML = `${(total * 0.2) / 2 / sltgp}`;
                            table.rows[i].cells[5].innerHTML = `${((total * 0.2) / 2 / sltgp) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;
                        }

                    } else if (coquan == "Cơ quan công tác duy nhất UEF (100%)") {
                        if (texttg1 == "Chủ nhiệm") {

                            table.rows[i].cells[4].innerHTML = `${(((total * 0.8) / (sltgc + sltglh)))}`;
                            table.rows[i].cells[5].innerHTML = `${(((total * 0.8) / (sltgc + sltglh))) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;

                        } else if (texttg1 == "Thành viên") {
                            table.rows[i].cells[4].innerHTML = `${((total * 0.2) / sltgp)}`;
                            table.rows[i].cells[5].innerHTML = `${((total * 0.2) / sltgp) * 0.9}`;
                            table.rows[i].cells[6].innerHTML = `${diem / 2}`;
                            table.rows[i].cells[7].innerHTML = `${tietchuan}`;
                        }
                    }

                }
            }


            if (sltgc == 1 && sltg == 1) {
                var coquan = table.rows[0].cells[2].textContent;
                try {
                    var donggop = Number(document.querySelector('#donggop-0').value);

                } catch { }

                if (coquan == "(1) ngoài UEF, (2) UEF (20%)" || coquan == "Cơ quan công tác ngoài UEF (0%)") {
                    table.rows[0].cells[4].innerHTML = `0`;
                    table.rows[0].cells[5].innerHTML = `0`;
                    table.rows[0].cells[6].innerHTML = `0`;
                    table.rows[0].cells[7].innerHTML = `0`;

                } else if (coquan == "(1) UEF – (2) ngoài UEF (80%)") {
                    table.rows[0].cells[4].innerHTML = `${total / 2}`;
                    table.rows[0].cells[5].innerHTML = `${(total / 2) * 0.9}`;
                    table.rows[0].cells[6].innerHTML = `${diem}`;
                    table.rows[0].cells[7].innerHTML = `${tietchuan}`;
                } else {
                    table.rows[0].cells[4].innerHTML = `${total}`;
                    table.rows[0].cells[5].innerHTML = `${(total) * 0.9}`;
                    table.rows[0].cells[6].innerHTML = `${diem}`;
                    table.rows[0].cells[7].innerHTML = `${tietchuan}`;
                }
            }
        }

    }
}
function clear_hinhthuc() {
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    var valueloaihinh = document.querySelector('input[name="tick-rank-kekhai"]:checked').value;
    document.querySelector('#kekhaitietchuan').innerHTML = `<div class="custom-control custom-radio">
                        <input class="custom-control-input" type="radio" id="quydoi" name="thanhtoan-quydoi" value="KÊ KHAI TIẾT CHUẨN" onclick="loadradio2()">
                        <label for="quydoi" class="custom-control-label">KÊ KHAI TIẾT CHUẨN</label>
                    </div>`;
    document.querySelector('#yeucauchatluong').innerHTML = ``;
    document.querySelector('#loaibaibao').innerHTML = ``;
    document.querySelector('#loaisanpham').innerHTML = ``;

    if (valuerank == "Giảng viên" && valueloaihinh == "Nghiên cứu mạnh") {
        document.querySelector('#tbtacgia').innerHTML = `<thead>
                        <th width="2%">STT</th>
                        <th width="20%">Mã nhân viên</th>
                        <th width="20%">Cơ quan công tác</th>
                        <th width="10%">Loại tác giả</th>
                        <th width="7%">Đóng góp (%)</th>
                        </thead>

                        <tbody id="addtacgia" onchange="loadtable()">
                        </tbody>`;
        themtacgia();

    }
    if (valuerank == "Giảng viên" && valueloaihinh == "Khối lượng") {
        document.querySelector('#tbtacgia').innerHTML = `<thead>
                        <th width="2%">STT</th>
                        <th width="20%">Mã nhân viên</th>
                        <th width="20%">Cơ quan công tác</th>
                        <th width="10%">Loại tác giả</th>
                        
                        </thead>

                        <tbody id="addtacgia" onchange="loadtable()">
                        </tbody>`;
        themtacgia();
    } if (valuerank == "Giảng viên" && valueloaihinh == "Đề tài") {
        document.querySelector('#tbtacgia').innerHTML = `<thead>
                        <th width="2%">STT</th>
                        <th width="20%">Mã nhân viên</th>
                        <th width="20%">Cơ quan công tác</th>
                        <th width="10%">Loại tác giả</th>
                        
                        </thead>

                        <tbody id="addtacgia" onchange="loadtable()">
                        </tbody>`;
        themtacgia();

    }
    if (valuerank == "Nghiên cứu viên 1" && valueloaihinh == "Khối lượng") {
        document.querySelector('#tbtacgia').innerHTML = `<thead>
                        <th width="2%">STT</th>
                        <th width="20%">Mã nhân viên</th>
                        <th width="20%">Cơ quan công tác</th>
                        <th width="10%">Loại tác giả</th>
                        
                        </thead>

                        <tbody id="addtacgia" onchange="loadtable()">
                        </tbody>`;
        themtacgia();
    }


}
function themtacgia() {
    var a = ``;
    var sltgc = Number(document.querySelector('#sltgc').value);
    var sltgp = Number(document.querySelector('#sltgp').value);
    var sltglh = Number(document.querySelector('#sltglh').value);
    var valuerank = document.querySelector('input[name="tick-rank"]:checked').value;
    var valueloaihinh = document.querySelector('input[name="tick-rank-kekhai"]:checked').value;
    var sltg = sltgc + sltgp + sltglh;
    let i = 0;

    document.querySelector('#tbtacgia2').innerHTML = `<thead>
            <th width="2%">STT</th>
            <th width="15%">Mã nhân viên</th>
            <th width="15%">Cơ quan công tác</th>
            <th width="15%">Loại tác giả</th>
            <th width="10%">Tổng nhận trước thuế</th>
            <th width="10%">Thực nhận</th>
            <th width="5%">Điểm</th>
            <th width="5%">Tiết chuẩn</th>
            </thead>

            <tbody id="tablethanhtoan">
            </tbody>`;
    document.querySelector('#tongtacgia').innerHTML = `<a>Tổng số tác giả: <a id="tongsltg">${sltg}</a></a>`;
    if (sltgc == 1 && valueloaihinh == "Đề tài" && valuerank == "Giảng viên") {

        for (i; i < sltgc; i++) {
            a += `<tr><td>${i + 1}</td>
                            <td ><input class="form-control" type="text" placeholder="Nhập Mã GV/Tên tác giả phụ thuộc UEF" id="inp-username-id-mail-${i}" oninput="inpsearch(${i},render_user)" />
                            <div id="themtg" style="display: flex">
                                <div width: 50%">
                                    <dl id="dl-user-${i}">
                                    </dl>
                                </div>
                            </div></td>
                            <td ><div class="form-group">
                            <select name="coquancongtac" id="coquancongtac-${i}" class="form-control">
                                <option value="0"> --Chọn cơ quan công tác--</option>
                                <option value="1">Cơ quan công tác duy nhất UEF (100%)</option>
                                <option value="0.5">(1) UEF – (2) ngoài UEF (80%)</option>
                                <option value="0">(1) ngoài UEF, (2) UEF (20%)</option>
                                <option value="0">Cơ quan công tác ngoài UEF (0%)</option>
                            </select>
                        </div></td>
                            <td >
                            <div class="form-group">
                            <select name="coquancongtac" id="tg-${i}" class="form-control">
                                 <option >Chủ nhiệm</option>
                                 <option >Thành viên</option>
                                 </select></td></tr>`;
        }
        for (i; i < (sltgp + sltgc); i++) {
            a += `<tr><td>${i + 1}</td>
                            <td ><input class="form-control" type="text" placeholder="Nhập Mã GV/Tên tác giả phụ thuộc UEF" id="inp-username-id-mail-${i}" oninput="inpsearch(${i},render_user)" />
                            <div id="themtg" style="display: flex">
                                <div width: 50%">
                                    <dl id="dl-user-${i}">
                                    </dl>
                                </div>
                            </div></td>
                            <td ><div class="form-group">
                            <select name="coquancongtac" id="coquancongtac-${i}" class="form-control">
                                <option value="0"> --Chọn cơ quan công tác--</option>
                                <option value="1">Cơ quan công tác duy nhất UEF (100%)</option>
                                <option value="0.5">(1) UEF – (2) ngoài UEF (80%)</option>
                                <option value="0">(1) ngoài UEF, (2) UEF (20%)</option>
                                <option value="0">Cơ quan công tác ngoài UEF (0%)</option>
                            </select>
                        </div></td>
                            <td >
                            <div class="form-group">
                            <select name="coquancongtac" id="tg-${i}" class="form-control" >
                                 <option >Thành viên</option>

                            <option >Chủ nhiệm</option>
                                 </select>
                                 </td>
                                 </tr>`;
        } for (i; i < sltg; i++) {
            a += `<tr><td>${i + 1}</td>
                            <td ><input class="form-control" type="text" placeholder="Nhập Mã GV/Tên tác giả phụ thuộc UEF" id="inp-username-id-mail-${i}" oninput="inpsearch(${i},render_user)" />
                            <div id="themtg" style="display: flex">
                                <div width: 50%">
                                    <dl id="dl-user-${i}">
                                    </dl>
                                </div>
                            </div></td>
                            <td ><div class="form-group">
                            <select name="coquancongtac" id="coquancongtac-${i}" class="form-control">
                                <option value="0"> --Chọn cơ quan công tác--</option>

                                <option value="1">Cơ quan công tác duy nhất UEF (100%)</option>
                                <option value="0.5">(1) UEF – (2) ngoài UEF (80%)</option>
                                <option value="0">(1) ngoài UEF, (2) UEF (20%)</option>
                                <option value="0">Cơ quan công tác ngoài UEF (0%)</option>
                            </select>
                        </div></td>
                            <td >
                            <div class="form-group">
                            <select name="coquancongtac" id="tg-${i}" class="form-control" >
                                 <option >Thành viên</option>
                                 
                                 <option >Chủ nhiệm</option></select>
                                 </td></tr>`;
        }

        document.querySelector('#addtacgia').innerHTML = a;
    }
    if (sltgc == 1 && valueloaihinh == "Khối lượng" && valuerank == "Giảng viên") {

        for (i; i < sltgc; i++) {
            a += `<tr><td>${i + 1}</td>
                            <td ><input class="form-control" type="text" placeholder="Nhập Mã GV/Tên tác giả phụ thuộc UEF" id="inp-username-id-mail-${i}" oninput="inpsearch(${i},render_user)" />
                            <div id="themtg" style="display: flex">
                                <div width: 50%">
                                    <dl id="dl-user-${i}">
                                    </dl>
                                </div>
                            </div></td>
                            <td ><div class="form-group">
                            <select name="coquancongtac" id="coquancongtac-${i}" class="form-control">
                                <option value="0"> --Chọn cơ quan công tác--</option>

                                <option value="1">Cơ quan công tác duy nhất UEF (100%)</option>
                                <option value="0.5">(1) UEF – (2) ngoài UEF (80%)</option>
                                <option value="0">(1) ngoài UEF, (2) UEF (20%)</option>
                                <option value="0">Cơ quan công tác ngoài UEF (0%)</option>
                            </select>
                        </div></td>
                            <td >
                            <div class="form-group">
                            <select name="coquancongtac" id="tg-${i}" class="form-control" disabled>
                                 <option >Tác giả chính</option>
                                 </select></td></tr>`;
        }
        for (i; i < (sltgp + sltgc); i++) {
            a += `<tr><td>${i + 1}</td>
                            <td ><input class="form-control" type="text" placeholder="Nhập Mã GV/Tên tác giả phụ thuộc UEF" id="inp-username-id-mail-${i}" oninput="inpsearch(${i},render_user)" />
                            <div id="themtg" style="display: flex">
                                <div width: 50%">
                                    <dl id="dl-user-${i}">
                                    </dl>
                                </div>
                            </div></td>
                            <td ><div class="form-group">
                            <select name="coquancongtac" id="coquancongtac-${i}" class="form-control">
                                <option value="0"> --Chọn cơ quan công tác--</option>
                                <option value="1">Cơ quan công tác duy nhất UEF (100%)</option>
                                <option value="0.5">(1) UEF – (2) ngoài UEF (80%)</option>
                                <option value="0">(1) ngoài UEF, (2) UEF (20%)</option>
                                <option value="0">Cơ quan công tác ngoài UEF (0%)</option>
                            </select>
                        </div></td>
                            <td >
                            <div class="form-group">
                            <select name="coquancongtac" id="tg-${i}" class="form-control" disabled>
                                 
                                 <option>Tác giả phụ</option>
                                 </td>
                                 </tr>`;
        } for (i; i < sltg; i++) {
            a += `<tr><td>${i + 1}</td>
                            <td ><input class="form-control" type="text" placeholder="Nhập Mã GV/Tên tác giả phụ thuộc UEF" id="inp-username-id-mail-${i}" oninput="inpsearch(${i},render_user)" />
                            <div id="themtg" style="display: flex">
                                <div width: 50%">
                                    <dl id="dl-user-${i}">
                                    </dl>
                                </div>
                            </div></td>
                            <td ><div class="form-group">
                            <select name="coquancongtac" id="coquancongtac-${i}" class="form-control">
                                <option value="0"> --Chọn cơ quan công tác--</option>

                                <option value="1">Cơ quan công tác duy nhất UEF (100%)</option>
                                <option value="0.5">(1) UEF – (2) ngoài UEF (80%)</option>
                                <option value="0">(1) ngoài UEF, (2) UEF (20%)</option>
                                <option value="0">Cơ quan công tác ngoài UEF (0%)</option>
                            </select>
                        </div></td>
                            <td >
                            <div class="form-group">
                            <select name="coquancongtac" id="tg-${i}" class="form-control" disabled>
                                 
                                 <option>Tác giả liên hệ</option>
                                 </td></tr>`;
        }

        document.querySelector('#addtacgia').innerHTML = a;
    }
    ///
    if (sltgc == 1 && valueloaihinh == "Khối lượng" && valuerank == "Nghiên cứu viên 1") {

        for (i; i < sltgc; i++) {
            a += `<tr><td>${i + 1}</td>
                            <td ><input class="form-control" type="text" placeholder="Nhập Mã GV/Tên tác giả phụ thuộc UEF" id="inp-username-id-mail-${i}" oninput="inpsearch(${i},render_user)" />
                            <div id="themtg" style="display: flex">
                                <div width: 50%">
                                    <dl id="dl-user-${i}">
                                    </dl>
                                </div>
                            </div></td>
                            <td ><div class="form-group">
                            <select name="coquancongtac" id="coquancongtac-${i}" class="form-control">
                                <option value="0"> --Chọn cơ quan công tác--</option>

                                <option value="1">Cơ quan công tác duy nhất UEF (100%)</option>
                                <option value="0.5">(1) UEF – (2) ngoài UEF (80%)</option>
                                <option value="0">(1) ngoài UEF, (2) UEF (20%)</option>
                                <option value="0">Cơ quan công tác ngoài UEF (0%)</option>
                            </select>
                        </div></td>
                            <td >
                            <div class="form-group">
                            <select name="coquancongtac" id="tg-${i}" class="form-control" disabled>
                                 <option >Tác giả chính</option>
                                 </select></td></tr>`;
        }
        for (i; i < (sltgp + sltgc); i++) {
            a += `<tr><td>${i + 1}</td>
                            <td ><input class="form-control" type="text" placeholder="Nhập Mã GV/Tên tác giả phụ thuộc UEF" id="inp-username-id-mail-${i}" oninput="inpsearch(${i},render_user)" />
                            <div id="themtg" style="display: flex">
                                <div width: 50%">
                                    <dl id="dl-user-${i}">
                                    </dl>
                                </div>
                            </div></td>
                            <td ><div class="form-group">
                            <select name="coquancongtac" id="coquancongtac-${i}" class="form-control">
                                <option value="0"> --Chọn cơ quan công tác--</option>
                                <option value="1">Cơ quan công tác duy nhất UEF (100%)</option>
                                <option value="0.5">(1) UEF – (2) ngoài UEF (80%)</option>
                                <option value="0">(1) ngoài UEF, (2) UEF (20%)</option>
                                <option value="0">Cơ quan công tác ngoài UEF (0%)</option>
                            </select>
                        </div></td>
                            <td >
                            <div class="form-group">
                            <select name="coquancongtac" id="tg-${i}" class="form-control" disabled>
                                 
                                 <option>Tác giả phụ</option>
                                 </td>
                                 </tr>`;
        } for (i; i < sltg; i++) {
            a += `<tr><td>${i + 1}</td>
                            <td ><input class="form-control" type="text" placeholder="Nhập Mã GV/Tên tác giả phụ thuộc UEF" id="inp-username-id-mail-${i}" oninput="inpsearch(${i},render_user)" />
                            <div id="themtg" style="display: flex">
                                <div width: 50%">
                                    <dl id="dl-user-${i}">
                                    </dl>
                                </div>
                            </div></td>
                            <td ><div class="form-group">
                            <select name="coquancongtac" id="coquancongtac-${i}" class="form-control">
                                <option value="0"> --Chọn cơ quan công tác--</option>

                                <option value="1">Cơ quan công tác duy nhất UEF (100%)</option>
                                <option value="0.5">(1) UEF – (2) ngoài UEF (80%)</option>
                                <option value="0">(1) ngoài UEF, (2) UEF (20%)</option>
                                <option value="0">Cơ quan công tác ngoài UEF (0%)</option>
                            </select>
                        </div></td>
                            <td >
                            <div class="form-group">
                            <select name="coquancongtac" id="tg-${i}" class="form-control" disabled>
                                 
                                 <option>Tác giả liên hệ</option>
                                 </td></tr>`;
        }

        document.querySelector('#addtacgia').innerHTML = a;
    }
    ///
    if (sltgc == 1 && valueloaihinh == "Nghiên cứu mạnh" && valuerank == "Giảng viên") {

        for (i; i < sltgc; i++) {
            a += `<tr><td>${i + 1}</td>
                            <td ><input class="form-control" type="text" placeholder="Nhập Mã GV/Tên tác giả phụ thuộc UEF" id="inp-username-id-mail-${i}" oninput="inpsearch(${i},render_user)" />
                            <div id="themtg" style="display: flex">
                                <div width: 50%">
                                    <dl id="dl-user-${i}">
                                    </dl>
                                </div>
                            </div></td>
                            <td ><div class="form-group">
                            <select name="coquancongtac" id="coquancongtac-${i}" class="form-control">
                                <option value="0"> --Chọn cơ quan công tác--</option>

                                <option value="1">Cơ quan công tác duy nhất UEF (100%)</option>
                                <option value="0.5">(1) UEF – (2) ngoài UEF (80%)</option>
                                <option value="0">(1) ngoài UEF, (2) UEF (20%)</option>
                                <option value="0">Cơ quan công tác ngoài UEF (0%)</option>
                            </select>
                        </div></td>
                            <td >
                            <div class="form-group">
                            <select name="coquancongtac" id="tg-${i}" class="form-control" disabled>
                                 <option >Tác giả chính</option>
                                 <td><input class="form-control" type="number" placeholder="Nhập % đóng góp" id="donggop-${i}"/></td>
                                 </select></td></tr>`;
        }
        for (i; i < (sltgp + sltgc); i++) {
            a += `<tr><td>${i + 1}</td>
                            <td ><input class="form-control" type="text" placeholder="Nhập Mã GV/Tên tác giả phụ thuộc UEF" id="inp-username-id-mail-${i}" oninput="inpsearch(${i},render_user)" />
                            <div id="themtg" style="display: flex">
                                <div width: 50%">
                                    <dl id="dl-user-${i}">
                                    </dl>
                                </div>
                            </div></td>
                            <td ><div class="form-group">
                            <select name="coquancongtac" id="coquancongtac-${i}" class="form-control">
                                <option value="0"> --Chọn cơ quan công tác--</option>
                                <option value="1">Cơ quan công tác duy nhất UEF (100%)</option>
                                <option value="0.5">(1) UEF – (2) ngoài UEF (80%)</option>
                                <option value="0">(1) ngoài UEF, (2) UEF (20%)</option>
                                <option value="0">Cơ quan công tác ngoài UEF (0%)</option>
                            </select>
                        </div></td>
                            <td >
                            <div class="form-group">
                            <select name="coquancongtac" id="tg-${i}" class="form-control" disabled>
                                 
                                 <option>Tác giả phụ</option>
                                 </td>
                                 <td><input class="form-control" type="number" placeholder="Nhập % đóng góp" id="donggop-${i}"/></td>
                                 </tr>`;
        } for (i; i < sltg; i++) {
            a += `<tr><td>${i + 1}</td>
                            <td ><input class="form-control" type="text" placeholder="Nhập Mã GV/Tên tác giả phụ thuộc UEF" id="inp-username-id-mail-${i}" oninput="inpsearch(${i},render_user)" />
                            <div id="themtg" style="display: flex">
                                <div width: 50%">
                                    <dl id="dl-user-${i}">
                                    </dl>
                                </div>
                            </div></td>
                            <td ><div class="form-group">
                            <select name="coquancongtac" id="coquancongtac-${i}" class="form-control">
                                <option value="0"> --Chọn cơ quan công tác--</option>

                                <option value="1">Cơ quan công tác duy nhất UEF (100%)</option>
                                <option value="0.5">(1) UEF – (2) ngoài UEF (80%)</option>
                                <option value="0">(1) ngoài UEF, (2) UEF (20%)</option>
                                <option value="0">Cơ quan công tác ngoài UEF (0%)</option>
                            </select>
                        </div></td>
                            <td >
                            <div class="form-group">
                            <select name="coquancongtac" id="tg-${i}" class="form-control" disabled>
                                 
                                 <option>Tác giả liên hệ</option>
                                 <td><input class="form-control" type="number" placeholder="Nhập % đóng góp" id="donggop-${i}"/></td>
                                 </td></tr>`;
        }

        document.querySelector('#addtacgia').innerHTML = a;
    }

    else if (sltgc > 1) {
        alert("Duy nhất 1 tác giả chính!");
    }

}

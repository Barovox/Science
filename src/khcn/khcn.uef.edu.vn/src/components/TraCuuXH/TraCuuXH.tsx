import { UserLogin } from "@/models/UserLogin";
import { Modal, ScrollArea, TextInput } from "@mantine/core";
import { useState } from "react";

interface ModalTraCuuXHProps {
  opened: boolean;
  onClose: () => void;
  user: UserLogin;
}

const ModalTraCuuXH = ({ opened, onClose, user }: ModalTraCuuXHProps) => {
  const [inputSearch, setInputSearch] = useState("");

  const handleInputBlur = () => {
    var isIssn = document.getElementById("isIssnNew")!;
    isIssn.innerHTML = ``;
    Get_issnNew(renderGet_issnNew);
  };

  const Get_issnNew = (callback: any) => {
    const scopusold = "https://apikhcn.uef.edu.vn/api/DanhMucScimago2023";
    if (inputSearch == "") {
      /*toastr.warning("empty");*/
    } else {
      fetch(scopusold + "/Get-issn?issn=" + inputSearch, {
        headers: {
          Authorization: "Bearer " + user.Token,
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          if (response.status == 404) {
            fetch(scopusold + "/Get-eissn?eissn=" + inputSearch, {
              headers: {
                Authorization: "Bearer " + user.Token,
                "Content-Type": "application/json",
              },
            })
              .then(function (res3) {
                if (res3.status == 404) {
                  fetch(
                    "https://apikhcn.uef.edu.vn/api/DanhMucScimago/Get-issn?issn=" +
                      inputSearch,
                    {
                      headers: {
                        Authorization: "Bearer " + user.Token,
                        "Content-Type": "application/json",
                      },
                    }
                  )
                    .then(function (res4) {
                      if (res4.status == 404) {
                        fetch(
                          "https://apikhcn.uef.edu.vn/api/DanhMucScimago/Get-eissn?eissn=" +
                            inputSearch,
                          {
                            headers: {
                              Authorization: "Bearer " + user.Token,
                              "Content-Type": "application/json",
                            },
                          }
                        )
                          .then(function (res5) {
                            if (res5.status == 404) {
                              fetch(
                                "https://apikhcn.uef.edu.vn/api/DanhMucTrongNuoc/Get-DanhMucTrongNuoc?issn=" +
                                  inputSearch,
                                {
                                  headers: {
                                    Authorization: "Bearer " + user.Token,
                                    "Content-Type": "application/json",
                                  },
                                }
                              )
                                .then(function (res6) {
                                  if (res6.status == 404) {
                                    fetch(
                                      "https://apikhcn.uef.edu.vn/api/DanhMucTrongNuoc/Get-DanhMucTrongNuoc?issn=" +
                                        inputSearch,
                                      {
                                        headers: {
                                          Authorization: "Bearer " + user.Token,
                                          "Content-Type": "application/json",
                                        },
                                      }
                                    )
                                      .then(function (res7) {
                                        if (res7.status == 404) {
                                          console.log(
                                            "Không tim thấy sản phẩm trong ISI, Scopus, HĐCDGSNN!"
                                          );
                                        } else {
                                          return res7.json();
                                        }
                                      })
                                      .then(callback);
                                  } else {
                                    return res6.json();
                                  }
                                })
                                .then(callback);
                            } else {
                              return res5.json();
                            }
                          })
                          .then(callback);
                      } else {
                        return res4.json();
                      }
                    })
                    .then(callback);
                } else {
                  return res3.json();
                }
              })
              .then(callback);
          } else {
            return response.json();
          }
        })
        .then(callback);
    }
  };

  const renderGet_issnNew = (issns: any) => {
    if (issns == undefined) {
      //
    } else {
      var htmls = issns.map((issn: any) => {
        if (issn != null) {
          //
        }
        if (issn.hoidongnganh != undefined) {
          var diem = Number(issn.diem);
          const isIssn: HTMLElement = document.getElementById("isIssnNew")!;
          isIssn.style.display = "block";
          isIssn.style.pointerEvents = "unset";
          return `<input onclick="render_kinhphi('${diem}')" type="radio" class="radio-result" id="category-${issn.id}" name="category" value="${issn.tentapchi} (${issn.hoidongnganh}) "/><label for="category-${issn.id}">${issn.tentapchi} (${issn.hoidongnganh}) - ${diem}điểm</label></br>`;
        } else {
          if (issn.category_6 == null) {
            if (issn.category_5 == null) {
              if (issn.category_4 == null) {
                if (issn.category_3 == null) {
                  if (issn.category_2 == null) {
                    return `
                      <label>Tên danh mục: <label id="lbname">${issn.journal_name}</label></label>
                      <label>Issn: <label id="lbissn">${issn.issn}</label></label>
                      <label>Eissn: <label  id="lbeissn">${issn.eissn}</label></label><br />
                      <input type="radio" class="radio-result" id="category-1" name="category" value="${issn.category_1}" >
                      <label for="category-1">${issn.category_1}</label>
                    `;
                  }
                  return `
                    <label>Tên danh mục: <label id="lbname">${issn.journal_name}</label></label>
                    <label>Issn: <label id="lbissn">${issn.issn}</label></label>
                    <label>Eissn: <label  id="lbeissn">${issn.eissn}</label></label><br />
                    <input type="radio" class="radio-result" id="category-1" name="category" value="${issn.category_1}" >
                    <label for="category-1">${issn.category_1}</label><br>
                    <input type="radio" class="radio-result" id="category-2" name="category" value="${issn.category_2}">
                    <label for="category-2">${issn.category_2}</label>
                  `;
                }
                return `
                  <label>Tên danh mục: <label id="lbname">${issn.journal_name}</label></label>
                  <label>Issn: <label id="lbissn">${issn.issn}</label></label>
                  <label>Eissn: <label id="lbeissn">${issn.eissn}</label></label><br />
                  <input type="radio" class="radio-result" id="category-1" name="category" value="${issn.category_1}" >
                  <label for="category-1">${issn.category_1}</label><br />
                  <input type="radio" class="radio-result" id="category-2" name="category" value="${issn.category_2}">
                  <label for="category-2">${issn.category_2}</label><br />
                  <input type="radio" class="radio-result" id="category-3" name="category" value="${issn.category_3}">
                  <label for="category-3">${issn.category_3}</label><br />
                `;
              }
              return `
                <label>Tên danh mục: <label id="lbname">${issn.journal_name}</label></label>
                <label>Issn: <label id="lbissn" >${issn.issn}</label></label>
                <label>Eissn: <label  id="lbeissn" >${issn.eissn}</label></label><br />
                <input type="radio" class="radio-result" id="category-1" name="category" value="${issn.category_1}" >
                <label for="category-1">${issn.category_1}</label><br />
                <input type="radio" class="radio-result" id="category-2" name="category" value="${issn.category_2}">
                <label for="category-2">${issn.category_2}</label><br />
                <input type="radio" class="radio-result" id="category-3" name="category" value="${issn.category_3}">
                <label for="category-3">${issn.category_3}</label><br />
                <input type="radio" class="radio-result" id="category-4" name="category" value="${issn.category_4}">
                <label for="category-4">${issn.category_4}</label>
              `;
            }
            return `
              <label>Tên danh mục: <label id="lbname">${issn.journal_name}</label></label>
              <label>Issn: <label id="lbissn">${issn.issn}</label></label>
              <label>Eissn: <label id="lbeissn">${issn.eissn}</label></label><br />
              <input type="radio" class="radio-result" id="category-1" name="category" value="${issn.category_1}" >
              <label for="category-1">${issn.category_1}</label><br />
              <input type="radio" class="radio-result" id="category-2" name="category" value="${issn.category_2}">
              <label for="category-2">${issn.category_2}</label><br />
              <input type="radio" class="radio-result" id="category-3" name="category" value="${issn.category_3}">
              <label for="category-3">${issn.category_3}</label><br />
              <input type="radio" class="radio-result" id="category-4" name="category" value="${issn.category_4}">
              <label for="category-4">${issn.category_4}</label>
              <input type="radio" class="radio-result" id="category-5" name="category" value="${issn.category_5}">
              <label for="category-5">${issn.category_5}</label>
            `;
          } else {
            return `
              <label>Tên danh mục: <label id="lbname">${issn.journal_name}</label></label>
              <label>Issn: <label id="lbissn">${issn.issn}</label></label>
              <label>Eissn: <label id="lbeissn">${issn.eissn}</label></label><br />
              <input type="radio" class="radio-result" id="category-1" name="category" value="${issn.category_1}" >
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
            `;
          }
          var isIssn: any = document.getElementById("isIssnNew");
          isIssn.style.display = "block";
          isIssn.style.pointerEvents = "none";
        }
      });
      var isIssn: any = document.getElementById("isIssnNew");
      isIssn.style.display = "block";
      isIssn.innerHTML = htmls.join("");
      try {
        var cate1: any = document.getElementById("category-1");
        var cate2: any = document.getElementById("category-2");
        var cate3: any = document.getElementById("category-3");
        var cate4: any = document.getElementById("category-4");
        var cate5: any = document.getElementById("category-5");
        var cate6: any = document.getElementById("category-6");

        if (cate1.value.includes("(Q")) {
          cate1.checked = true;
        } else if (
          !cate1.value.includes("(Q") ||
          !cate2.value.includes("(Q") ||
          !cate3.value.includes("(Q") ||
          !cate4.value.includes("(Q") ||
          !cate5.value.includes("(Q") ||
          !cate5.value.includes("(Q")
        ) {
          cate1.checked = true;
        }
        if (cate1.value.includes("N/A")) {
          cate2.checked = true;
        }
        if (cate2.value.includes("N/A")) {
          cate3.checked = true;
        }
        if (cate3.value.includes("N/A")) {
          cate4.checked = true;
        }
        if (cate4.value.includes("N/A")) {
          cate5.checked = true;
        }
        if (cate5.value.includes("N/A")) {
          cate6.checked = true;
        }
        if (cate6.value.includes("N/A")) {
          cate1.checked = true;
        }
      } catch {}
    }
  };

  const handleCloseModal = () => {
    setInputSearch("");
    var isIssn = document.getElementById("isIssnNew")!;
    isIssn.innerHTML = ``;
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCloseModal}
      title="Tra cứu XH Tạp chí"
      size="55rem"
      scrollAreaComponent={ScrollArea.Autosize}
      centered
      closeOnClickOutside={false}
    >
      <TextInput
        label="Tra cứu danh mục tạp chí"
        placeholder="Nhập mã ISSN để tra cứu"
        value={inputSearch}
        onChange={(event) => setInputSearch(event.currentTarget.value)}
        onBlur={() => handleInputBlur()}
      />
      <div id="isIssnNew" style={{ display: "none" }}></div>
    </Modal>
  );
};

export default ModalTraCuuXH;

document.addEventListener("DOMContentLoaded", function() {
    getTeachers(); 
    initForm();
});

// 1. ÖĞRETMENLERİ GETİR
async function getTeachers() {
    const tableBody = document.querySelector("#teacherTable tbody");
    const toplamLabel = document.getElementById("toplam_sayi");

    try {
        const response = await fetch("api/teachers_get.php");
        const result = await response.json();

        if (result.status === 200) {
            tableBody.innerHTML = ""; 
            toplamLabel.innerText = result.data.length;

            result.data.forEach(t => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${t.ogretmen_id}</td>
                        <td style="font-weight: 500; color: white;">${t.ad} ${t.soyad}</td>
                        <td><span class="badge">${t.brans_adi || 'Belirsiz'}</span></td>
                        <td>${t.telefon}</td>
                        <td>
                            <div style="display: flex; gap: 15px; justify-content: flex-end;">
                                <button onclick="prepareEdit(${t.ogretmen_id}, '${t.ad}', '${t.soyad}', '${t.telefon}', ${t.brans_id})" 
                                        style="background:none; border:none; color:#4fc3f7; cursor:pointer; font-weight:600; display:flex; align-items:center; gap:5px; font-family: 'Poppins', sans-serif; font-size: 14px;">
                                    <i class="fas fa-edit"></i> Düzenle
                                </button>
                                <button onclick="deleteTeacher(${t.ogretmen_id})" 
                                        style="background:none; border:none; color:#ff5252; cursor:pointer; font-weight:600; display:flex; align-items:center; gap:5px; font-family: 'Poppins', sans-serif; font-size: 14px;">
                                    <i class="fas fa-trash"></i> Sil
                                </button>
                            </div>
                        </td>
                    </tr>`;
            });
        }
    } catch (error) {
        tableBody.innerHTML = "<tr><td colspan='5'>Veri yükleme hatası!</td></tr>";
    }
}

// 2. FORM İŞLEMLERİ (EKLE/GÜNCELLE)
function initForm() {
    const form = document.getElementById("teacherForm");
    const btn = document.getElementById("submitBtn");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const isUpdate = btn.getAttribute("data-mode") === "update";
            const url = isUpdate ? "api/teachers_update.php" : "api/teachers_add.php";

            const formData = {
                ad: document.getElementById("inputAd").value,
                soyad: document.getElementById("inputSoyad").value,
                brans_id: document.getElementById("inputBrans").value,
                telefon: document.getElementById("inputTel").value
            };

            if (isUpdate) formData.ogretmen_id = btn.getAttribute("data-id");

            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });
                const resData = await res.json();
                
                if (resData.status === 200 || resData.status === 201) {
                    alert("İşlem Başarılı!");
                    resetForm();
                    getTeachers();
                } else {
                    alert("Hata: " + resData.message);
                }
            } catch (err) {
                alert("Bağlantı hatası!");
            }
        });
    }
}

// 3. DÜZENLEME MODUNA GEÇ
function prepareEdit(id, ad, soyad, tel, bransId) {
    document.getElementById("inputAd").value = ad;
    document.getElementById("inputSoyad").value = soyad;
    document.getElementById("inputTel").value = tel;
    document.getElementById("inputBrans").value = bransId;

    const btn = document.getElementById("submitBtn");
    btn.innerText = "Güncelle";
    btn.setAttribute("data-mode", "update");
    btn.setAttribute("data-id", id);
    document.getElementById("formTitle").innerHTML = `<i class="fas fa-edit" style="color: var(--accent-blue);"></i> Öğretmen Düzenle`;
    
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// 4. SİLME İŞLEMİ
async function deleteTeacher(id) {
    if (!confirm("Bu öğretmeni silmek istediğinize emin misiniz?")) return;

    try {
        const res = await fetch("api/teachers_delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ogretmen_id: id })
        });
        const resData = await res.json();
        
        if (resData.status === 200) {
            getTeachers();
        } else {
            alert(resData.message);
        }
    } catch (err) {
        alert("Silme hatası!");
    }
}

function resetForm() {
    const form = document.getElementById("teacherForm");
    const btn = document.getElementById("submitBtn");
    if (form) form.reset();
    btn.innerText = "Kaydet";
    btn.removeAttribute("data-mode");
    btn.removeAttribute("data-id");
    document.getElementById("formTitle").innerHTML = `<i class="fas fa-user-plus" style="color: var(--accent-blue);"></i> Yeni Öğretmen Ekle`;
}
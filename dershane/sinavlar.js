document.addEventListener("DOMContentLoaded", function() {
    getDersler();  // Branş listesini doldurur
    getSinavlar(); // Sınav listesini tabloya çeker

    const sinavForm = document.getElementById("sinavForm");
    
    if (sinavForm) {
        sinavForm.addEventListener("submit", async function(e) {
            e.preventDefault(); 

            const submitBtn = document.getElementById("submitBtn");
            const isUpdate = submitBtn.dataset.mode === "update";

            const data = {
                islem: isUpdate ? 'guncelle' : 'ekle',
                sinav_adi: document.getElementById('sinav_adi').value,
                ders_id: document.getElementById('ders_id').value,
                sinav_tarihi: document.getElementById('sinav_tarihi').value
            };

            if (isUpdate) {
                data.sinav_id = submitBtn.dataset.id;
            }

            try {
                // Dosya api klasörü içinde olduğu için yol güncellendi
                const response = await fetch("api/sinav_islem.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                
                if (result.status === 200 || result.status === 201) {
                    sinavForm.reset();
                    resetSubmitButton();
                    getSinavlar(); 
                } else {
                    alert("Hata: " + result.message);
                }
            } catch (error) {
                alert("Bağlantı hatası!");
            }
        });
    }
});

// 1. DERSLERİ (BRANŞLARI) ÇEKER
async function getDersler() {
    const dersSelect = document.getElementById("ders_id");
    try {
        // Dosya api klasörü içinde olduğu için yol güncellendi
        const response = await fetch("api/ders_get.php"); 
        const result = await response.json();

        if (result.status === 200) {
            dersSelect.innerHTML = '<option value="">Ders Seçiniz</option>';
            result.data.forEach(ders => {
                dersSelect.innerHTML += `<option value="${ders.ders_id}">${ders.ders_adi}</option>`;
            });
        }
    } catch (error) {
        console.error("Dersler yüklenemedi!");
    }
}

// 2. SINAVLARI LİSTELE
async function getSinavlar() {
    const tableBody = document.getElementById("sinavTablo");

    try {
        // Dosya api klasörü içinde olduğu için yol güncellendi
        const response = await fetch("api/sinav_islem.php?islem=listele"); 
        const result = await response.json();

        if (result.status === 200) {
            tableBody.innerHTML = "";
            result.data.forEach(sinav => {
                tableBody.innerHTML += `
                    <tr>
                        <td>#${sinav.sinav_id}</td>
                        <td style="font-weight: 600;">${sinav.sinav_adi}</td>
                        <td>${sinav.ders_adi}</td>
                        <td>${sinav.sinav_tarihi}</td>
                        <td>
                            <div style="display: flex; gap: 15px;">
                                <button onclick="editSinav(${sinav.sinav_id}, '${sinav.sinav_adi}', ${sinav.ders_id}, '${sinav.sinav_tarihi}')" 
                                        style="background:none; border:none; color:#4fc3f7; cursor:pointer; font-weight:500; display:flex; align-items:center; gap:5px;">
                                    <i class="fas fa-edit"></i> Düzenle
                                </button>
                                <button onclick="deleteSinav(${sinav.sinav_id})" 
                                        style="background:none; border:none; color:#ff5252; cursor:pointer; font-weight:500; display:flex; align-items:center; gap:5px;">
                                    <i class="fas fa-trash"></i> Sil
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        tableBody.innerHTML = "<tr><td colspan='5' class='loading'>Sınavlar yüklenemedi.</td></tr>";
    }
}

function editSinav(id, ad, dersId, tarih) {
    document.getElementById('sinav_adi').value = ad;
    document.getElementById('ders_id').value = dersId;
    document.getElementById('sinav_tarihi').value = tarih;

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.innerText = "Sınavı Güncelle";
    submitBtn.dataset.mode = "update";
    submitBtn.dataset.id = id;
    
    // Formun olduğu yere otomatik kaydır (opsiyonel)
    document.getElementById('sinavForm').scrollIntoView({ behavior: 'smooth' });
}

function resetSubmitButton() {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.innerText = "Sınavı Kaydet";
    delete submitBtn.dataset.mode;
    delete submitBtn.dataset.id;
}

async function deleteSinav(id) {
    if (confirm("Silmek istediğinize emin misiniz?")) {
        try {
            // Dosya api klasörü içinde olduğu için yol güncellendi
            const response = await fetch("api/sinav_islem.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ islem: 'sil', sinav_id: id })
            });
            const result = await response.json();
            if (result.status === 200) {
                getSinavlar();
            } else {
                alert("Silme hatası: " + result.message);
            }
        } catch (error) {
            alert("Bağlantı hatası!");
        }
    }
}
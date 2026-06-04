document.addEventListener("DOMContentLoaded", function() {
    // Sayfa açıldığında mevcut sınıfları listele
    getClasses();

    // Formu yakala
    const sinifForm = document.getElementById("classForm") || document.querySelector("form");
    
    if (sinifForm) {
        sinifForm.addEventListener("submit", async function(e) {
            e.preventDefault(); 

            const submitBtn = document.getElementById("submitBtn");
            const isUpdate = submitBtn.dataset.mode === "update";
            const url = isUpdate ? "api/classes_update.php" : "api/classes_add.php";

            // Tasarımdaki name="sinif_adi" ve name="kapasite" ile eşleşmeli
            const data = {
                sinif_adi: document.querySelector('input[name="sinif_adi"]').value,
                kapasite: document.querySelector('input[name="kapasite"]').value
            };

            if (isUpdate) {
                data.sinif_id = submitBtn.dataset.id;
            }

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                
                if (result.status === 200 || result.status === 201) {
                    alert(result.message);
                    sinifForm.reset();
                    // Butonu eski haline döndür
                    submitBtn.innerText = "Sınıfı Kaydet";
                    submitBtn.style.background = "var(--electron-cyan)"; 
                    delete submitBtn.dataset.mode;
                    delete submitBtn.dataset.id;
                    
                    getClasses(); // Tabloyu ve sayıyı yenile
                } else {
                    alert("Hata: " + result.message);
                }
            } catch (error) {
                alert("Bağlantı hatası!");
            }
        });
    }
});

// 1. LİSTELEME VE SAYI GÜNCELLEME
async function getClasses() {
    const tableBody = document.querySelector("table tbody");
    const statNumber = document.getElementById("toplam_sinif"); // HTML'deki ID ile aynı olmalı

    try {
        const response = await fetch("api/classes_get.php");
        const result = await response.json();

        if (result.status === 200) {
            tableBody.innerHTML = "";
            
            // Üstteki "Derslik Sayısı" kartını güncelle
            if(statNumber) {
                statNumber.innerText = result.data.length;
            }

            result.data.forEach(cls => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${cls.sinif_id}</td>
                        <td style="font-weight: 600; color: #fff;">${cls.sinif_adi}</td>
                        <td>
                            <span style="background: rgba(34, 211, 238, 0.1); color: #22d3ee; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem;">
                                ${cls.kapasite} Kişilik
                            </span>
                        </td>
                        <td>
                            <button onclick="editClass(${cls.sinif_id}, '${cls.sinif_adi}', ${cls.kapasite})" 
                                    class="btn-edit" style="color: #38bdf8; background: none; border: none; cursor: pointer; font-weight: 600;">
                                <i class="fas fa-edit"></i> Düzenle
                            </button>
                            <button onclick="deleteClass(${cls.sinif_id})" 
                                    class="btn-delete" style="color: #f43f5e; background: none; border: none; cursor: pointer; font-weight: 600; margin-left: 10px;">
                                <i class="fas fa-trash"></i> Sil
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error("Liste yükleme hatası:", error);
    }
}

// 2. DÜZENLEME (Forma verileri taşıma)
function editClass(id, ad, kap) {
    document.querySelector('input[name="sinif_adi"]').value = ad;
    document.querySelector('input[name="kapasite"]').value = kap;

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.innerText = "Değişiklikleri Kaydet";
    submitBtn.style.background = "#fbbf24"; // Düzenleme modunda buton rengini değiştir (opsiyonel)
    submitBtn.dataset.mode = "update";
    submitBtn.dataset.id = id;

    // Formun olduğu bölüme yumuşak kaydır
    document.getElementById("classForm").scrollIntoView({ behavior: 'smooth' });
}

// 3. SİLME
async function deleteClass(id) {
    if (confirm("Bu sınıfı silmek istediğinize emin misiniz? Sınıfa bağlı öğrenciler etkilenebilir.")) {
        try {
            const response = await fetch("api/classes_delete.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sinif_id: id })
            });

            const result = await response.json();
            if (result.status === 200) {
                getClasses(); // Listeyi ve sayıyı anlık güncelle
            } else {
                alert("Hata: " + result.message);
            }
        } catch (error) {
            console.error("Silme hatası:", error);
        }
    }
}
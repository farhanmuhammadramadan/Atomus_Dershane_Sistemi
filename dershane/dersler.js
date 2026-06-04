document.addEventListener("DOMContentLoaded", function() {
    getLessons(); // Sayfa açılınca dersleri getir

    const bransFiltre = document.getElementById("bransFiltre");
    const dersForm = document.getElementById("dersForm");
    const ogretmenSelect = document.getElementById("ogretmenSelect");

    // Branş seçildiğinde öğretmenleri getir
    if (bransFiltre) {
        bransFiltre.addEventListener("change", function() {
            const bransId = this.value;
            if (bransId) {
                getTeachersByBrans(bransId);
            } else {
                ogretmenSelect.innerHTML = '<option value="">Önce Branş Seçiniz</option>';
            }
        });
    }

    // Yeni ders kaydetme
    if (dersForm) {
        dersForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const data = {
                ders_adi: bransFiltre.options[bransFiltre.selectedIndex].text,
                ogretmen_id: ogretmenSelect.value
            };

            try {
                const response = await fetch("api/ders_add.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                
                if (result.status === 201) {
                    alert(result.message);
                    dersForm.reset();
                    getLessons(); // Listeyi yenile
                } else {
                    alert("Hata: " + result.message);
                }
            } catch (error) {
                console.error("Kaydetme hatası:", error);
            }
        });
    }
});

// Dersleri listeleme
async function getLessons() {
    const tableBody = document.getElementById("ders-tablosu-body");
    const badge = document.getElementById("toplam_ders_badge");

    try {
        const response = await fetch("api/ders_get.php");
        const result = await response.json();

        if (result.status === 200) {
            tableBody.innerHTML = "";
            if (badge) badge.innerText = `(${result.data.length} Ders Kayıtlı)`;

            result.data.forEach(d => {
                tableBody.innerHTML += `
                    <tr>
                        <td style="color: #94a3b8;">#${d.ders_id}</td>
                        <td style="font-weight: 600; color: #f8fafc;">${d.ders_adi}</td>
                        <td style="color: #38bdf8;">${d.ogretmen_adi || 'Atanmamış'}</td>
                        <td style="text-align: center;">
                            <button onclick="deleteDers(${d.ders_id})" 
                                    style="background: transparent; border: none; color: #f43f5e; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 6px; margin: 0 auto;">
                                <i class="fas fa-trash-alt"></i> Sil
                            </button>
                        </td>
                    </tr>`;
            });
        }
    } catch (error) {
        console.error("Dersler yüklenemedi:", error);
    }
}

// Ders silme
async function deleteDers(id) {
    if (confirm("Bu dersi listeden kaldırmak istediğinize emin misiniz?")) {
        try {
            const response = await fetch("api/ders_delete.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ders_id: id })
            });
            const result = await response.json();
            if (result.status === 200) {
                getLessons(); // Başarıyla silindiyse tabloyu tazele
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Silme hatası:", error);
        }
    }
}

// Branşa göre öğretmen çekme
async function getTeachersByBrans(bransId) {
    const ogretmenSelect = document.getElementById("ogretmenSelect");
    ogretmenSelect.innerHTML = '<option value="">Yükleniyor...</option>';

    try {
        const response = await fetch(`api/teachers_get.php?brans_id=${bransId}`);
        const result = await response.json();

        if (result.status === 200) {
            let options = '<option value="">Öğretmen Seçiniz</option>';
            const filtrelenmis = result.data.filter(t => t.brans_id == bransId);
            
            filtrelenmis.forEach(t => {
                options += `<option value="${t.ogretmen_id}">${t.ad} ${t.soyad}</option>`;
            });
            ogretmenSelect.innerHTML = options;
        }
    } catch (error) {
        ogretmenSelect.innerHTML = '<option value="">Öğretmenler getirilemedi</option>';
    }
}
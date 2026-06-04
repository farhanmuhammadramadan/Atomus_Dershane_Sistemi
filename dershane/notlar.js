document.addEventListener("DOMContentLoaded", function() {
    getNotlar();
    getOgrenciler();
    getSinavlar();

    const notForm = document.getElementById("notForm");
    if (notForm) {
        notForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const notId = document.getElementById("not_id").value;
            const data = {
                islem: notId ? "guncelle" : "ekle",
                not_id: notId,
                ogrenci_id: document.getElementById("ogrenci_select").value,
                sinav_id: document.getElementById("sinav_select").value,
                puan: document.getElementById("puan").value
            };

            const response = await fetch("api/not_islem.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            if(result.status === 200 || result.status === 201) {
                alert(result.message);
                this.reset();
                document.getElementById("not_id").value = "";
                document.querySelector("#notForm button").textContent = "Notu Kaydet";
                getNotlar();
            }
        });
    }
});

async function getOgrenciler() {
    const select = document.getElementById("ogrenci_select");
    try {
        const response = await fetch("api/students_get.php"); 
        const result = await response.json();
        
        if (result.status === 200) {
            select.innerHTML = '<option value="">Öğrenci Seçiniz</option>';
            result.data.forEach(o => {
                select.innerHTML += `<option value="${o.ogrenci_id}">${o.ad} ${o.soyad}</option>`;
            });
        }
    } catch (error) {
        console.error("Öğrenciler yüklenirken hata:", error);
    }
}

async function getSinavlar() {
    const select = document.getElementById("sinav_select");
    try {
        const response = await fetch("api/sinav_islem.php?islem=listele");
        const result = await response.json();
        if (result.status === 200) {
            select.innerHTML = '<option value="">Sınav Seçiniz</option>';
            result.data.forEach(s => {
                select.innerHTML += `<option value="${s.sinav_id}">${s.sinav_adi}</option>`;
            });
        }
    } catch (error) {
        console.error("Sınavlar yüklenirken hata:", error);
    }
}

async function getNotlar() {
    const tablo = document.getElementById("notTabloBody");
    try {
        const response = await fetch("api/not_islem.php?islem=listele");
        const result = await response.json();
        
        if(result.status === 200) {
            tablo.innerHTML = "";
            result.data.forEach(n => {
                tablo.innerHTML += `
                    <tr>
                        <td>${n.ad} ${n.soyad}</td>
                        <td>${n.sinav_adi}</td>
                        <td><strong style="color: ${n.puan >= 50 ? '#10b981' : '#ef4444'};">${n.puan}</strong></td>
                        <td>${n.sinav_tarihi}</td>
                        <td>
                            <div style="display: flex; gap: 15px;">
                                <button onclick="editNot(${n.not_id}, ${n.ogrenci_id}, ${n.sinav_id}, ${n.puan})" 
                                        style="background:none; border:none; color:#4fc3f7; cursor:pointer; font-weight:600; display:flex; align-items:center; gap:5px; font-family: 'Poppins', sans-serif; font-size: 14px;">
                                    <i class="fas fa-edit"></i> Düzenle
                                </button>
                                <button onclick="deleteNot(${n.not_id})" 
                                        style="background:none; border:none; color:#ff5252; cursor:pointer; font-weight:600; display:flex; align-items:center; gap:5px; font-family: 'Poppins', sans-serif; font-size: 14px;">
                                    <i class="fas fa-trash"></i> Sil
                                </button>
                            </div>
                        </td>
                    </tr>`;
            });
        }
    } catch (error) {
        console.error("Notlar listelenirken hata oluştu");
    }
}

async function deleteNot(id) {
    if(confirm("Bu notu silmek istediğinize emin misiniz?")) {
        await fetch("api/not_islem.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ islem: "sil", not_id: id })
        });
        getNotlar();
    }
}

function editNot(id, ogrenci, sinav, puan) {
    document.getElementById("not_id").value = id;
    document.getElementById("ogrenci_select").value = ogrenci;
    document.getElementById("sinav_select").value = sinav;
    document.getElementById("puan").value = puan;
    document.querySelector("#notForm button").textContent = "Güncelle";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
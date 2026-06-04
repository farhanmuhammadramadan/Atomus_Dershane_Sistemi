document.addEventListener("DOMContentLoaded", function() {
    // Sayfa yüklendiğinde verileri çek
    getOdemeler();
    getOgrenciler();

    // Form gönderme işlemi
    const odemeForm = document.getElementById("odemeForm");
    if (odemeForm) {
        odemeForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const data = {
                islem: "ekle",
                ogrenci_id: document.getElementById("ogrenci_select").value,
                miktar: document.getElementById("miktar").value,
                odeme_turu: document.getElementById("odeme_turu").value,
                odeme_tarihi: document.getElementById("odeme_tarihi").value
            };

            try {
                const response = await fetch("api/odeme_islem.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if(result.status === 201) {
                    alert(result.message);
                    this.reset();
                    getOdemeler(); // Tabloyu ve kasayı güncelle
                } else {
                    alert("Hata: " + result.message);
                }
            } catch (error) {
                console.error("Ödeme kaydedilirken hata oluştu:", error);
                alert("Sunucuya bağlanılamadı. Lütfen api/odeme_islem.php dosyasını kontrol edin.");
            }
        });
    }
});

// Öğrencileri seçim kutusuna (select) doldurur
async function getOgrenciler() {
    const select = document.getElementById("ogrenci_select");
    if (!select) return;

    try {
        // Dosya dizinindeki 'students_get.php' kullanılıyor
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

// Ödemeleri listeler ve kasa toplamını hesaplar
async function getOdemeler() {
    const tablo = document.getElementById("odemeTabloBody");
    const kasaSpan = document.getElementById("kasa_toplam");
    if (!tablo) return;

    try {
        const response = await fetch("api/odeme_islem.php?islem=listele");
        const result = await response.json();
        
        if(result.status === 200) {
            tablo.innerHTML = "";
            let toplamKasa = 0;

            result.data.forEach(o => {
                toplamKasa += parseFloat(o.miktar);
                tablo.innerHTML += `
                    <tr>
                        <td>#TR-${o.odeme_id}</td>
                        <td>${o.ad} ${o.soyad}</td>
                        <td style="font-weight: 600;">₺${parseFloat(o.miktar).toLocaleString('tr-TR')}</td>
                        <td>${o.odeme_turu}</td>
                        <td>${o.odeme_tarihi}</td>
                        <td>
                            <button onclick="window.print()" 
                                style="color: #3b82f6; background: none; border: none; font-weight: 600; cursor: pointer; margin-right: 15px; font-family: 'Poppins', sans-serif;">
                                Makbuz
                            </button>
                            <button onclick="iptalEt(${o.odeme_id})" 
                                style="color: #ef4444; background: none; border: none; font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif;">
                                İptal
                            </button>
                        </td>
                    </tr>`;
            });
            
            if (kasaSpan) {
                kasaSpan.textContent = "₺" + toplamKasa.toLocaleString('tr-TR');
            }
        }
    } catch (error) {
        console.error("Ödemeler listelenirken hata:", error);
        tablo.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Veriler yüklenemedi. API dosyasını kontrol edin.</td></tr>';
    }
}

// Ödeme iptal etme fonksiyonu
async function iptalEt(id) {
    if(confirm("Bu ödeme kaydını iptal etmek istediğinize emin misiniz?")) {
        try {
            const response = await fetch("api/odeme_islem.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ islem: "sil", odeme_id: id })
            });
            const result = await response.json();
            if(result.status === 200) {
                getOdemeler(); // Listeyi tazele
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Silme işlemi sırasında hata:", error);
        }
    }
}
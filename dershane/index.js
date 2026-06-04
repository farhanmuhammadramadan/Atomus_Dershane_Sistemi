document.addEventListener("DOMContentLoaded", function() {
    getStats();
    getSonOgrenciler();
});

// İstatistik kartlarını günceller
async function getStats() {
    try {
        // Öğrenci, Öğretmen, Sınıf ve Ödemelerden gelen verileri topluca alıyoruz
        const [ogrRes, ogrtRes, sinifRes, odemeRes] = await Promise.all([
            fetch("api/students_get.php"),
            fetch("api/teachers_get.php"),
            fetch("api/classes_get.php"),
            fetch("api/odeme_islem.php?islem=listele")
        ]);

        const students = await ogrRes.json();
        const teachers = await ogrtRes.json();
        const classes = await sinifRes.json();
        const payments = await odemeRes.json();

        // Toplam Sayıları Bas
        document.getElementById("toplam_ogrenci").textContent = students.data.length || 0;
        document.getElementById("toplam_ogretmen").textContent = teachers.data.length || 0;
        document.getElementById("toplam_sinif").textContent = classes.data.length || 0;

        // Toplam Geliri Hesapla
        let toplamGelir = 0;
        if(payments.status === 200) {
            payments.data.forEach(p => toplamGelir += parseFloat(p.miktar));
        }
        document.getElementById("toplam_gelir").textContent = "₺" + toplamGelir.toLocaleString('tr-TR');

    } catch (error) {
        console.error("İstatistikler yüklenirken hata:", error);
    }
}

// Ana sayfadaki öğrenci listesini günceller
async function getSonOgrenciler() {
    const tablo = document.getElementById("index_ogrenci_tablo");
    try {
        const response = await fetch("api/students_get.php");
        const result = await response.json();
        
        if(result.status === 200) {
            tablo.innerHTML = "";
            // Sadece son 5 veya 10 öğrenciyi göstermek için slice kullanabilirsin
            result.data.slice(0, 5).forEach(o => {
                tablo.innerHTML += `
                    <tr>
                        <td>${o.ogrenci_id}</td>
                        <td>${o.ad}</td>
                        <td>${o.soyad}</td>
                        <td>${o.telefon}</td>
                    </tr>`;
            });
        }
    } catch (error) {
        console.error("Öğrenci listesi hatası:", error);
    }
}
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    
    // Eğer ekran genişliği 992px'den küçükse (Mobil/Tablet)
    if (window.innerWidth <= 992) {
        sidebar.classList.toggle('active'); // Sol taraftan kaydırarak getir
    } else {
        // Masaüstü için daraltma/genişletme
        sidebar.classList.toggle('collapsed');
        
        const icon = document.getElementById('toggle-icon');
        if(sidebar.classList.contains('collapsed')) {
            icon.classList.replace('fa-chevron-left', 'fa-chevron-right');
        } else {
            icon.classList.replace('fa-chevron-right', 'fa-chevron-left');
        }
    }
}
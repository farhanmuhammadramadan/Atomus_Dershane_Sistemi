document.addEventListener("DOMContentLoaded", function() {
    getStudents(); 
});

async function getStudents() {
    const studentTableBody = document.getElementById("index_ogrenci_tablo");
    const totalCounter = document.getElementById("toplam_ogrenci");

    try {
        const response = await fetch("api/students_get.php?t=" + new Date().getTime());
        const result = await response.json();
        const studentsArray = result.data || [];

        // Sayaç Güncelleme
        if (totalCounter) {
            totalCounter.innerText = studentsArray.length;
        }

        // Tablo Doldurma
        if (studentTableBody) {
            studentTableBody.innerHTML = ""; 
            
            if (studentsArray.length === 0) {
                studentTableBody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Kayıtlı öğrenci bulunamadı.</td></tr>";
            } else {
                studentsArray.forEach(student => {
                    const row = `
                        <tr>
                            <td>#${student.ogrenci_id}</td>
                            <td>
                                <span style="font-weight: 600;">${student.ad}</span> 
                                <span style="text-transform: uppercase;">${student.soyad}</span>
                            </td>
                            <td><i class="fas fa-phone-alt"></i> ${student.telefon}</td>
                            <td>
                                <div style="display: flex; justify-content: flex-start;">
                                    <button onclick="deleteStudent(${student.ogrenci_id})" 
                                            style="background:none; border:none; color:#ff5252; cursor:pointer; font-weight:600; display:flex; align-items:center; gap:5px; font-family: 'Poppins', sans-serif; font-size: 14px;">
                                        <i class="fas fa-trash"></i> Sil
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                    studentTableBody.innerHTML += row;
                });
            }
        }
    } catch (error) {
        console.error("Hata:", error);
    }
}

// EKLEME İŞLEMİ
const studentForm = document.querySelector("form");
if (studentForm) {
    studentForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const studentData = {
            ogrenci_ad: document.getElementsByName("ad")[0].value,
            ogrenci_soyad: document.getElementsByName("soyad")[0].value,
            ogrenci_tel: document.getElementsByName("telefon")[0].value
        };

        try {
            const response = await fetch("api/students_add.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(studentData)
            });
            
            const result = await response.json();
            if (result.status === 201 || result.status === 200) {
                alert("Öğrenci başarıyla eklendi!");
                studentForm.reset();
                await getStudents(); 
            }
        } catch (error) {
            console.error("Ekleme hatası:", error);
        }
    });
}

// SİLME İŞLEMİ
async function deleteStudent(id) {
    if (confirm("Öğrenciyi silmek istediğinize emin misiniz?")) {
        try {
            const response = await fetch("api/students_delete.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ogrenci_id: id })
            });
            const result = await response.json();
            if (result.status === 200) {
                await getStudents(); 
            }
        } catch (error) {
            console.error("Silme hatası:", error);
        }
    }
}
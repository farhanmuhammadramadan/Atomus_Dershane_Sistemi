<?php
// JSON formatında yanıt vereceğimizi belirtiyoruz
header("Content-Type: application/json; charset=UTF-8");

// Veritabanı bağlantı dosyasını dahil ediyoruz
include "connect.php";

// Frontend'den (JavaScript) gelen paketlenmiş veriyi (JSON) alıyoruz
$data = json_decode(file_get_contents("php://input"), true);

// Verilerin gelip gelmediğini kontrol ediyoruz
if (!empty($data["ogrenci_ad"]) && !empty($data["ogrenci_soyad"])) {
    try {
        // SQL sorgusunu hazırlıyoruz (Senin ogrenciler tablon ve sütun isimlerin)
        $sql = "INSERT INTO ogrenciler (ad, soyad, telefon) VALUES (:ad, :soyad, :tel)";
        $stmt = $pdo->prepare($sql);

        // Verileri güvenli bir şekilde (PDO bind) sorguya yerleştiriyoruz
        $result = $stmt->execute([
            ":ad"    => $data["ogrenci_ad"],
            ":soyad" => $data["ogrenci_soyad"],
            ":tel"   => $data["ogrenci_tel"] ?? null // Telefon boş olabilir
        ]);

        if ($result) {
            // Kayıt başarılıysa 201 (Created) koduyla yanıt veriyoruz
            http_response_code(201);
            echo json_encode(["status" => 201, "message" => "Öğrenci başarıyla kaydedildi!"]);
        } else {
            http_response_code(400);
            echo json_encode(["status" => 400, "message" => "Kayıt sırasında bir sorun oluştu."]);
        }

    } catch (PDOException $e) {
        // Bir veritabanı hatası oluşursa (Örn: Sütun ismi yanlışsa)
        http_response_code(500);
        echo json_encode(["status" => 500, "message" => "Veritabanı hatası: " . $e->getMessage()]);
    }
} else {
    // Ad veya Soyad boş gönderildiyse
    http_response_code(400);
    echo json_encode(["status" => 400, "message" => "Eksik veri: Ad ve Soyad zorunludur!"]);
}
?>
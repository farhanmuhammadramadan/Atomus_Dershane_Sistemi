<?php
// JSON formatında yanıt döneceğimizi bildiriyoruz
header("Content-Type: application/json; charset=UTF-8");

// Veritabanı bağlantısı
include "connect.php";

// Frontend'den (JavaScript) gelen veriyi alıyoruz
// Silme işlemi için genellikle {"ogrenci_id": 5} gibi bir veri gelir
$data = json_decode(file_get_contents("php://input"), true);

// Silinecek öğrencinin ID'si var mı kontrol ediyoruz
if (!empty($data["ogrenci_id"])) {
    try {
        // Senin tablonun adı: ogrenciler
        // Senin ID sütunun: ogrenci_id
        $sql = "DELETE FROM ogrenciler WHERE ogrenci_id = :id";
        $stmt = $pdo->prepare($sql);

        // Sorguyu çalıştırıyoruz
        $stmt->execute([
            ":id" => $data["ogrenci_id"]
        ]);

        //rowCount() ile gerçekten bir satır silindi mi kontrol ediyoruz
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["status" => 200, "message" => "Öğrenci başarıyla silindi."]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => 404, "message" => "Öğrenci bulunamadı veya zaten silinmiş."]);
        }

    } catch (PDOException $e) {
        // Veritabanı hatası (Örn: Bu öğrenci başka bir tabloda -notlar gibi- kayıtlıysa ve silme kısıtı varsa)
        http_response_code(500);
        echo json_encode(["status" => 500, "message" => "Veritabanı hatası: " . $e->getMessage()]);
    }
} else {
    // ID gönderilmediyse
    http_response_code(400);
    echo json_encode(["status" => 400, "message" => "Hata: Silinecek öğrencinin ID bilgisi eksik!"]);
}
?>
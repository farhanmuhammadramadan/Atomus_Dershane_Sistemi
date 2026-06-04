<?php
// JSON formatında yanıt döneceğimizi bildiriyoruz
header("Content-Type: application/json; charset=UTF-8");

// Veritabanı bağlantısını dahil ediyoruz
include "connect.php";

// Frontend'den (teachers.js) gönderilen JSON verisini alıyoruz
$data = json_decode(file_get_contents("php://input"), true);

// Silinecek öğretmenin ID'si gönderilmiş mi kontrol ediyoruz
if (!empty($data["ogretmen_id"])) {
    try {
        // SQL sorgusunu hazırlıyoruz
        // Tablo adın: ogretmenler, Birincil anahtarın: ogretmen_id
        $sql = "DELETE FROM ogretmenler WHERE ogretmen_id = :id";
        $stmt = $pdo->prepare($sql);

        // ID bilgisini güvenli bir şekilde sorguya bağlıyoruz
        $stmt->execute([
            ":id" => $data["ogretmen_id"]
        ]);

        // Gerçekten bir satır silindi mi kontrol ediyoruz (rowCount)
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode([
                "status" => 200, 
                "message" => "Öğretmen başarıyla silindi."
            ]);
        } else {
            // Eğer o ID'de bir öğretmen yoksa
            http_response_code(404);
            echo json_encode([
                "status" => 404, 
                "message" => "Hata: Silinecek öğretmen bulunamadı."
            ]);
        }

    } catch (PDOException $e) {
        // Veritabanı kısıtlaması hatası (Örn: Bu öğretmene bağlı sınıflar veya dersler varsa)
        http_response_code(500);
        echo json_encode([
            "status" => 500, 
            "message" => "Veritabanı hatası: Bu öğretmen silinemez (bağlı veriler olabilir). " . $e->getMessage()
        ]);
    }
} else {
    // ID bilgisi boş gönderildiyse
    http_response_code(400);
    echo json_encode([
        "status" => 400, 
        "message" => "Hata: Silme işlemi için ogretmen_id gereklidir!"
    ]);
}
?>
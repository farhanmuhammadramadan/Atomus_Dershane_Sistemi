<?php
header("Content-Type: application/json; charset=UTF-8");
error_reporting(E_ALL);
ini_set('display_errors', 1);
include "connect.php";

$data = json_decode(file_get_contents("php://input"), true);

// Veritabanı yapına uygun olarak sadece sinif_adi ve kapasite kontrolü yapıyoruz
if (!empty($data["sinif_adi"]) && !empty($data["kapasite"])) {
    try {
        // SQL Sorgusu: sinif_seviye sütununu çıkardık çünkü tabloda yok
        $sql = "INSERT INTO siniflar (sinif_adi, kapasite) VALUES (:ad, :kap)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":ad" => $data["sinif_adi"],
            ":kap" => $data["kapasite"]
        ]);

        echo json_encode(["status" => 201, "message" => "Sınıf başarıyla oluşturuldu!"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => 500, "message" => "Veritabanı Hatası: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => 400, "message" => "Lütfen sınıf adı ve kapasite alanlarını doldurun!"]);
}
?>
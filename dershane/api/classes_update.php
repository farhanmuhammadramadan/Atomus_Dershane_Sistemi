<?php
header("Content-Type: application/json; charset=UTF-8");
// Hata raporlamayı açalım ki bir sorun olursa görebilelim
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "connect.php";

// JavaScript'ten gelen JSON verisini alıyoruz
$data = json_decode(file_get_contents("php://input"), true);

// Gerekli alanların dolu olup olmadığını kontrol ediyoruz
if (!empty($data["sinif_id"]) && !empty($data["sinif_adi"]) && !empty($data["kapasite"])) {
    try {
        // SQL Sorgusu: Veritabanında sadece sinif_adi ve kapasite olduğu için seviyeyi çıkardık
        $sql = "UPDATE siniflar SET 
                sinif_adi = :ad, 
                kapasite = :kap 
                WHERE sinif_id = :id";
        
        $stmt = $pdo->prepare($sql);
        
        $result = $stmt->execute([
            ":ad" => $data["sinif_adi"],
            ":kap" => $data["kapasite"],
            ":id" => $data["sinif_id"]
        ]);

        if ($result) {
            echo json_encode([
                "status" => 200, 
                "message" => "Sınıf bilgileri başarıyla güncellendi!"
            ]);
        } else {
            echo json_encode([
                "status" => 500, 
                "message" => "Güncelleme işlemi yapılamadı."
            ]);
        }

    } catch (PDOException $e) {
        // Veritabanı hatası oluşursa burası çalışır
        echo json_encode([
            "status" => 500, 
            "message" => "Veritabanı Hatası: " . $e->getMessage()
        ]);
    }
} else {
    // Veriler eksik gelirse burası çalışır
    echo json_encode([
        "status" => 400, 
        "message" => "Eksik veri gönderildi. Lütfen tüm alanları doldurun."
    ]);
}
?>
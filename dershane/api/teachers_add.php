<?php
header("Content-Type: application/json; charset=UTF-8");
include "connect.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data["ad"]) && !empty($data["soyad"])) {
    try {
        // ÇÖZÜM: Benzersiz bir kullanıcı adı ve şifre oluşturuyoruz
        $kullanici_adi = strtolower($data["ad"]) . rand(100, 999); 
        $varsayilan_sifre = password_hash("123456", PASSWORD_DEFAULT);

        $sql = "INSERT INTO ogretmenler (ad, soyad, brans_id, telefon, kullanici_adi, sifre) 
                VALUES (:ad, :soyad, :brans, :tel, :kadi, :sifre)";
        
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            ":ad"    => $data["ad"],
            ":soyad" => $data["soyad"],
            ":brans" => $data["brans_id"],
            ":tel"   => $data["telefon"],
            ":kadi"  => $kullanici_adi, // Hata veren kısım burasıydı, artık dolu gidiyor
            ":sifre" => $varsayilan_sifre
        ]);

        echo json_encode(["status" => 201, "message" => "Öğretmen başarıyla eklendi! Kullanıcı Adı: $kullanici_adi"]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => 500, "message" => "Hata: " . $e->getMessage()]);
    }
}
?>
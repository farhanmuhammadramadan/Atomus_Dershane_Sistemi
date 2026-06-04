<?php
header("Content-Type: application/json; charset=UTF-8");
include "connect.php"; // api klasörü içindeki connect.php'yi kullanır

// Dersler sayfasından bir brans_id gönderilmişse onu alıyoruz
$brans_id = isset($_GET['brans_id']) ? $_GET['brans_id'] : null;

try {
    // Tüm sütunları seçiyoruz ki öğretmenler sayfası bozulmasın
    $sql = "SELECT 
                o.ogretmen_id, 
                o.ad, 
                o.soyad, 
                CONCAT(o.ad, ' ', o.soyad) as ad_soyad, 
                o.telefon, 
                o.brans_id,
                b.brans_adi 
            FROM ogretmenler o
            LEFT JOIN branslar b ON o.brans_id = b.brans_id";
    
    // Eğer dersler sayfasından branş filtresi geldiyse SQL'e ekliyoruz
    if ($brans_id) {
        $sql .= " WHERE o.brans_id = :bid";
    }
    
    $sql .= " ORDER BY o.ogretmen_id DESC";
    
    $stmt = $pdo->prepare($sql);
    if ($brans_id) {
        $stmt->bindParam(':bid', $brans_id);
    }
    $stmt->execute();
    $teachers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => 200, "data" => $teachers]);

} catch (PDOException $e) {
    echo json_encode(["status" => 500, "message" => "Hata: " . $e->getMessage()]);
}
?>
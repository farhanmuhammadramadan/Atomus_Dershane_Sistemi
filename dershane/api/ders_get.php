<?php
header("Content-Type: application/json; charset=UTF-8");
include "connect.php"; 

try {
    $sql = "SELECT 
                d.ders_id, 
                d.ders_adi, 
                CONCAT(o.ad, ' ', o.soyad) as ogretmen_adi 
            FROM dersler d
            LEFT JOIN ogretmenler o ON d.ogretmen_id = o.ogretmen_id
            ORDER BY d.ders_id DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    echo json_encode(["status" => 200, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
} catch (PDOException $e) {
    echo json_encode(["status" => 500, "message" => $e->getMessage()]);
}
?>
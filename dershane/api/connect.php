<?php
// Veritabanı bağlantı bilgileri
// Senin oluşturduğun veritabanı ismine göre düzenlendi
$host = "localhost";
$dbname = "dershane_sistemi"; // Burası phpMyAdmin'deki veritabanı adınla aynı olmalı
$username = "root";
$password = ""; // XAMPP kullanıyorsan varsayılan olarak boştur

try {
    // PDO ile veritabanı bağlantısı oluşturulur
    // UTF8 ayarı Türkçe karakterlerin (ş, ı, ğ vb.) bozulmaması için eklendi
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);

    // PDO hata modu aktif edilir (Bir hata olursa bize detaylı söyler)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    // Bağlantı başarısız olursa JSON formatında hata mesajı döner
    header("Content-Type: application/json");
    http_response_code(500);

    echo json_encode([
        "status" => 500,
        "message" => "Veritabanı bağlantı hatası: " . $e->getMessage()
    ]);

    exit;
}

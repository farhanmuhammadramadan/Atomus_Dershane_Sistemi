
<?php
ob_clean(); // Önceki tüm çıktıları temizle
header('Content-Type: application/json; charset=utf-8');

// connect.php ile aynı klasörde olduğun için yolu düzelttik
include_once 'connect.php'; 

session_start();

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data && isset($pdo)) {
    $kadi = $data['kullanici_adi'];
    $sifre = $data['sifre'];

    try {
        // connect.php'deki $pdo değişkenini kullanıyoruz
        $sorgu = $pdo->prepare("SELECT * FROM kullanicilar WHERE kullanici_adi = ? AND sifre = ?");
        $sorgu->execute([$kadi, $sifre]);
        $user = $sorgu->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $_SESSION['user_id'] = $user['kullanici_id'];
            echo json_encode(["status" => 200, "message" => "Giriş başarılı"]);
        } else {
            echo json_encode(["status" => 401, "message" => "Kullanıcı adı veya şifre hatalı"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => 500, "message" => "Sorgu hatası"]);
    }
} else {
    echo json_encode(["status" => 500, "message" => "Bağlantı sağlanamadı!"]);
}
exit;
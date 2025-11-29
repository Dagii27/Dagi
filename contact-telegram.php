<?php
// contact-telegram.php
// Simple endpoint to forward contact form messages to your Telegram bot/channel.
// IMPORTANT: insert your own BOT_TOKEN and CHAT_ID below.

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!is_array($data)) {
    $data = $_POST; // fallback for form-encoded
}

$name    = isset($data['name'])    ? trim($data['name'])    : '';
$email   = isset($data['email'])   ? trim($data['email'])   : '';
$message = isset($data['message']) ? trim($data['message']) : '';

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address.']);
    exit;
}

// basic minimum word check for the message
$wordCount = str_word_count($message);
if ($wordCount < 5) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please write at least 5 words.']);
    exit;
}

// very simple bad-word / hate-speech filter (extend this list as needed)
$badWords = [
    'hate', 'kill', 'racist', 'terror', 'terrorist', 'suicide', 'bomb'
];

$lower = strtolower($message);
foreach ($badWords as $bad) {
    if (strpos($lower, $bad) !== false) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Your message contains inappropriate language.']);
        exit;
    }
}

// TODO: set these to your own bot token and chat id
$botToken = '8453492936:AAEH-TQ447l7cq-FQk07E1wwY9qguO6A2YU';
$chatId   = '5994127216'; // e.g. 123456789 or -100123456789

if ($botToken === 'YOUR_TELEGRAM_BOT_TOKEN_HERE' || $chatId === 'YOUR_CHAT_ID_OR_CHANNEL_ID_HERE') {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Telegram bot is not configured yet.']);
    exit;
}

$text  = "\u2709 New Portfolio Message" . "\n";
$text .= "From: " . $name . "\n";
$text .= "Email: " . $email . "\n\n";
$text .= "Message:\n" . $message;

$apiUrl = "https://api.telegram.org/bot{$botToken}/sendMessage";

$params = [
    'chat_id' => $chatId,
    'text'    => $text,
    'parse_mode' => 'HTML'
];

$options = [
    'http' => [
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($params),
        'timeout' => 10
    ],
];

$context  = stream_context_create($options);
$result   = @file_get_contents($apiUrl, false, $context);

if ($result === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Failed to contact Telegram API.']);
    exit;
}

$response = json_decode($result, true);

if (!isset($response['ok']) || !$response['ok']) {
    http_response_code(500);
    $err = isset($response['description']) ? $response['description'] : 'Unknown error from Telegram.';
    echo json_encode(['ok' => false, 'error' => $err]);
    exit;
}

echo json_encode(['ok' => true]);

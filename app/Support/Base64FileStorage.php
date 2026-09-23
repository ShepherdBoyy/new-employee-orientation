<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class Base64FileStorage
{
    public static function store(string $base64, string $folder, string $filename, string $disk = "private"): string
    {
        $data = preg_replace("/^data:\w+\/[a-zA-Z0-9.+-]+;base64,/", "", $base64);
        $decoded = base64_decode($data);

        $path = $folder . "/" . $filename;

        Storage::disk($disk)->put($path, $decoded);

        return $path;
    }
}
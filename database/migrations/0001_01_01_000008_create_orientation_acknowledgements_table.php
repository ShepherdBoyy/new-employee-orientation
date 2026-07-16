<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orientation_acknowledgements', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->unique()->constrained()->cascadeOnDelete();
            $table->string("full_name_confirmation");
            $table->string("signature_path");
            $table->string("photo_path");
            $table->string("integrity_hash");
            $table->string("ip_address");
            $table->text('user_agent');
            $table->timestamp("acknowledged_at");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orientation_acknowledgements');
    }
};

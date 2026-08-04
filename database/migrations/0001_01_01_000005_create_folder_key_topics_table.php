<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('folder_key_topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId("folder_id")->constrained()->cascadeOnDelete();
            $table->string("label");
            $table->string("slug");
            $table->unsignedInteger("order")->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('folder_key_topics');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('slides', function (Blueprint $table) {
            $table->id();
            $table->foreignId("folder_id")->constrained()->cascadeOnDelete();
            $table->foreignId("key_topic_id")->constrained("folder_key_topics")->cascadeOnDelete();
            $table->enum("type", ["image", "video"]);
            $table->string("file_path");
            $table->unsignedInteger("order")->default(1);
            $table->timestamps();
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('slides');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_slides', function (Blueprint $table) {
            $table->id();
            $table->foreignId("company_id")->constrained()->cascadeOnDelete();
            $table->foreignId("slide_id")->constrained()->cascadeOnDelete();
            $table->unsignedInteger("order");
            $table->timestamps();

            $table->unique(["company_id", "slide_id"]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_slides');
    }
};

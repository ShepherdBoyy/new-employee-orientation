<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_employee_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId("company_id")->constrained()->cascadeOnDelete();
            $table->enum("employee_type", ["office", "field"]);
            $table->timestamps();

            $table->unique(["company_id", "employee_type"]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_employee_types');
    }
};

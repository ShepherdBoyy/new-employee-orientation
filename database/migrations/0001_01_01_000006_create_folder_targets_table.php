<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('folder_targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId("folder_id")->constrained()->cascadeOnDelete();
            $table->foreignId("company_id")->nullable()->constrained()->cascadeOnDelete();
            $table->enum("employee_type", ["office", "field"])->nullable();
            $table->foreignId("job_position_id")->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger("order")->default(1);
            $table->timestamps();

            $table->unique(
                ["folder_id", "company_id", "employee_type", "job_position_id"],
                "folder_targets_unique"
            );
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('folder_targets');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->nullable()->constrained()->nullOnDelete();
            $table->string("user_name")->nullable();
            $table->string("user_role")->nullable();
            $table->string("action");
            $table->string("subject_type")->nullable();
            $table->unsignedBigInteger("subject_id")->nullable();
            $table->text("description");
            $table->json("old_values")->nullable();
            $table->json("new_values")->nullable();
            $table->string("ip_address")->nullable();
            $table->string("user_agent")->nullable();
            $table->timestamp("created_at")->useCurrent();

            $table->index(["subject_type", "subject_id"]);
            $table->index("user_id");
            $table->index("action");
            $table->index("created_at");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
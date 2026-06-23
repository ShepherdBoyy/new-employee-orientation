<?php

use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\SlideController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\SuperAdmin\CompanyAdminController;
use App\Http\Controllers\SuperAdmin\CompanyController;
use Illuminate\Support\Facades\Route;

Route::middleware("guest")->group(function () {
    Route::get("/login", [AuthController::class, "showLogin"])->name("login");
    Route::post("/login", [AuthController::class, "login"])->name("login.attempt");
});

Route::middleware("auth")->group(function () {
    Route::post("/logout", [AuthController::class, "logout"])->name("logout");
    
    Route::middleware(["role:company_admin"])->prefix("admin")->name("admin.")->group(function () {
        Route::get("/dashboard", fn() => inertia("Admin/Dashboard"))->name("dashboard");

        Route::get("/slides", [SlideController::class, "index"])->name("slides.index");
        Route::post("/slides", [SlideController::class, "store"])->name("slides.store");
        Route::patch("/slides/reorder", [SlideController::class, "reorder"])->name("slides.reorder");
        Route::delete("/slides/{slide}", [SlideController::class, "destroy"])->name("slides.destroy");

        Route::get("/slides/preview", [EmployeeController::class, "preview"])->name("slides.preview");

        Route::get("/employees", [EmployeeController::class, "index"])->name("employees.index");
        Route::post("/employees", [EmployeeController::class, "store"])->name("employees.store");
        Route::put("/employees/{employee}", [EmployeeController::class, "update"])->name("employees.update");
        Route::patch("/employees/{employee}/toggle-status", [EmployeeController::class, "toggleStatus"])->name("employees.toggle-status");
        Route::delete("/employees/{employee}", [EmployeeController::class, "destroy"])->name("employees.destroy");
        Route::post("/employees/{employee}/reset-password", [EmployeeController::class, "resetPassword"])->name("employees.reset-password");
        
        Route::get("/extension-requests", [EmployeeController::class, "extensionRequests"])->name("extension-requests.index");
        Route::patch("/extension-requests/{extensionRequests}/approve", [EmployeeController::class, "approveExtension"])->name("extension-requests.approve");
        Route::patch("/extension-requests/{extensionRequests}/deny", [EmployeeController::class, "denyExtension"])->name("extension-requests.deny");
    });

    Route::middleware(["role:employee", "expiry"])->prefix("orientation")->name("employee.")->group(function () {
        Route::get("/", fn() => inertia("Employee/Orientation"))->name("orientation");
        Route::get("/locked", fn() => inertia("Employee/AccountLocked"))->name("account-locked");
    });
});
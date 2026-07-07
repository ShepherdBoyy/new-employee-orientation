<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\ExtensionRequestController;
use App\Http\Controllers\Admin\FolderController;
use App\Http\Controllers\Admin\FolderTargetController;
use App\Http\Controllers\Admin\JobPositionController;
use App\Http\Controllers\Admin\SlideController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Employee\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::middleware("guest")->group(function () {
    Route::get("/login", [AuthController::class, "showLogin"])->name("login");
    Route::post("/login", [AuthController::class, "login"])->name("login.attempt");
});

Route::middleware("auth")->group(function () {
    Route::post("/logout", [AuthController::class, "logout"])->name("logout");
    
    Route::middleware("role:admin")->prefix("admin")->name("admin.")->group(function () {
        Route::get("/dashboard", [AdminController::class, "index"])->name("dashboard");

        Route::get("/companies", [CompanyController::class, "index"])->name("companies.index");
        Route::post("/companies", [CompanyController::class, "store"])->name("companies.store");
        Route::put("/companies/{company}", [CompanyController::class, "update"])->name("companies.update");
        Route::patch("/companies/{company}/toggle-status", [CompanyController::class, "toggleStatus"])->name("companies.toggle-status");
        Route::delete("/companies/{company}", [CompanyController::class, "destroy"])->name("companies.destroy");

        Route::get("/job-positions", [JobPositionController::class, "index"])->name("job-positions.index");
        Route::post('/job-positions', [JobPositionController::class, 'store'])->name('job-positions.store');
        Route::put('/job-positions/{jobPosition}', [JobPositionController::class, 'update'])->name('job-positions.update');
        Route::delete('/job-positions/{jobPosition}', [JobPositionController::class, 'destroy'])->name('job-positions.destroy');

        Route::get("/folders", [FolderController::class,"index"])->name("folders.index");
        Route::post("/folders", [FolderController::class, "store"])->name("folders.store");
        Route::put("/folders/{folder}", [FolderController::class, "update"])->name("folders.update");
        Route::patch("/folders/reorder", [FolderController::class, "reorder"])->name("folders.reorder");
        Route::delete("/folders/{folder}", [FolderController::class, "destroy"])->name("folders.destroy");

        Route::get("/folders/{folder}", [SlideController::class, "index"])->name("folders.slide.index");
        Route::post("/folders/{folder}/slides", [SlideController::class, "store"])->name("folders.slide.store");
        Route::patch("/folders/{folder}/slides/reorder", [SlideController::class, "reorder"])->name("folders.slides.reorder");
        Route::delete("/folders/{folder}/slides/{slide}", [SlideController::class, "destroy"])->name("folders.slides.destroy");

        Route::get("/folder-targets", [FolderTargetController::class, "index"])->name("folder-targets.index");
        Route::post("/folder-targets", [FolderTargetController::class, "store"])->name("folder-targets.store");
        Route::patch("/folder-targets/reorder", [FolderTargetController::class, "reorder"])->name("folder-targets.reorder");
        Route::delete("/folder-targets/{folderTarget}", [FolderTargetController::class, "destroy"])->name("folder-targets.destroy");
        
        Route::get("/users/admins", [UserController::class, "admins"])->name("users.admins");
        Route::get("/users/employees", [UserController::class, "index"])->name("users.employees");

        Route::post("/users", [UserController::class, "store"])->name("users.store");
        Route::put("/users/{user}", [UserController::class, "update"])->name("users.update");
        Route::patch("/users/{user}/toggle-status", [UserController::class, "toggleStatus"])->name("users.toggle-status");
        Route::delete("/users/{user}", [UserController::class, "destroy"])->name("users.destroy");
        Route::post("/users/{user}/reset-password", [UserController::class, "resetPassword"])->name("users.reset-password");
        
        Route::get("/extension-requests", [ExtensionRequestController::class, "extensionRequests"])->name("extension-requests.index");
        Route::patch("/extension-requests/{extensionRequests}/approve", [ExtensionRequestController::class, "approveExtension"])->name("extension-requests.approve");
        Route::patch("/extension-requests/{extensionRequests}/deny", [ExtensionRequestController::class, "denyExtension"])->name("extension-requests.deny");
    });

    Route::middleware(["role:employee", "expiry"])->prefix("orientation")->name("employee.")->group(function () {
        Route::get("/locked", fn() => inertia("Employee/AccountLocked"))->name("account-locked");
    });
});
Route::controller(EmployeeController::class)->group( function () {
    Route::get('/orientation', 'Index');
});
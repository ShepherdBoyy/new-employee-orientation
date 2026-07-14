<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\ExtensionRequestController;
use App\Http\Controllers\Admin\FolderController;
use App\Http\Controllers\Admin\JobPositionController;
use App\Http\Controllers\Admin\SlideController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Employee\EmployeeController;
use App\Http\Controllers\Employee\OrientationController;
use Illuminate\Support\Facades\Route;

Route::redirect("/", "login");

Route::middleware("guest")->group(function () {
    Route::get("/login", [AuthController::class, "showLogin"])->name("login");
    Route::post("/login", [AuthController::class, "login"])->name("login.attempt");
});

Route::controller(EmployeeController::class)->group( function () {
    Route::get('/employee', 'Index');
});

Route::middleware("auth")->group(function () {
    Route::get("/logout", [AuthController::class, "logout"])->name("logout");
    
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
        Route::delete('/destroy-multiple-jobs', [JobPositionController::class, 'destroyMultipleJobs']);

        Route::get("/all-job-positions", [JobPositionController::class, "jobAssignments"])->name("all-jobs-positions.index");
        Route::post("/assign-jobs", [JobPositionController::class, 'assignJobs']);
        Route::delete("/delete-assigned-job/{comapny_id}/{job_id}", [JobPositionController::class, 'deleteAssignedJob']);
        
        Route::get("/folders/preview-list", [FolderController::class, "previewFolderList"])->name("folders.preview-list");
        Route::get("/folders/global", [FolderController::class, "globalIndex"])->name("folders.global");
        Route::get("/folders/{company:slug}", [FolderController::class, "companyIndex"])->name("folders.company");
        Route::get("/folders/{company:slug}/job-positions/{job:slug}", [FolderController::class, "positionIndex"])->name("folders.job-position");
        
        Route::post("/folders", [FolderController::class, "store"])->name("folders.store");
        Route::put("/folders/{folder}", [FolderController::class, "update"])->name("folders.update");
        Route::patch("/folders/reorder", [FolderController::class, "reorder"])->name("folders.reorder");
        Route::patch("/folders/reorder-targets", [FolderController::class, "reorderTargets"])->name("folders.reorder-targets");
        Route::delete("/folders/{folder}", [FolderController::class, "destroy"])->name("folders.destroy");

        Route::get("/folders/{folder:slug}/preview", [SlideController::class, "previewFolder"])->name("slides.preview");
        Route::get("/folders/{folder:slug}/slides", [SlideController::class, "index"])->name("slides.index");
        Route::post("/folders/{folder}/slides", [SlideController::class, "store"])->name("slides.store");
        Route::patch("/folders/{folder}/slides/reorder", [SlideController::class, "reorder"])->name("slides.reorder");
        Route::delete("/folders/{folder}/slides/{slide}", [SlideController::class, "destroy"])->name("slides.destroy");

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
        Route::get("/", [OrientationController::class, "index"])->name("orientation");
        Route::get("/locked", fn() => inertia("Employee/AccountLocked"))->name("account-locked");
    });
});
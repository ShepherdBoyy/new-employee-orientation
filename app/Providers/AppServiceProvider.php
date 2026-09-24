<?php

namespace App\Providers;

use App\Models\Company;
use App\Models\Folder;
use App\Models\FolderKeyTopic;
use App\Models\JobPosition;
use App\Models\Slide;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::morphMap([
            "company" => Company::class,
            "folder" => Folder::class,
            "topic" => FolderKeyTopic::class,
            "slide" => Slide::class,
            "job_position" => JobPosition::class,
            "user" => User::class
        ]);
    }
}

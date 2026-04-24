<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User;
use Illuminate\Notifications\Notifiable;

class Administrator extends User
{
    use HasApiTokens, Notifiable;

    protected $table = "administrators";
    protected $fillable = ['username','password']; 

}

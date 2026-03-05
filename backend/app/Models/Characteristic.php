<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Characteristic extends Model
{
    protected $table = "characteristics";
    protected $fillable = ['name','type'];

}

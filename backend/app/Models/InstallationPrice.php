<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstallationPrice extends Model
{
    protected $table = "installation_prices";
    protected $fillable = ['city','postal_code','price'];

}

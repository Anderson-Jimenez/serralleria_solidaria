<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CharacteristicType extends Model
{
    protected $table = "characteristic_types";
    protected $fillable = ['type','status'];

    public function characteristic(){
        return $this->hasMany(Characteristic::class);
    }
}

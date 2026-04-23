<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CharacteristicType extends Model
{
    protected $table = "characteristic_types";
    protected $fillable = ['type','status','filterType'];

    public function characteristics(){
        return $this->hasMany(Characteristic::class, 'characteristic_types_id');
    }
}

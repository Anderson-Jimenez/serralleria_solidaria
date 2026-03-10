<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Characteristic extends Model
{
    protected $table = "characteristics";
    protected $fillable = ['description','characteristic_type_id'];

    public function characteristicType(){
        return $this->belongsTo(CharacteristicType::class);
    }

}

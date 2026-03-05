<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactImg extends Model
{
    protected $table = "contact_img";
    protected $fillable = ['product_id','path','is_primary'];


    public function product(){
        return $this->belongsTo(Product::class);
    }
}

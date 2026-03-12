<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductInPack extends Model
{
    protected $table = "product_in_pack";
    protected $fillable = ['product_pack','product_id'];

    public function product_pack(){
        return $this->belongsTo(Product::class, 'product_pack');
    }

    public function product(){
        return $this->belongsTo(Product::class, 'product_id');
    }

}

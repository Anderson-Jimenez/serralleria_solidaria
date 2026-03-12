<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = "products";
    protected $fillable = ['code','name','description','price','stock','discount','highlighted','category_id','product_type','status'];

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function pack(){
        return $this->hasMany(ProductInPack::class, 'product_pack');
    }

    public function product(){
        return $this->belongsToMany(ProductInPack::class, 'product_id');
    }
}

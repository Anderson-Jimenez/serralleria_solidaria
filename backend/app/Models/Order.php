<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = "orders";
    protected $fillable = ['user_id', 'status', 'total_price', 'observations'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_products', 'order_id', 'product_id')
            ->using(OrderProduct::class)
            ->withPivot('quantity', 'unit_price', 'subtotal');
    }

    public function detail()
    {
        return $this->hasOne(OrderDetail::class);
    }
}

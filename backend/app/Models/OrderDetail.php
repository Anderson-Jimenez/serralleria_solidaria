<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $table = "order_details";
    protected $fillable = ['order_id','requested_delivery_date','installation','installation_address','installation_price','shipping_address','billing_address','observations'];

    public function order(){
        return $this->belongsTo(Order::class);
    }
}
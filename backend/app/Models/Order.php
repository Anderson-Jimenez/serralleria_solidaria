<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = "orders";
    protected $fillable = ['user_id','status','total_price','observations'];


    public function user(){
        return $this->belongsTo(User::class);
    }
    public function products()
    {
        return $this->hasMany(OrderProduct::class);
    }

    public function detail()
    {
        return $this->hasOne(OrderDetail::class);
    }
}

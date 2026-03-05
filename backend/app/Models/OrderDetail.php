<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $table = "order_details";
    protected $fillable = ['order_id','delivery_date','installation','installation_address','installation_price_id'];


    public function order(){
        return $this->belongsTo(Order::class);
    }

    public function installationPrice(){
        return $this->belongsTo(InstallationPrice::class);
    }
}

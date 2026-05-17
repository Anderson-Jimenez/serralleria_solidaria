<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    protected $table = "products";

    protected $fillable = [
        'code',
        'name',
        'description',
        'price',
        'stock',
        'discount_percentage',
        'discount_starts_at',
        'discount_ends_at',
        'highlighted',
        'category_id',
        'product_type',
        'int_size',
        'ext_size',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'highlighted' => 'boolean',
        'status' => 'boolean',
        'discount_starts_at' => 'datetime',
        'discount_ends_at' => 'datetime',
    ];

    // ------------RELACIONES------------- //

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function characteristics()
    {
        return $this->hasMany(ProductCharacteristic::class, 'product_id');
    }

    public function packItems()
    {
        return $this->hasMany(ProductInPack::class, 'product_pack');
    }

    public function packsContaining()
    {
        return $this->hasMany(ProductInPack::class, 'product_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImg::class, 'product_id');
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImg::class, 'product_id')->where('is_primary', 1);
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_products', 'product_id', 'order_id')
            ->using(OrderProduct::class)
            ->withPivot('quantity', 'unit_price', 'subtotal');
    }
}
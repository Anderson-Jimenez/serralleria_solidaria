<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactForm extends Model
{
    protected $table = "contact_forms";
    protected $fillable = ['user_id','user_email','user_phone','user_issue','message'];


    public function user(){
        return $this->belongsTo(User::class);
    }
    public function images()
    {
        return $this->hasMany(ContactImg::class, 'contact_form_id');
    }
}

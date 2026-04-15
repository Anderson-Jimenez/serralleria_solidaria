<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactImg extends Model
{
    protected $table = "contact_img";
    protected $fillable = ['contact_form_id', 'path'];


    public function contactForm(){
        return $this->belongsTo(ContactForm::class);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\ContactForm;
use App\Models\ContactImg;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_email'   => 'required|email|max:255',
            'user_phone'   => 'nullable|string|max:20',
            'user_issue'   => 'required|string|max:255',
            'message'      => 'required|string',
            'images.*'     => 'nullable|image|max:2048',
        ]);
        $userId = auth()->id();
        $contact = ContactForm::create([
            'user_id'     => $userId,
            'user_email'  => $validated['user_email'],
            'user_phone'  => $validated['user_phone'],
            'user_issue'  => $validated['user_issue'],
            'message'     => $validated['message'],
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            $emailClean = preg_replace('/[^a-z0-9]/i', '_', $validated['user_email']);
            $timestamp = time();
            
            foreach ($request->file('images') as $index => $img) {
                $extension = $img->getClientOriginalExtension();
                $nombre = $emailClean . '_' . $timestamp . '_' . $index . '.' . $extension;
                $path = $img->storeAs('contact', $nombre, 'public');
                
                ContactImg::create([
                    'contact_form_id' => $contact->id,
                    'path'            => $path,
                ]);
                
                $imagePaths[] = $path;
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Sol·licitud enviada correctament',
            'data'    => $contact->load('images'),
            'images'  => $imagePaths,
        ], 201);
    }
    

    /**
     * Display the specified resource.
     */
    public function showPetitions(string $id)
    {
        $peticions = ContactForm::with('images')->find($id)->orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data'    => $peticions,
        ]);
    }
    public function showEspecificPetition(string $id)
    {
        $peticions = ContactForm::with('images')->find($id)->orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data'    => $peticions,
        ]);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

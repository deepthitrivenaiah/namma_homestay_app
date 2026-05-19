package com.nammahomestay.app.ui

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.github.dhaval2404.imagepicker.ImagePicker
import com.google.firebase.firestore.FirebaseFirestore
import com.nammahomestay.app.databinding.ActivityHomeProfileBinding

class HomeProfileActivity : AppCompatActivity() {

    private lateinit var binding: ActivityHomeProfileBinding
    private val db = FirebaseFirestore.getInstance()
    private var currentImageUrl: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupImagePickers()
        
        binding.btnSaveProfile.setOnClickListener {
            saveProfileData()
        }
    }

    private fun setupImagePickers() {
        binding.btnUploadRoom.setOnClickListener {
            ImagePicker.with(this)
                .crop()
                .compress(1024)
                .maxResultSize(1080, 1080)
                .start { resultCode, data ->
                    // In a real app, upload this to Firebase Storage first
                    // For this demo, we'll use a placeholder
                    if (resultCode == RESULT_OK) {
                        currentImageUrl = "https://images.unsplash.com/photo-1542718610-a1d656d1884c"
                        Toast.makeText(this, "Photo Selected", Toast.LENGTH_SHORT).show()
                    }
                }
        }
        // Similar for other buttons...
    }

    private fun saveProfileData() {
        val name = binding.etName.text.toString()
        val location = binding.etLocation.text.toString()
        val price = binding.etPrice.text.toString()
        val contact = binding.etContact.text.toString()

        if (name.isEmpty() || location.isEmpty() || price.isEmpty() || contact.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            return
        }

        val checklist = mutableListOf<String>()
        if (binding.cbCleanRooms.isChecked) checklist.add("Clean Rooms")
        if (binding.cbHotWater.isChecked) checklist.add("Hot Water")
        if (binding.cbSafety.isChecked) checklist.add("Guest Safety")

        val homestay = hashMapOf(
            "name" to name,
            "location" to location,
            "price" to price,
            "contact" to contact,
            "imageUrl" to currentImageUrl,
            "verificationChecklist" to checklist,
            "ownerId" to "sample_owner_id"
        )

        db.collection("homestays").add(homestay)
            .addOnSuccessListener {
                Toast.makeText(this, "Profile Saved Successfully!", Toast.LENGTH_SHORT).show()
                finish()
            }
            .addOnFailureListener {
                Toast.makeText(this, "Failed to save profile", Toast.LENGTH_SHORT).show()
            }
    }
}

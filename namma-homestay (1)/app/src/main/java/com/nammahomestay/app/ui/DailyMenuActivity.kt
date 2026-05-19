package com.nammahomestay.app.ui

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.Timestamp
import com.google.firebase.firestore.FirebaseFirestore
import com.nammahomestay.app.databinding.ActivityDailyMenuBinding

class DailyMenuActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDailyMenuBinding
    private val db = FirebaseFirestore.getInstance()
    private val homestayId = "sample_homestay_id"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDailyMenuBinding.inflate(layoutInflater)
        setContentView(binding.root)

        listenForMenuUpdates()
        
        binding.btnSaveMenu.setOnClickListener {
            updateMenu()
        }
    }

    private fun listenForMenuUpdates() {
        db.collection("menus").document(homestayId)
            .addSnapshotListener { snapshot, e ->
                if (e != null) return@addSnapshotListener
                if (snapshot != null && snapshot.exists()) {
                    val items = snapshot.getString("items")
                    binding.tvCurrentMenu.text = "Live Preview:\n$items"
                }
            }
    }

    private fun updateMenu() {
        val menuItems = binding.etMenuItems.text.toString()
        if (menuItems.isEmpty()) {
            Toast.makeText(this, "Enter menu items", Toast.LENGTH_SHORT).show()
            return
        }

        val menuData = hashMapOf(
            "items" to menuItems,
            "updatedAt" to Timestamp.now()
        )

        db.collection("menus").document(homestayId).set(menuData)
            .addOnSuccessListener {
                Toast.makeText(this, "Menu Updated!", Toast.LENGTH_SHORT).show()
            }
    }
}

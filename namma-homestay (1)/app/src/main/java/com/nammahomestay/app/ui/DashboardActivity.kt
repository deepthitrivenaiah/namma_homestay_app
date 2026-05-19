package com.nammahomestay.app.ui

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.firebase.firestore.FirebaseFirestore
import com.nammahomestay.app.adapters.HomeStayAdapter
import com.nammahomestay.app.databinding.ActivityDashboardBinding
import com.nammahomestay.app.models.HomeStay

class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding
    private lateinit var adapter: HomeStayAdapter
    private val db = FirebaseFirestore.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupRecyclerView()
        fetchHomeStays()

        binding.fabProfile.setOnClickListener {
            startActivity(Intent(this, HomeProfileActivity::class.java))
        }
    }

    private fun setupRecyclerView() {
        adapter = HomeStayAdapter(emptyList())
        binding.rvHomeStays.layoutManager = LinearLayoutManager(this)
        binding.rvHomeStays.adapter = adapter
    }

    private fun fetchHomeStays() {
        db.collection("homestays")
            .addSnapshotListener { value, error ->
                if (error != null) {
                    Toast.makeText(this, "Error fetching data", Toast.LENGTH_SHORT).show()
                    return@addSnapshotListener
                }

                val list = mutableListOf<HomeStay>()
                for (doc in value!!) {
                    val homestay = doc.toObject(HomeStay::class.java)
                    homestay.id = doc.id
                    list.add(homestay)
                }
                adapter.updateData(list)
            }
    }
}

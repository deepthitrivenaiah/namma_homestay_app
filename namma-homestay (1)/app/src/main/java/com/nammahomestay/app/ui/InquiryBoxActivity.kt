package com.nammahomestay.app.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.nammahomestay.app.databinding.ActivityInquiryBoxBinding

class InquiryBoxActivity : AppCompatActivity() {

    private lateinit var binding: ActivityInquiryBoxBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityInquiryBoxBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnCall.setOnClickListener {
            val intent = Intent(Intent.ACTION_DIAL)
            intent.data = Uri.parse("tel:9876543210")
            startActivity(intent)
        }

        binding.btnWhatsApp.setOnClickListener {
            try {
                val url = "https://api.whatsapp.com/send?phone=919876543210&text=Hello! I'm interested in your homestay."
                val i = Intent(Intent.ACTION_VIEW)
                i.data = Uri.parse(url)
                startActivity(i)
            } catch (e: Exception) {
                Toast.makeText(this, "WhatsApp not installed", Toast.LENGTH_SHORT).show()
            }
        }
    }
}

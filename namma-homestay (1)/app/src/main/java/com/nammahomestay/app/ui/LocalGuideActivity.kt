package com.nammahomestay.app.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.nammahomestay.app.databinding.ActivityLocalGuideBinding

class LocalGuideActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLocalGuideBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLocalGuideBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // This would initialize a RecyclerView with GuideAdapter
        // and fetch guide data from Firestore collection "guides"
    }
}

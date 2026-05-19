package com.nammahomestay.app.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Simple splash logic: redirect to Dashboard
        startActivity(Intent(this, DashboardActivity::class.java))
        finish()
    }
}

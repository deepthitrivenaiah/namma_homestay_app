package com.nammahomestay.app.models

import com.google.firebase.Timestamp

data class HomeStay(
    var id: String = "",
    val name: String = "",
    val location: String = "",
    val price: String = "",
    val contact: String = "",
    val imageUrl: String = "",
    val verificationChecklist: List<String> = emptyList(),
    val ownerId: String = "",
    val currentMenu: String = "Loading menu..."
)

data class Menu(
    val homestayId: String = "",
    val items: String = "",
    val updatedAt: Timestamp = Timestamp.now()
)

data class Inquiry(
    val homestayId: String = "",
    val travelerName: String = "",
    val message: String = "",
    val timestamp: Timestamp = Timestamp.now()
)

data class Guide(
    val title: String = "",
    val category: String = "",
    val description: String = "",
    val imageUrl: String = ""
)

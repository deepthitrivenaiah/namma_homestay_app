package com.nammahomestay.model

data class HomeStay(
    val id: String = "",
    val hostId: String = "",
    val title: String = "",
    val description: String = "",
    val pricePerNight: Double = 0.0,
    val location: String = "",
    val roomPhotos: List<String> = emptyList(),
    val surroundingPhotos: List<String> = emptyList(),
    val foodMenu: List<MenuItem> = emptyList()
)

data class MenuItem(
    val itemName: String = "",
    val description: String = ""
)

data class Host(
    val uid: String = "",
    val name: String = "",
    val email: String = "",
    val phoneNumber: String = "",
    val location: String = ""
)

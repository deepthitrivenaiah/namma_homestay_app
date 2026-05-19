package com.nammahomestay.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.nammahomestay.model.HomeStay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class HomeStayViewModel : ViewModel() {
    private val db = Firebase.firestore
    private val auth = Firebase.auth

    private val _listings = MutableStateFlow<List<HomeStay>>(emptyList())
    val listings: StateFlow<List<HomeStay>> = _listings

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    fun fetchListings() {
        val userId = auth.currentUser?.uid ?: return
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val snapshot = db.collection("homestays")
                    .whereEqualTo("hostId", userId)
                    .get()
                    .await()
                _listings.value = snapshot.toObjects(HomeStay::class.java)
            } catch (e: Exception) {
                // Handle error
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun addListing(listing: HomeStay) {
        viewModelScope.launch {
            try {
                db.collection("homestays").add(listing).await()
                fetchListings()
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
}

package com.nammahomestay.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.nammahomestay.viewmodel.HomeStayViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(navController: NavController, viewModel: HomeStayViewModel = viewModel()) {
    val listings by viewModel.listings.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.fetchListings()
    }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("My HomeStays") })
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { navController.navigate("add_listing") }) {
                Icon(Icons.Default.Add, contentDescription = "Add")
            }
        }
    ) { padding ->
        if (isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = androidx.compose.ui.Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
            ) {
                items(listings) { listing ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(8.dp),
                        onClick = { navController.navigate("listing_details/${listing.id}") }
                    ) {
                        Column(Modifier.padding(16.dp)) {
                            Text(text = listing.title, style = MaterialTheme.typography.titleLarge)
                            Text(text = "₹${listing.pricePerNight}/night", style = MaterialTheme.typography.bodyMedium)
                            Text(text = listing.location, style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }
        }
    }
}

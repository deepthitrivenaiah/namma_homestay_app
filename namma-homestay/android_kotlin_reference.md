# Android Studio - Kotlin Reference Guide
## Namma HomeStay: Rural Host Portal

This guide provides the Kotlin/Jetpack Compose code equivalent for the React app built in the preview. Use this in Android Studio to create a native Android application.

### 1. Data Models (Homestay.kt)
```kotlin
data class Homestay(
    val id: String = "",
    val hostId: String = "",
    val name: String = "",
    val description: String = "",
    val address: String = "",
    val pricePerNight: Int = 0,
    val photos: List<String> = emptyList(),
    val menuToday: String = "",
    val verification: Map<String, Boolean> = emptyMap()
)
```

### 2. UI Component: HomeStay Card (HomeStayCard.kt)
```kotlin
@Composable
fun HomestayCard(homestay: Homestay, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column {
            // Placeholder for image
            Box(modifier = Modifier.height(200.dp).fillMaxWidth().background(Color(0xFF5A5A40).copy(alpha = 0.1f)))
            
            Column(modifier = Modifier.padding(16.dp)) {
                Text(text = homestay.name, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Text(text = homestay.address, color = Color.Gray, style = MaterialTheme.typography.bodySmall)
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = "₹${homestay.pricePerNight} / day", fontWeight = FontWeight.Bold)
            }
        }
    }
}
```

### 3. Today's Menu Update Screen (MenuUpdate.kt)
```kotlin
@Composable
fun MenuUpdateScreen(onUpdate: (String, Int) -> Unit) {
    var dishName by remember { mutableStateOf("") }
    var price by remember { mutableStateOf("") }

    Column(modifier = Modifier.padding(24.dp)) {
        Text("Today's Special Menu", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(16.dp))
        
        OutlinedTextField(
            value = dishName,
            onValueChange = { dishName = it },
            label = { Text("What is for dinner?") },
            modifier = Modifier.fillMaxWidth()
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        OutlinedTextField(
            value = price,
            onValueChange = { price = it },
            label = { Text("Price per plate") },
            modifier = Modifier.fillMaxWidth()
        )
        
        Button(
            onClick = { onUpdate(dishName, price.toIntOrNull() ?: 0) },
            modifier = Modifier.fillMaxWidth().padding(top = 16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF5A5A40))
        ) {
            Text("Update Today's Menu")
        }
    }
}
```

### 4. Firebase Setup
Add these to your `build.gradle.kts`:
```kotlin
implementation("com.google.firebase:firebase-firestore-ktx:24.4.1")
implementation("com.google.firebase:firebase-auth-ktx:21.1.0")
```

### Why we are using Web for now?
*   **Zero Install:** Farmers can open the link directly.
*   **Instant Updates:** Changed security rules or features update for everyone instantly.
*   **Cost:** No Google Play Store developer fees for rural families.

package com.nammahomestay.utils

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.Composable

@Composable
fun rememberImagePicker(onImagePicked: (Uri) -> Unit) = rememberLauncherForActivityResult(
    contract = ActivityResultContracts.PickVisualMedia(),
    onResult = { uri ->
        uri?.let { onImagePicked(it) }
    }
)

@Composable
fun rememberMultipleImagePicker(onImagesPicked: (List<Uri>) -> Unit) = rememberLauncherForActivityResult(
    contract = ActivityResultContracts.PickMultipleVisualMedia(),
    onResult = { uris ->
        onImagesPicked(uris)
    }
)

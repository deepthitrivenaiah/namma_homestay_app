package com.nammahomestay.app.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.nammahomestay.app.databinding.ItemHomestayBinding
import com.nammahomestay.app.models.HomeStay

class HomeStayAdapter(private var homestays: List<HomeStay>) :
    RecyclerView.Adapter<HomeStayAdapter.ViewHolder>() {

    class ViewHolder(val binding: ItemHomestayBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemHomestayBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val homestay = homestays[position]
        holder.binding.tvName.text = homestay.name
        holder.binding.tvLocation.text = homestay.location
        holder.binding.tvPrice.text = "₹${homestay.price} per day"
        holder.binding.tvMenuToday.text = "Today's Menu: ${homestay.currentMenu}"

        Glide.with(holder.itemView.context)
            .load(homestay.imageUrl)
            .placeholder(android.R.drawable.ic_menu_report_image)
            .into(holder.binding.ivHomeStay)
    }

    override fun getItemCount() = homestays.size

    fun updateData(newList: List<HomeStay>) {
        homestays = newList
        notifyDataSetChanged()
    }
}

package vn.skylab.trackinglocation

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.util.Log
import android.widget.Toast

import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import io.socket.client.IO
import org.json.JSONObject
import com.google.android.gms.maps.model.Marker
import android.os.Looper
import org.json.JSONException
import android.graphics.Bitmap
import android.provider.MediaStore.Images.Media.getBitmap
import android.graphics.drawable.BitmapDrawable







class MapsActivity : AppCompatActivity(), OnMapReadyCallback {

    //connect socket
    val socket = IO.socket("http://trackinglocation.skylab.vn")

    private lateinit var mMap: GoogleMap

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_maps)
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        val mapFragment = supportFragmentManager
                .findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)
    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    override fun onMapReady(googleMap: GoogleMap) {

        val height = 150
        val width = 150
        val bitmapScale = resources.getDrawable(R.drawable.ic_truck) as BitmapDrawable
        val b = bitmapScale.bitmap
        val smallMarker = Bitmap.createScaledBitmap(b, width, height, false)

        //create hashmap marker
        val markers: HashMap<String, Marker> = HashMap()

        mMap = googleMap

        //set up marker
        val marker = MarkerOptions()

        //set marker icon
        marker.icon(BitmapDescriptorFactory.fromBitmap(smallMarker))

        marker.anchor(0.5f, 0.5f)

        //init position
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(LatLng(10.7878874, 106.6770089), 13f))

        //on socket + parse
        socket.on("locationUpdated", {
            args ->
            val obj = args[0] as JSONObject
            val iter = obj.keys()
            while (iter.hasNext()) {
                val key = iter.next()
                try {
                    val pos = obj.getJSONObject(key)

                    //Main thread
                    Handler(Looper.getMainLooper()).post {
                        if (markers[key]==null) {
                            markers[key] = mMap.addMarker(marker.position(LatLng(pos.getDouble("lat"), pos.getDouble("lng"))))
                        } else {
                            markers[key]!!.position = LatLng(pos.getDouble("lat"), pos.getDouble("lng"))
                        }
                    }
                } catch (e: JSONException) {
                    // Something went wrong!
                }
            }
        })

        socket.connect()
    }
}

import axios from "axios"

//image upload api
export const uploadImage = async image => {
        const formData = new FormData()
    formData.append('image', image)

    //upload image to imgbb and get the image url
      const {data } = await axios.post ( `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, 
        formData
      )
        return data.data.display_url
}   

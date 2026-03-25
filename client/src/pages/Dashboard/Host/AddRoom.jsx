import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import { uploadImage } from "../../../api/utils";
import { da } from "date-fns/locale";
import { set } from "date-fns";


const AddRoom = () => {
    const {auth} = useAuth()
    const [imagePreview, setImagePreview] = useState()
    const [imageText, setImageText] = useState('Select Image')
    const [dates, setDates] = useState(
        {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
    )
    const handleDates = item =>{
        // console.log(item);
    setDates(item.selection)
    }

    const handleImage = image =>{
        setImagePreview(URL.createObjectURL(image))
        setImageText(image.name)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const form = e.target
        const location = form.location.value
        const category = form.category.value
        const title = form.title.value
        const to = dates.endDate
        const from = dates.startDate
        const price = form.price.value
        const guests = form.guest.value
        const bathrooms = form.bathrooms.value
        const description = form.description.value
        const bedrooms = form.bedrooms.value
        const image = form.image.files[0]
        const host = {
            name: auth?.displayName,
            email: auth?.email,
            image: auth?.photoURL
        }
        try{
            const image_url = await uploadImage(image)
            const roomData = {
                location, 
                category, 
                title, 
                to, 
                from, 
                price, 
                guests, 
                bathrooms, 
                description, 
                bedrooms, 
                image:image_url, 
                host
            }
            console.table(roomData);
        }catch(err){
            console.log(err);
        }


        
    }
    return (
        <div>
           <p>Add Room Page ... </p>
            <AddRoomForm dates={dates} handleDates={handleDates} handleSubmit={handleSubmit}  setImagePreview={setImagePreview} setImageText={setImageText} imagePreview={imagePreview} handleImage={handleImage} imageText={imageText}/>
        </div>
    );
}

export default AddRoom;
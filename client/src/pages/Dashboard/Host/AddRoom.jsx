import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import { uploadImage } from "../../../api/utils";
import { da } from "date-fns/locale";
import { set } from "date-fns";
import { Helmet } from 'react-helmet-async'
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const AddRoom = () => {
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()
    const {auth} = useAuth()
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState()
    const [imageText, setImageText] = useState('Select Image')
    const [dates, setDates] = useState(
        {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
    )
    const handleDates = item =>{
        // console.log(item);
    setDates(item.selection)
    }

    const {mutateAsync} = useMutation({
        mutationFn: async roomData =>{
            const {data} = await axiosSecure.post('/room', roomData)
            return data
        },
        onSuccess: ()=>{
            setLoading(false)
            toast.success('Room added successfully');
            navigate('/dashboard/my-listings');
        },
        onError: err =>{
            setLoading(false)
            toast.error('Failed to add room');
        }
    })
    const handleImage = image =>{
        setImagePreview(URL.createObjectURL(image))
        setImageText(image.name)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
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
            // Send roomData to backend and save in database Post request to server
            await mutateAsync(roomData)
            
            form.reset()
            setImagePreview(null)
            setImageText('Select Image')
        }catch(err){
            setLoading(false)
            toast.error(err.message || 'Failed to add room');
            // console.log(err);
        }


        
    }
    return (
        <>
        <Helmet>
            <title>Add Room | Dashboard</title>
        </Helmet>
           
            <AddRoomForm dates={dates} handleDates={handleDates} handleSubmit={handleSubmit}  setImagePreview={setImagePreview} setImageText={setImageText} imagePreview={imagePreview} handleImage={handleImage} imageText={imageText} loading={loading}/>
        </>
    );
}

export default AddRoom;
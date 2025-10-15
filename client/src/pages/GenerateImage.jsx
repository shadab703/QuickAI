import { Hash, Image, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const GenerateImage = () => {
    const imageStyle = [
        'Realistic', 'Ghibli', 'Anime Style', 'Cartoon Style', 'Fantasy Style', 'Realistic Style', '3D Style', 'Portrait Style'

    ]
    const [selectedStyle, setSelectedStyle] = useState('Realistic')
    const [input, setInput] = useState("")
    const [publish, setPublish] = useState(false);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');

    const { getToken } = useAuth();

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const prompt = `Generate an image of ${input} in the style  ${selectedStyle}`
            const { data } = await axios.post("/api/ai/generate-image", { prompt, publish }, { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setContent(data.content)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false)
    }
    return (
        <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
            {/* -------------Left Column ---------- */}
            <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
                <div className='flex items-center gap-3'>
                    <Sparkles className='w-6 text-[#00AD25]' />
                    <h2 className='text-xl font-semibold'>AI Image Generator</h2>
                </div>
                <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
                <textarea onChange={(e) => setInput(e.target.value)} value={input} rows={4} className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='Describe what you want to see in the Image....' required />
                <p className='mt-6 text-sm font-medium'>Style</p>
                <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
                    {imageStyle.map((item) => (
                        <span onClick={() => setSelectedStyle(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item ? "bg-green-50 text-green-700" : "text-gray-500 border-gray-300"}`} key={item}>{item}</span>
                    ))}
                </div>
                <div className='flex items-center gap-2 my-6'>
                    <label className='relative cursor-pointer'>
                        <input type="checkbox" onChange={(e) => setPublish(e.target.checked)} checked={publish} className='sr-only peer' />
                        <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
                        <span className='absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
                    </label>
                    <p className='text-sm'>Make This Image Public</p>
                </div>

                <button disabled={loading} className='flex w-full justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
                    {
                        loading ?
                            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
                            : <Image className='w-5' />
                    }
                    Generate Image
                </button>
            </form>

            {/* ----------- Right Column -------------- */}
            <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
                <div className='flex items-center gap-3'>
                    <Image className='w-5 h-5 text-[#00AD25]' />
                    <h1 className='text-xl font-semibold'>Generated Image</h1>
                </div>
                {!content ? (
                    <div className='flex flex-1 justify-center items-center'>
                        <div className='flex flex-col text-sm items-center gap-5 text-gray-400'>
                            <Image className='w-5 h-5' />
                            <p>Enter a Topic and click <span className='text-gray-700'>Generate Image</span> to get start</p>
                        </div>
                    </div>
                ) : (
                    <div className='mt-3 h-full'>
                        <img src={content} alt="image" className='w-full h-full' />
                    </div>
                )}
            </div>
        </div>
    )
}

export default GenerateImage
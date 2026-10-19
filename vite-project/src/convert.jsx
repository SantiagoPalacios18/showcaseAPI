const convertImage = (image, setLoading) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadstart = ()=>setLoading(true)
        reader.onload = ()=>resolve(reader.result)
        reader.onerror = (error)=>reject(error)
        reader.onloadend = ()=>setLoading(false)
        reader.readAsDataURL(image)
    })
}

export default convertImage
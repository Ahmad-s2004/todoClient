import React, { createContext, useState } from 'react'

let CatContext = createContext()
export const CategoryContext = ({children}) =>{
    const [cat, setCat] = useState(true)
    const [fetch, setFetch] = useState(false)
    return (
        <CatContext.Provider value={{ cat, setCat, fetch, setFetch }}>
            {children}
        </CatContext.Provider>
    )
}

export default CatContext
import React, { useEffect, useState } from 'react';
import './AddProduct.css';

function AddProduct({ message, image, duration = 5000 }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(0);
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer);
                    return 100;
                }
                return Math.min(oldProgress + 2, 100);
            });
        }, duration / 50);

        return () => {
            clearInterval(timer);
        };
    }, [duration, message, image]);

    return (
        <div className='addproduct'>
            <img
                className='addproduct_image'
                src={image}
                alt=''
            />
            <p>{message}</p>
            <div className="progress-bar">
                <div className="progress" style={{width: `${progress}%`}}></div>
            </div>
        </div>
    );
}

export default AddProduct;
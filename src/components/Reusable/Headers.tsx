import React from 'react';

const Headers = ({title, subHeader}) => {
    return (
        <div className=''>
            <div className='mb-8'>
                <h3 className="popmed text-[24px] text-gray-800 mb-2">{title}</h3>
                <p className="popreg text-[16px] text-[#737373]">{subHeader}</p>
            </div>
        </div>
    );
};

export default Headers;
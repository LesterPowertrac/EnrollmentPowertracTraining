import React from 'react'

const Card = ({ title, description, icon: Icon, descriptionClass, titleStyle, cardStyle }) => {
  return (
    <div className={` ${cardStyle} bg-white p-5 rounded-2xl shadow-md flex items-center gap-4 border border-gray-200 hover:shadow-lg transition `}>
      {Icon && <Icon className="text-4xl text-blue-500" />}
      <div>
        <h3 className={`${titleStyle}`}>{title}</h3>
        <p className={`${descriptionClass}`}>{description}</p>
      </div>
    </div>
  )
}

export default Card
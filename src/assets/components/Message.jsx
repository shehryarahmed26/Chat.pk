import React from 'react'
import Avatar from 'react-avatar'


const Message = ({user, text}) => {
  return (
     
    <div className={` flex items-center gap-2 ${user === 'me' ? 'justify-end' : ''}`}>
        {/* <Avatar name='s' round={true} size="40" />  */}
          <h2 className={`text-end text-white -order-1 ${user === 'me' ? 'bg-green-700' : 'bg-gray-500'} w-fit my-2  py-1 mr-3 float-end px-2 rounded`}>{text}</h2 >
          </div>
         
          
  )
}

export default Message
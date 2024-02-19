import React, { useEffect, useState } from "react";
import { ListingType } from "../pages/Listing";
import { Link } from "react-router-dom";

type landlordType = {
    username: string;
    email: string;
    };


const Contact = ({ listing }: { listing: ListingType }) => {
  const [landlord, setLandlord] = useState<landlordType | null>(null);
  const [message, setMessage] = useState('');
  
  const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };


  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        console.log(data)
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows={2}
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;

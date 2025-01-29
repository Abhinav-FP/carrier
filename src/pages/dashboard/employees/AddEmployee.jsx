import React, { useContext, useState } from 'react'
import Popup from '../../common/Popup'
import toast from 'react-hot-toast';
import Api from '../../../api/Api';
import { UserContext } from '../../../context/AuthProvider';
import countries from './../../common/Countries';

export default function AddEmployee({fetchLists}){


  console.log("countries",countries)
  const commisions = Array.from({ length: 100 }, (_, index) => (index + 1) * 5);
  const [staffType, setStaffType] = useState(1);
  const [data, setData] = useState({
      name: "",
      email: "",
      password: "",
      country: "",
      phone: "",
      address: "",
      role: staffType,
      staff_commision: "",
    });
    const [action, setaction] = useState();
    const {Errors} = useContext(UserContext);

    const handleinput = (e) => {
      setData({ ...data, [e.target.name]: e.target.value});
    }
    const [loading, setLoading] = useState(false);

    const addEmployee = () => {
      if(data.email === "" || data.password === "" || data.name === "" || data.role === "" || data.staff_commision === "" || data.phone === "" || data.country === "" || data.address === ""){
        toast.error("Please fill all the fields");
        return false;
      }
      setLoading(true);
      const resp = Api.post(`/user/create_user`, {...data, generateAutoPassword: data.password ? 0 : 1});
      resp.then((res) => {
        setLoading(false);
        if (res.data.status === true) {
          toast.success(res.data.message);
          fetchLists && fetchLists();
          setaction('close');
          setTimeout(() => {
            setaction();
          }, 1000);
        } else {
          toast.error(res.data.message);
        }
      }).catch((err) => {
        setLoading(false);
        Errors(err);
      });
    }

  return (
    <div>
      <Popup action={action} size="md:max-w-2xl" space='p-8' bg="bg-black" btnclasses="" btntext={"Add New Employee"} >
         <h2 className='text-white font-bold'>Add New Employee</h2>
         <div className='grid grid-cols-2 gap-4'>
            <div className='input-item'>
               <label className="mt-4 mb-0 block text-sm text-gray-400">Name</label>
               <input required name='name' onChange={handleinput} type={'text'} placeholder={"Name"} className="input-sm" />
            </div>
            <div className='input-item'>
               <label className="mt-4 mb-0 block text-sm text-gray-400">Email</label>
               <input required name='email' onChange={handleinput} type={'email'} placeholder={"Email address"} className="input-sm" />
            </div>
            <div className='input-item'>
               <label className="mt-4 mb-0 block text-sm text-gray-400">Staff Commission</label>
               <select  onChange={handleinput} name='staff_commision' className="input-sm" >
                <option selected disabled className='text-black'>Choose Commision</option>
                  {commisions && commisions.map((c, i)=>{
                    return <option value={c} className='text-black'>{c}% Commision</option>
                  })}
               </select>
            </div>
            <div className='input-item'>
               <label className="mt-4 mb-0 block text-sm text-gray-400">Country</label>
               <select onChange={handleinput} name='country' className="input-sm" >
                <option selected disabled className='text-black'>Choose Country</option>
                  {countries && countries.map((c, i)=>{
                    return <option value={c.label} className='text-black'>{c.label}</option>
                  })}
               </select>
            </div> 

            <div className='input-item'>
               <label className="mt-4 mb-0 block text-sm text-gray-400">Phone</label>
               <input required name='phone' onChange={handleinput} type={'phone'} placeholder={"Phone Number"} className="input-sm" />
            </div>
            <div className='input-item'>
               <label className="mt-4 mb-0 block text-sm text-gray-400">Password</label>
               <input required name='password' onChange={handleinput} type={'text'} placeholder={"Enter password"} className="input-sm" />
            </div>
         </div>
          <div className='input-item mb-4 '>
              <label className="mt-4 mb-0 block text-sm text-gray-400">Address</label>
              <input required name='address' onChange={handleinput} type={'address'} placeholder={"Enter address"} className="input-sm" />
          </div>

          <label className=" mb-2 block text-sm text-gray-400 text-center mt-6">Staff Type</label>
         <div className='flex justify-center'>
              <button className={`mx-2 ${staffType === 1 ? 'bg-main text-black' : 'bg-gray-300'} rounded-[20px] min-w-[120px] !text-[15px] text-center px-3 py-2`} onClick={(e)=>setStaffType(1)} >Staff</button>
              <button className={`mx-2 ${staffType === 2 ? 'bg-main text-black' : 'bg-gray-300'} rounded-[20px] min-w-[120px] !text-[15px] text-center px-3 py-2`} onClick={(e)=>setStaffType(2)} >Accountant</button>
         </div>
         <div className='flex justify-center items-center'>
            <button  onClick={addEmployee} className="btn md mt-6 px-[50px] main-btn text-black font-bold">{loading ? "Creating..." : "Create Account"}</button>
         </div>
      </Popup>
    </div>
  )
}

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/features/userSlice";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { ListingType } from "./Listing";
import { useCookies } from "react-cookie";

// type formDataType = {
//   username: string;
//   email: string;
//   password: string | null;
//   avatar: string;
// };

const Profile = () => {
  const { currentUser, loading, error } = useSelector(
    (store: RootState) => store.user
  );

  const [file, setFile] = useState<File | undefined>(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username,
    email: currentUser?.email,
    password: null,
    avatar: currentUser?.avatar,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowlistingError] = useState<string | boolean>(
    false
  );
  const [functionStart, setFunctionStart] = useState(false);

  const [userListings, setUserListings] = useState<ListingType[]>([]);
  const [, , removeCookie] = useCookies();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const dispatch = useDispatch();

  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`https://real-estate-mern-server.vercel.app/api/user/update/${currentUser?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error: any) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleFileUpload = (file: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.log(error.message);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`https://real-estate-mern-server.vercel.app/api/user/delete/${currentUser?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error: any) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("https://real-estate-mern-server.vercel.app/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      removeCookie('access_token')
      dispatch(signOutUserSuccess());
    } catch (error: any) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setShowlistingError(false);
      const res = await fetch(`https://real-estate-mern-server.vercel.app/api/user/listings/${currentUser?._id}`);
      const listings = await res.json();
      if (listings.success === false) {
        setShowlistingError(listings.message);
        return;
      }
      setUserListings(listings);
      console.log(userListings);
    } catch (error) {
      setShowlistingError(true);
    }
  };

  const handleListingDelete = async (id: string) => {
    setFunctionStart(true);
    try {
      const res = await fetch(`https://real-estate-mern-server.vercel.app/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setFunctionStart(false);
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings(
        userListings?.filter((listing) => listing._id !== id)
      );
    } catch (error:any) {
      setFunctionStart(false);
      console.log(error.message);
    }
  };



  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files![0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        {currentUser!.avatar ? (
          <img
            onClick={() => fileRef.current!.click()}
            src={currentUser!.avatar || formData.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          />
        ) : (
          <FaUserAlt
            onClick={() => fileRef.current!.click()}
            className="text-9xl text-slate-700 cursor-pointer self-center"
          />
        )}

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser!.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser!.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <div className="relative">
          <div className="flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border p-3 rounded-lg flex-1"
              id="password"
              onChange={handleChange}
            />
            <div className="absolute right-3">
              {showPassword ? (
                <BiShow
                  className="text-gray-500 cursor-pointer"
                  onClick={handleShowPassword}
                />
              ) : (
                <BiHide
                  className="text-gray-500 cursor-pointer"
                  onClick={handleShowPassword}
                />
              )}
            </div>
          </div>
        </div>
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>

      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && (
        <p className="text-green-700 mt-5">User updated successfully</p>
      )}

      <button onClick={handleShowListing} className="text-green-700 w-full">
        Show Listings
      </button>
      {showListingError && (
        <p className="text-red-500 mt-5">
          Error occured while showing listings
        </p>
      )}

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  {functionStart ? "Deleting..." : "Delete"}
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

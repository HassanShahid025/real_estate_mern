import express  from "express";
import { createListing, deleteListing, getListing, getListings, updateListing } from "../controllers/listing-controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router()


router.post('/create',createListing)
router.delete('/delete/:id',deleteListing)
router.patch('/update/:id',updateListing)
router.get('/get/:id',getListing)
router.get('/get',getListings)

// router.post('/create',verifyToken,createListing)
// router.delete('/delete/:id',verifyToken,deleteListing)
// router.patch('/update/:id',verifyToken,updateListing)
// router.get('/get/:id',getListing)
// router.get('/get',getListings)

export default router;
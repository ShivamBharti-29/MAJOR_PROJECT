const express = require ("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn ,isOwner,validateListing} = require("../middleware.js");
const listingController =require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});




router.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn,upload.single('listing[image]') ,validateListing,  wrapAsync (listingController.createListing));


router.get("/new",isLoggedIn ,listingController.renderNewForm);

router.get("/search", isLoggedIn, wrapAsync(async (req, res) => {
    const { query } = req.query;

    let filter = {};
    if (query) {
        const searchRegex = new RegExp(query, 'i'); 
        filter.$or = [
            { title: { $regex: searchRegex } },
            { location: { $regex: searchRegex } },
            { country: { $regex: searchRegex } }
        ];
    } else {
        const allListings = await Listing.find({});
        res.render("listings/search_results.ejs", { listings: allListings, query: "" });
        return; 
    }
    try {
        const filteredListings = await Listing.find(filter);
        res.render("listings/search_results.ejs", { listings: filteredListings, query });
    } catch (err) {
        console.error(err);
        req.flash("error", "An error occurred during the search.");
        res.redirect("/listings");
    }
}));
  


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing , wrapAsync(listingController.updateListing ))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destoryListing));

router.get("/:id/edit",isLoggedIn,isOwner , wrapAsync(listingController.renderEditForm)); 




module.exports= router ;
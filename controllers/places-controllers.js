const uuid = require('uuid').v4;
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

let DUMMMY_PLACES = [
    {
        id: 'p1',
        title: 'Malcha Basketball Arena',
        description: 'The best Basketball hall ever',
        location: {
            lat: 31.751318,
            lng: 35.1941643
        },
        address: 'Yalla Hapoel',
        creator: 'u1'
    }
];

const getPlaceById =  (req, res, next) => {
    const placeId = req.params.pid;

    const place = DUMMMY_PLACES.find(p => {
        return p.id === placeId;
    });
    
    if (!place) {
        throw new HttpError('Could not find a user for thet provieded id.', 404);
    }

    res.json({place});
};




const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    
    const places = DUMMMY_PLACES.filter(p => {
        return p.creator === userId;
    });

    if (!places || places.length === 0) {    
        return next(
            new HttpError('Could not find places for thet provieded user id.', 404)
        );
    }

    res.json({places});
};

const createPlace = (req, res, next) => {
    const errors =  validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid input passed, please check your data.', 422);
    }

    const {title, description, coordinates, address, creator} = req.body;

    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };

    DUMMMY_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace});
};

const updatePlace = (req, res, next) => {    
    const errors =  validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid input passed, please check your data.', 422);
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatePlace = { ...DUMMMY_PLACES.find(p => p.id === placeId) }; 
    const placeIndex = DUMMMY_PLACES.findIndex(p => p.id === placeId);
    updatePlace.title = title;
    updatePlace.description = description;

    DUMMMY_PLACES[placeIndex] = updatePlace;

    res.status(200).json({place: updatePlace});
};

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if(!DUMMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError('Could not find place for this id,', 404);
    }
    DUMMMY_PLACES = DUMMMY_PLACES.filter(p => p.id !== placeId);
    res.status(200).json({message: 'Deleted place.'});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId; 
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

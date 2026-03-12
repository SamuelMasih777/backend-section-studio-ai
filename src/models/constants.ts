const constants = {
    httpStatus: {
        success: 200,
        created: 201,
        badRequest: 400,
        unauthorized: 401,
        forbidden: 403,
        notFound: 404,
        serverError: 500,
    },
    roles: {
        admin: "admin",
        user: "user",
        rider: "rider",
        driver: "driver",
        deliveryPartner: "deliveryPartner",
        partnerUser: "partnerUser"
    },
    messageType: {
        IMAGE: "image",
        VIDEO: "video",
        AUDIO: "audio",
        TEXT: "text"
    },
    maxFileUploadSize: 5 * 1024 * 1024, // 5MB
    maxVideoFileUploadSize: 50 * 1024 * 1024, // 50MB
    largeFileMimeTypePrefixes: ["video/", "audio/"],
};

export default constants;

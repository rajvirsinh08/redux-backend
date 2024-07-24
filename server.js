// const express = require("express");

// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const userRoute = require("./Routes/userRoutes");

// dotenv.config();
// const app = express();

// app.use(express.json());
// app.use(cors({
//     origin: "*",
//     methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
// }));
// app.use('/uploads', express.static('uploads'));
// app.use(userRoute);

// mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("Connected to MongoDB");

//         app.listen(process.env.PORT || 8000, () => {
//             console.log(`Server running on port ${process.env.PORT || 8000}`);
//         });
//     })
//     .catch(error => {
//         console.error("Error connecting to MongoDB:", error);
//     });


// // Error handling middleware
// // app.use((err, req, res, next) => {
// //     console.error(err.stack);
// //     res.status(500).send('Something broke!');
// // });
// app.use(cors(), function (req, res, next) {
//     console.log(req);
//     res.header(
//         'Access-Control-Allow-Origin',
//         'https://redux-backend.vercel.app/'
//     );
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept'
//     );
//     next();
// });
// module.exports = app;

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoute = require("./Routes/userRoutes");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors(), function (req, res, next) {
    console.log(req);
    res.header(
        'Access-Control-Allow-Origin',
        '*'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});
app.use('/uploads', express.static('uploads'));
app.use(userRoute);

let isConnected = false;

mongoose.connect(process.env.URI)
    .then(() => {
        console.log("Connected to MongoDB");
        isConnected = true;
        
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT || 8000}`);
        });
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error);
    });

// Error handling middleware    
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

// app.get("/", (req, res) => {
//     res.status(200).send("Welcome to my simple Node.js app!");
// });

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

module.exports = app;

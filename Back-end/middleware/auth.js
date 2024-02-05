import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/userModel'; 
dotenv.config();


const verifyToken = async(token) => {
    return jwt.verify(token, process.env.SECRET_STRING);
};
export const authenticate = async (req, res, next) => {
  console.log();
  try {
      const token = req.cookies.token;
      if (!token) {
          return res.status(401).json({ message: "Invalid token" });
      }
      const decoded =await  verifyToken(token);
      console.log(decoded);
      
      // Populate the 'roles' field to get the role details
      const user = await User.findById(decoded.id);

      if (!user) {
          return res.status(401).json({ message: "Invalid token" });
      }


      req.admin = admin;
      // console.log("here decoded", admin);
      next();
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};




// export const AdminRole = (requiredRoles) => async (req, res, next) => {
//   try {
//     if (req.admin) {
//       const adminRole = req.admin.roles.name;

//       // Check if the admin's role matches any of the required roles
//       if (requiredRoles.includes(adminRole)) {
//         next();
//       } else {
//         // User does not have the required role, send a Forbidden response
//         res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
//       }
//     } else {
//       // If req.admin is not available, handle the error
//       res.status(401).json({ message: 'Unauthorized: Admin details not found.' });
//     }
//   } catch (error) {
//     console.error('Error in AdminRole middleware:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };

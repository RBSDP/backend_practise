import User from "../model/User.model";


const registerUser = async (reg,res) =>{



    const {name, email, password} = req.body

    // validation
    if(!name || !email || !password){
        return res.status(400).json({
            message : "All feilds are required"
        })
    }

    // check if user exists

    try {
       const existingUser = await User.findOne({email})
       if(existingUser){
        return res.status(400).json({
            message : "user already exists"
        })
       }
    } catch (error) {
        
    }
};

export {registerUser}